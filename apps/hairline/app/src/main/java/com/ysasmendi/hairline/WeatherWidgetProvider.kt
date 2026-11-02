package com.ysasmendi.hairline

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Bundle

class WeatherWidgetProvider : AppWidgetProvider() {

    override fun onEnabled(context: Context) {
        Scheduler.ensurePeriodicRefresh(context)
        Scheduler.armHourlyRepaint(context)
        Scheduler.refreshNow(context)
    }

    override fun onUpdate(context: Context, mgr: AppWidgetManager, appWidgetIds: IntArray) {
        for (id in appWidgetIds) WidgetRenderer.render(context, mgr, id)
        Scheduler.ensurePeriodicRefresh(context)
        Scheduler.armHourlyRepaint(context)
        if (Cache.isStale(context)) Scheduler.refreshNow(context)
    }

    override fun onAppWidgetOptionsChanged(
        context: Context,
        mgr: AppWidgetManager,
        appWidgetId: Int,
        newOptions: Bundle,
    ) {
        // Resized: the column count is derived from the width, so repaint.
        WidgetRenderer.render(context, mgr, appWidgetId)
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_RENDER) WidgetRenderer.updateAll(context)
    }

    override fun onDisabled(context: Context) {
        Scheduler.cancelAll(context)
    }

    companion object {
        const val ACTION_RENDER = "com.ysasmendi.hairline.RENDER"
    }
}

object Cache {
    private const val STALE_AFTER_SEC = 90L * 60L

    fun isStale(context: Context): Boolean {
        val forecast = Prefs.cachedForecast(context) ?: return true
        return System.currentTimeMillis() / 1000 - forecast.fetchedAt > STALE_AFTER_SEC
    }
}
