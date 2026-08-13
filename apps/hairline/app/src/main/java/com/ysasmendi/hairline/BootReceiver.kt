package com.ysasmendi.hairline

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Alarms do not survive a reboot or a package replace, so re-arm them. */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action !in HANDLED) return
        Scheduler.ensurePeriodicRefresh(context)
        Scheduler.armHourlyRepaint(context)
        WidgetRenderer.updateAll(context)
        if (Cache.isStale(context)) Scheduler.refreshNow(context)
    }

    private companion object {
        val HANDLED = setOf(
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED,
            Intent.ACTION_TIMEZONE_CHANGED,
        )
    }
}
