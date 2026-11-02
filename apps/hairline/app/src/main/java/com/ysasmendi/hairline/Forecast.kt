package com.ysasmendi.hairline

import org.json.JSONArray
import org.json.JSONObject

/** One hourly slot, always stored in Celsius; the display unit is applied at paint time. */
data class HourSlot(
    val epochSec: Long,
    val tempC: Double,
    val precipProbability: Int,
    val weatherCode: Int,
    val isDay: Boolean,
)

data class Forecast(
    val fetchedAt: Long,
    /** Seconds to add to [HourSlot.epochSec] to get wall-clock time at the forecast location. */
    val utcOffsetSec: Int,
    val place: Place,
    val hours: List<HourSlot>,
) {

    /** Slots from the hour we are currently inside onwards, oldest first. */
    fun upcoming(nowSec: Long, count: Int): List<HourSlot> =
        hours.filter { it.epochSec + 3600 > nowSec }.take(count)

    fun toJson(): String {
        val arr = JSONArray()
        for (h in hours) {
            arr.put(
                JSONObject()
                    .put("t", h.epochSec)
                    .put("c", h.tempC)
                    .put("p", h.precipProbability)
                    .put("w", h.weatherCode)
                    .put("d", h.isDay),
            )
        }
        return JSONObject()
            .put("fetchedAt", fetchedAt)
            .put("offset", utcOffsetSec)
            .put("lat", place.lat)
            .put("lon", place.lon)
            .put("label", place.label)
            .put("hours", arr)
            .toString()
    }

    companion object {
        fun fromJson(raw: String): Forecast? = try {
            val o = JSONObject(raw)
            val arr = o.getJSONArray("hours")
            val hours = ArrayList<HourSlot>(arr.length())
            for (i in 0 until arr.length()) {
                val h = arr.getJSONObject(i)
                hours.add(
                    HourSlot(
                        epochSec = h.getLong("t"),
                        tempC = h.getDouble("c"),
                        precipProbability = h.optInt("p", 0),
                        weatherCode = h.optInt("w", 0),
                        isDay = h.optBoolean("d", true),
                    ),
                )
            }
            Forecast(
                fetchedAt = o.getLong("fetchedAt"),
                utcOffsetSec = o.getInt("offset"),
                place = Place(o.getDouble("lat"), o.getDouble("lon"), o.optString("label", "")),
                hours = hours,
            )
        } catch (e: Exception) {
            null
        }
    }
}
