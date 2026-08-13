package com.ysasmendi.hairline

import android.content.Context
import android.content.SharedPreferences

/**
 * Every setting is global: one look for every placed widget. Keeps the config screen honest and
 * means a settings change repaints all of them at once.
 */
object Prefs {

    private const val FILE = "hairline"

    const val TAP_WINDY = "windy"
    const val TAP_VENTUSKY = "ventusky"
    const val TAP_BROWSER = "browser"
    const val TAP_NONE = "none"

    const val LOC_AUTO = "auto"
    const val LOC_MANUAL = "manual"

    const val ICONS_COLOUR = "colour"
    const val ICONS_MONO = "mono"

    private const val KEY_UNIT_F = "unit_fahrenheit"
    private const val KEY_TAP = "tap_target"
    private const val KEY_ICONS = "icon_style"
    private const val KEY_HOURS = "hours_override"
    private const val KEY_PRECIP = "show_precip"
    private const val KEY_LOC_MODE = "location_mode"
    private const val KEY_LAT = "manual_lat"
    private const val KEY_LON = "manual_lon"
    private const val KEY_PLACE = "manual_place"
    private const val KEY_FORECAST = "forecast_json"

    fun of(context: Context): SharedPreferences =
        context.applicationContext.getSharedPreferences(FILE, Context.MODE_PRIVATE)

    fun useFahrenheit(context: Context): Boolean = of(context).getBoolean(KEY_UNIT_F, false)

    fun setUseFahrenheit(context: Context, value: Boolean) =
        of(context).edit().putBoolean(KEY_UNIT_F, value).apply()

    fun tapTarget(context: Context): String = of(context).getString(KEY_TAP, TAP_WINDY) ?: TAP_WINDY

    fun setTapTarget(context: Context, value: String) =
        of(context).edit().putString(KEY_TAP, value).apply()

    fun iconStyle(context: Context): String =
        of(context).getString(KEY_ICONS, ICONS_COLOUR) ?: ICONS_COLOUR

    fun setIconStyle(context: Context, value: String) =
        of(context).edit().putString(KEY_ICONS, value).apply()

    /** 0 means "derive the column count from how wide the widget was drawn". */
    fun hoursOverride(context: Context): Int = of(context).getInt(KEY_HOURS, 0)

    fun setHoursOverride(context: Context, value: Int) =
        of(context).edit().putInt(KEY_HOURS, value).apply()

    fun showPrecipitation(context: Context): Boolean = of(context).getBoolean(KEY_PRECIP, false)

    fun setShowPrecipitation(context: Context, value: Boolean) =
        of(context).edit().putBoolean(KEY_PRECIP, value).apply()

    fun locationMode(context: Context): String =
        of(context).getString(KEY_LOC_MODE, LOC_AUTO) ?: LOC_AUTO

    fun manualPlace(context: Context): Place? {
        val p = of(context)
        if (!p.contains(KEY_LAT) || !p.contains(KEY_LON)) return null
        return Place(
            lat = java.lang.Double.longBitsToDouble(p.getLong(KEY_LAT, 0L)),
            lon = java.lang.Double.longBitsToDouble(p.getLong(KEY_LON, 0L)),
            label = p.getString(KEY_PLACE, "") ?: "",
        )
    }

    fun setManualPlace(context: Context, place: Place?) {
        val e = of(context).edit()
        if (place == null) {
            e.remove(KEY_LAT).remove(KEY_LON).remove(KEY_PLACE)
        } else {
            e.putLong(KEY_LAT, java.lang.Double.doubleToRawLongBits(place.lat))
                .putLong(KEY_LON, java.lang.Double.doubleToRawLongBits(place.lon))
                .putString(KEY_PLACE, place.label)
        }
        e.apply()
    }

    fun setLocationMode(context: Context, value: String) =
        of(context).edit().putString(KEY_LOC_MODE, value).apply()

    fun cachedForecast(context: Context): Forecast? =
        of(context).getString(KEY_FORECAST, null)?.let { Forecast.fromJson(it) }

    fun setCachedForecast(context: Context, forecast: Forecast) =
        of(context).edit().putString(KEY_FORECAST, forecast.toJson()).apply()
}

data class Place(val lat: Double, val lon: Double, val label: String)
