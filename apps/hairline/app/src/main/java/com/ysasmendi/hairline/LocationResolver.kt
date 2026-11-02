package com.ysasmendi.hairline

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import androidx.core.content.ContextCompat

/**
 * Deliberately uses the platform [LocationManager] rather than Play Services: last known fix is
 * plenty for a weather forecast and it keeps the APK dependency-free.
 */
object LocationResolver {

    fun hasPermission(context: Context): Boolean =
        ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED

    /**
     * Manual place wins when configured. Otherwise the freshest device fix, and if there is none,
     * whatever location the last successful fetch used — better a slightly stale city than a blank
     * widget.
     */
    fun resolve(context: Context): Place? {
        if (Prefs.locationMode(context) == Prefs.LOC_MANUAL) {
            Prefs.manualPlace(context)?.let { return it }
        }
        deviceLocation(context)?.let {
            return Place(it.latitude, it.longitude, WeatherApi.describe(it.latitude, it.longitude))
        }
        Prefs.cachedForecast(context)?.let { return it.place }
        return Prefs.manualPlace(context)
    }

    private fun deviceLocation(context: Context): Location? {
        if (!hasPermission(context)) return null
        val lm = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager ?: return null
        val providers = listOf(
            LocationManager.GPS_PROVIDER,
            LocationManager.NETWORK_PROVIDER,
            LocationManager.PASSIVE_PROVIDER,
        )
        var best: Location? = null
        for (provider in providers) {
            val fix = try {
                lm.getLastKnownLocation(provider)
            } catch (e: SecurityException) {
                null
            } catch (e: IllegalArgumentException) {
                null
            } ?: continue
            if (best == null || fix.time > best.time) best = fix
        }
        return best
    }
}
