package com.ysasmendi.hairline

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.io.IOException

/**
 * Fetches the forecast and repaints every widget. Runs on WorkManager's background thread, so the
 * network call here is deliberately blocking.
 */
class RefreshWorker(context: Context, params: WorkerParameters) : Worker(context, params) {

    override fun doWork(): Result {
        val context = applicationContext
        val place = LocationResolver.resolve(context)
        if (place == null) {
            // Nothing to fetch for yet; repaint so the widget can say so.
            WidgetRenderer.updateAll(context)
            return Result.success()
        }
        return try {
            val forecast = WeatherApi.fetch(place.lat, place.lon, place.label)
            Prefs.setCachedForecast(context, forecast)
            WidgetRenderer.updateAll(context)
            Result.success()
        } catch (e: IOException) {
            WidgetRenderer.updateAll(context)
            if (runAttemptCount < 3) Result.retry() else Result.success()
        } catch (e: org.json.JSONException) {
            Result.success()
        }
    }
}
