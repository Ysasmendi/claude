package com.ysasmendi.hairline

import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

/**
 * Open-Meteo: free, keyless, no attribution requirement for non-commercial use, and it returns WMO
 * weather codes plus a day/night flag per hour — which is all the widget draws.
 */
object WeatherApi {

    private const val FORECAST_HOURS = 48
    private const val TIMEOUT_MS = 12_000

    @Throws(IOException::class)
    fun fetch(lat: Double, lon: Double, label: String): Forecast {
        val url = "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + fmt(lat) +
            "&longitude=" + fmt(lon) +
            "&hourly=temperature_2m,precipitation_probability,weather_code,is_day" +
            "&timeformat=unixtime" +
            "&timezone=auto" +
            "&forecast_hours=" + FORECAST_HOURS
        val body = get(url)
        val root = JSONObject(body)
        val hourly = root.getJSONObject("hourly")
        val times = hourly.getJSONArray("time")
        val temps = hourly.getJSONArray("temperature_2m")
        val codes = hourly.getJSONArray("weather_code")
        val isDay = hourly.getJSONArray("is_day")
        val precip = hourly.optJSONArray("precipitation_probability")

        val slots = ArrayList<HourSlot>(times.length())
        for (i in 0 until times.length()) {
            if (temps.isNull(i) || codes.isNull(i)) continue
            slots.add(
                HourSlot(
                    epochSec = times.getLong(i),
                    tempC = temps.getDouble(i),
                    precipProbability = precip?.optInt(i, 0) ?: 0,
                    weatherCode = codes.getInt(i),
                    isDay = isDay.optInt(i, 1) == 1,
                ),
            )
        }
        if (slots.isEmpty()) throw IOException("Open-Meteo returned no hourly rows")

        return Forecast(
            fetchedAt = System.currentTimeMillis() / 1000,
            utcOffsetSec = root.optInt("utc_offset_seconds", 0),
            place = Place(lat, lon, label),
            hours = slots,
        )
    }

    /** Resolves a typed place name to coordinates. Returns null when nothing matches. */
    @Throws(IOException::class)
    fun geocode(query: String): Place? {
        val url = "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" + java.net.URLEncoder.encode(query, "UTF-8") +
            "&count=1&language=es&format=json"
        val results = JSONObject(get(url)).optJSONArray("results") ?: return null
        if (results.length() == 0) return null
        val first = results.getJSONObject(0)
        val parts = listOfNotNull(
            first.optString("name").takeIf { it.isNotEmpty() },
            first.optString("admin1").takeIf { it.isNotEmpty() },
            first.optString("country").takeIf { it.isNotEmpty() },
        )
        return Place(
            lat = first.getDouble("latitude"),
            lon = first.getDouble("longitude"),
            label = parts.joinToString(", "),
        )
    }

    /** Best-effort reverse label for coordinates; falls back to the rounded coordinates. */
    fun describe(lat: Double, lon: Double): String = fmt(lat) + ", " + fmt(lon)

    @Throws(IOException::class)
    private fun get(url: String): String {
        val conn = URL(url).openConnection() as HttpURLConnection
        try {
            conn.requestMethod = "GET"
            conn.connectTimeout = TIMEOUT_MS
            conn.readTimeout = TIMEOUT_MS
            conn.setRequestProperty("Accept", "application/json")
            conn.setRequestProperty("User-Agent", "Hairline/1.0 (Android widget)")
            val code = conn.responseCode
            if (code !in 200..299) throw IOException("HTTP $code from ${URL(url).host}")
            return conn.inputStream.bufferedReader().use { it.readText() }
        } finally {
            conn.disconnect()
        }
    }

    private fun fmt(v: Double): String = String.format(java.util.Locale.US, "%.4f", v)
}
