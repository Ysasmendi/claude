package com.ysasmendi.hairline

import android.graphics.Bitmap
import android.graphics.Canvas
import android.provider.Settings
import android.util.TypedValue
import android.view.View
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import androidx.test.core.app.ApplicationProvider
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/**
 * Inflates the real widget RemoteViews off-device and writes PNGs to
 * `app/build/outputs/widget-preview/`, which is the only way to eyeball the layout without an
 * emulator. Also asserts the pieces that are easy to break silently: column count, hour labels and
 * the unit conversion.
 */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [34], qualifiers = "w411dp-h891dp-xxhdpi")
class WidgetRenderTest {

    private val context = ApplicationProvider.getApplicationContext<android.content.Context>()

    @Before
    fun useTwentyFourHourClock() {
        setClock("24")
    }

    private fun setClock(value: String) {
        Settings.System.putString(context.contentResolver, Settings.System.TIME_12_24, value)
    }

    private fun forecast(offsetSec: Int = 7200, start: Long = FIXED_NOW): Forecast {
        val codes = listOf(0, 1, 0, 2, 3, 61, 95, 71, 45, 51, 2, 0)
        val temps = listOf(35.0, 39.0, 37.0, 33.0, 29.0, 26.0, 24.0, 30.0, 22.4, 21.6, 19.9, 18.2)
        val hours = (0 until 12).map { i ->
            val epoch = start - start % 3600 + i * 3600
            val localHour = Math.floorMod((epoch + offsetSec) / 3600L, 24L).toInt()
            HourSlot(
                epochSec = epoch,
                tempC = temps[i],
                precipProbability = if (codes[i] in listOf(61, 51, 95, 71)) 60 else 5,
                weatherCode = codes[i],
                isDay = localHour in 7..20,
            )
        }
        return Forecast(FIXED_NOW, offsetSec, Place(42.43, -8.65, "Pontevedra"), hours)
    }

    private fun render(name: String, columns: Int, widthDp: Int, configure: () -> Unit = {}) {
        configure()
        val views = WidgetRenderer.buildViews(context, columns, forecast(), FIXED_NOW)
        val parent = FrameLayout(context)
        val inflated: View = views.apply(context, parent)

        val widthPx = TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            widthDp.toFloat(),
            context.resources.displayMetrics,
        ).toInt()
        inflated.measure(
            View.MeasureSpec.makeMeasureSpec(widthPx, View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
        )
        inflated.layout(0, 0, widthPx, inflated.measuredHeight)

        val bitmap = Bitmap.createBitmap(widthPx, inflated.measuredHeight, Bitmap.Config.ARGB_8888)
        // Dark stand-in for a wallpaper: the widget itself is transparent.
        Canvas(bitmap).apply {
            drawColor(0xFF0B0D12.toInt())
            inflated.draw(this)
        }
        val dir = File("build/outputs/widget-preview").apply { mkdirs() }
        File(dir, "$name.png").outputStream().use {
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
        }
    }

    @Test
    fun rendersEightColumnsLikeTheReferenceScreenshot() {
        render("widget-8-colour", columns = 8, widthDp = 400)

        val views = WidgetRenderer.buildViews(context, 8, forecast(), FIXED_NOW)
        val root = views.apply(context, FrameLayout(context))
        val hours = root.findViewById<LinearLayout>(R.id.hours)
        assertEquals(8, hours.childCount)

        val firstTime = hours.getChildAt(0).findViewById<TextView>(R.id.hour_time)
        val firstTemp = hours.getChildAt(0).findViewById<TextView>(R.id.hour_temp)
        assertEquals("14:00", firstTime.text.toString())
        assertEquals("35°", firstTemp.text.toString())

        val lastTime = hours.getChildAt(7).findViewById<TextView>(R.id.hour_time)
        assertEquals("21:00", lastTime.text.toString())
    }

    @Test
    fun rendersMonoIconsAndFahrenheitAndRainOdds() {
        render("widget-8-mono-f", columns = 8, widthDp = 400) {
            Prefs.setIconStyle(context, Prefs.ICONS_MONO)
            Prefs.setUseFahrenheit(context, true)
            Prefs.setShowPrecipitation(context, true)
        }
        val views = WidgetRenderer.buildViews(context, 8, forecast(), FIXED_NOW)
        val root = views.apply(context, FrameLayout(context))
        val hours = root.findViewById<LinearLayout>(R.id.hours)
        // 35 °C is 95 °F.
        assertEquals("95°", hours.getChildAt(0).findViewById<TextView>(R.id.hour_temp).text.toString())

        val rainy = hours.getChildAt(5).findViewById<TextView>(R.id.hour_precip)
        assertEquals(View.VISIBLE, rainy.visibility)
        assertEquals("60%", rainy.text.toString())

        Prefs.setIconStyle(context, Prefs.ICONS_COLOUR)
        Prefs.setUseFahrenheit(context, false)
        Prefs.setShowPrecipitation(context, false)
    }

    @Test
    fun hourLabelsFollowTheSystemClockFormat() {
        setClock("12")
        val hours = WidgetRenderer.buildViews(context, 3, forecast(), FIXED_NOW)
            .apply(context, FrameLayout(context))
            .findViewById<LinearLayout>(R.id.hours)
        assertEquals("2pm", hours.getChildAt(0).findViewById<TextView>(R.id.hour_time).text.toString())
        assertEquals("4pm", hours.getChildAt(2).findViewById<TextView>(R.id.hour_time).text.toString())
    }

    @Test
    fun rendersNarrowWidget() {
        render("widget-4-narrow", columns = 4, widthDp = 200)
        val views = WidgetRenderer.buildViews(context, 4, forecast(), FIXED_NOW)
        val hours = views.apply(context, FrameLayout(context)).findViewById<LinearLayout>(R.id.hours)
        assertEquals(4, hours.childCount)
    }

    @Test
    fun emptyStateWhenThereIsNoForecast() {
        val views = WidgetRenderer.buildViews(context, 8, null, FIXED_NOW)
        val root = views.apply(context, FrameLayout(context))
        assertEquals(View.GONE, root.findViewById<View>(R.id.hours).visibility)
        val status = root.findViewById<TextView>(R.id.status)
        assertEquals(View.VISIBLE, status.visibility)
        assertTrue(status.text.isNotEmpty())
    }

    @Test
    fun pastHoursAreDropped() {
        val f = forecast()
        // Half past the hour: the current hour must still be the first column.
        val slots = f.upcoming(FIXED_NOW + 1800, 8)
        assertEquals(f.hours[0].epochSec, slots[0].epochSec)
        // An hour later it rolls over.
        val next = f.upcoming(FIXED_NOW + 3700, 8)
        assertEquals(f.hours[1].epochSec, next[0].epochSec)
    }

    @Test
    fun forecastSurvivesJsonRoundTrip() {
        val original = forecast()
        val restored = Forecast.fromJson(original.toJson())!!
        assertEquals(original.hours.size, restored.hours.size)
        assertEquals(original.utcOffsetSec, restored.utcOffsetSec)
        assertEquals(original.place.label, restored.place.label)
        assertEquals(original.hours[3].weatherCode, restored.hours[3].weatherCode)
        assertEquals(original.hours[3].tempC, restored.hours[3].tempC, 0.001)
        assertEquals(original.hours[3].isDay, restored.hours[3].isDay)
    }

    private companion object {
        /** 2026-08-13 12:00:00 UTC, i.e. 14:00 in Madrid — same start as the reference shot. */
        const val FIXED_NOW = 1_786_622_400L
    }
}
