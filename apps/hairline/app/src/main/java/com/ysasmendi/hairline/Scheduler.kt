package com.ysasmendi.hairline

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

/**
 * Two clocks, on purpose:
 *  - WorkManager pulls new numbers from Open-Meteo every 30 minutes, only when there is a network.
 *  - An inexact hourly alarm repaints from cache so the columns roll over on the hour even if the
 *    fetch is deferred by Doze.
 */
object Scheduler {

    private const val WORK_PERIODIC = "hairline-refresh"
    private const val WORK_ONE_SHOT = "hairline-refresh-now"
    private const val ALARM_REQUEST = 1001

    fun ensurePeriodicRefresh(context: Context) {
        val request = PeriodicWorkRequestBuilder<RefreshWorker>(30, TimeUnit.MINUTES)
            .setConstraints(
                Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build(),
            )
            .setBackoffCriteria(androidx.work.BackoffPolicy.LINEAR, 5, TimeUnit.MINUTES)
            .build()
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            WORK_PERIODIC,
            ExistingPeriodicWorkPolicy.KEEP,
            request,
        )
    }

    fun refreshNow(context: Context) {
        val request = OneTimeWorkRequestBuilder<RefreshWorker>()
            .setConstraints(
                Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build(),
            )
            .build()
        WorkManager.getInstance(context).enqueueUniqueWork(
            WORK_ONE_SHOT,
            ExistingWorkPolicy.REPLACE,
            request,
        )
    }

    fun armHourlyRepaint(context: Context) {
        val alarms = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
        val hourMs = TimeUnit.HOURS.toMillis(1)
        val nextHour = (System.currentTimeMillis() / hourMs + 1) * hourMs + 2_000L
        alarms.setInexactRepeating(AlarmManager.RTC, nextHour, hourMs, repaintIntent(context))
    }

    fun cancelAll(context: Context) {
        WorkManager.getInstance(context).cancelUniqueWork(WORK_PERIODIC)
        (context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager)
            ?.cancel(repaintIntent(context))
    }

    private fun repaintIntent(context: Context): PendingIntent {
        val intent = Intent(context, WeatherWidgetProvider::class.java).apply {
            action = WeatherWidgetProvider.ACTION_RENDER
            component = ComponentName(context, WeatherWidgetProvider::class.java)
        }
        return PendingIntent.getBroadcast(
            context,
            ALARM_REQUEST,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }
}
