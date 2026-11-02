package com.ysasmendi.hairline

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.text.format.DateFormat
import android.view.View
import android.widget.RemoteViews
import java.util.Locale

object WidgetRenderer {

    private const val MONO_TINT = 0xFFFFFFFF.toInt()

    /** Minimum comfortable width for one hour column, used to pick the column count. */
    private const val COLUMN_DP = 44

    fun updateAll(context: Context) {
        val mgr = AppWidgetManager.getInstance(context)
        val ids = mgr.getAppWidgetIds(ComponentName(context, WeatherWidgetProvider::class.java))
        for (id in ids) render(context, mgr, id)
    }

    fun render(context: Context, mgr: AppWidgetManager, widgetId: Int) {
        val views = buildViews(
            context = context,
            columns = columnCount(context, mgr, widgetId),
            forecast = Prefs.cachedForecast(context),
            nowSec = System.currentTimeMillis() / 1000,
        )
        mgr.updateAppWidget(widgetId, views)
    }

    /** Split out from [render] so tests can inflate and screenshot the result. */
    fun buildViews(
        context: Context,
        columns: Int,
        forecast: Forecast?,
        nowSec: Long,
    ): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_root)
        val slots = forecast?.upcoming(nowSec, columns).orEmpty()

        views.removeAllViews(R.id.hours)
        if (slots.isEmpty() || forecast == null) {
            views.setViewVisibility(R.id.hours, View.GONE)
            views.setViewVisibility(R.id.status, View.VISIBLE)
            val message = if (LocationResolver.resolve(context) == null) {
                R.string.widget_no_location
            } else {
                R.string.widget_empty
            }
            views.setTextViewText(R.id.status, context.getString(message))
        } else {
            views.setViewVisibility(R.id.hours, View.VISIBLE)
            views.setViewVisibility(R.id.status, View.GONE)

            val mono = Prefs.iconStyle(context) == Prefs.ICONS_MONO
            val fahrenheit = Prefs.useFahrenheit(context)
            val showPrecip = Prefs.showPrecipitation(context)
            val is24h = DateFormat.is24HourFormat(context)

            for (slot in slots) {
                val column = RemoteViews(context.packageName, R.layout.widget_hour)
                column.setTextViewText(
                    R.id.hour_time,
                    hourLabel(slot.epochSec + forecast.utcOffsetSec, is24h),
                )
                column.setImageViewResource(
                    R.id.hour_icon,
                    WmoIcons.forCode(slot.weatherCode, slot.isDay),
                )
                if (mono) column.setInt(R.id.hour_icon, "setColorFilter", MONO_TINT)
                column.setTextViewText(R.id.hour_temp, temperature(slot.tempC, fahrenheit))
                when {
                    !showPrecip -> column.setViewVisibility(R.id.hour_precip, View.GONE)
                    slot.precipProbability >= 20 -> {
                        column.setViewVisibility(R.id.hour_precip, View.VISIBLE)
                        column.setTextViewText(R.id.hour_precip, "${slot.precipProbability}%")
                    }
                    // Keep the row's height stable so the temperatures stay on one baseline.
                    else -> column.setViewVisibility(R.id.hour_precip, View.INVISIBLE)
                }
                views.addView(R.id.hours, column)
            }
        }

        views.setOnClickPendingIntent(R.id.root, tapIntent(context, forecast))
        return views
    }

    private fun columnCount(context: Context, mgr: AppWidgetManager, widgetId: Int): Int {
        Prefs.hoursOverride(context).let { if (it > 0) return it }
        val widthDp = mgr.getAppWidgetOptions(widgetId)
            .getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 250)
            .takeIf { it > 0 } ?: 250
        return (widthDp / COLUMN_DP).coerceIn(3, 12)
    }

    private fun hourLabel(localEpochSec: Long, is24h: Boolean): String {
        val hour = Math.floorMod(localEpochSec / 3600L, 24L).toInt()
        if (is24h) return String.format(Locale.US, "%02d:00", hour)
        val twelve = if (hour % 12 == 0) 12 else hour % 12
        return "$twelve${if (hour < 12) "am" else "pm"}"
    }

    private fun temperature(celsius: Double, fahrenheit: Boolean): String {
        val value = if (fahrenheit) celsius * 9.0 / 5.0 + 32.0 else celsius
        return "${Math.round(value)}°"
    }

    /**
     * A widget that opens nothing feels broken, so "none" still gets a no-op intent rather than a
     * dead tap target elsewhere in the launcher.
     */
    private fun tapIntent(context: Context, forecast: Forecast?): PendingIntent? {
        val target = Prefs.tapTarget(context)
        if (target == Prefs.TAP_NONE) return null

        val pm = context.packageManager
        val intent = when (target) {
            Prefs.TAP_WINDY -> pm.getLaunchIntentForPackage(PKG_WINDY)
            Prefs.TAP_VENTUSKY -> pm.getLaunchIntentForPackage(PKG_VENTUSKY)
            else -> null
        } ?: Intent(Intent.ACTION_VIEW, Uri.parse(windyUrl(forecast)))

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        return PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }

    private fun windyUrl(forecast: Forecast?): String {
        val place = forecast?.place ?: return "https://www.windy.com/"
        return String.format(
            Locale.US,
            "https://www.windy.com/?%.3f,%.3f,9",
            place.lat,
            place.lon,
        )
    }

    const val PKG_WINDY = "com.windyty.android"
    const val PKG_VENTUSKY = "cz.ackee.ventusky"
}
