package com.ysasmendi.hairline

import androidx.annotation.DrawableRes

/** WMO 4677 weather codes as returned by Open-Meteo, mapped onto the line icon set. */
object WmoIcons {

    @DrawableRes
    fun forCode(code: Int, isDay: Boolean): Int = when (code) {
        0 -> if (isDay) R.drawable.wx_clear_day else R.drawable.wx_clear_night
        1, 2 -> if (isDay) R.drawable.wx_partly_day else R.drawable.wx_partly_night
        3 -> R.drawable.wx_cloudy
        45, 48 -> R.drawable.wx_fog
        51, 53, 55 -> R.drawable.wx_drizzle
        56, 57, 66, 67 -> R.drawable.wx_sleet
        61, 63, 80, 81 -> R.drawable.wx_rain
        65, 82 -> R.drawable.wx_rain_heavy
        71, 73, 75, 77, 85, 86 -> R.drawable.wx_snow
        95, 96, 99 -> R.drawable.wx_thunder
        else -> if (isDay) R.drawable.wx_partly_day else R.drawable.wx_partly_night
    }
}
