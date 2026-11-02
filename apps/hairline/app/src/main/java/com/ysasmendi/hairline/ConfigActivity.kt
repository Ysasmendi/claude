package com.ysasmendi.hairline

import android.Manifest
import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.format.DateFormat
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Spinner
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import java.io.IOException
import java.util.Date
import java.util.concurrent.Executors

/**
 * Doubles as the widget's configuration screen and as the app's only activity, so settings can be
 * changed without long-pressing the widget.
 */
class ConfigActivity : AppCompatActivity() {

    private val io = Executors.newSingleThreadExecutor()
    private val main = Handler(Looper.getMainLooper())

    private var widgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private var pendingPlace: Place? = null

    private lateinit var locationGroup: RadioGroup
    private lateinit var manualRow: View
    private lateinit var placeInput: EditText
    private lateinit var placeStatus: TextView
    private lateinit var permissionNote: TextView
    private lateinit var permissionButton: Button
    private lateinit var unitGroup: RadioGroup
    private lateinit var iconGroup: RadioGroup
    private lateinit var hoursSpinner: Spinner
    private lateinit var precipCheck: CheckBox
    private lateinit var tapGroup: RadioGroup
    private lateinit var tapNote: TextView
    private lateinit var status: TextView

    private val hourOptions = listOf(0, 4, 5, 6, 7, 8, 9, 10, 12)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_config)

        widgetId = intent?.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID,
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID
        // Backing out of a first-time placement must leave no half-configured widget behind.
        setResult(Activity.RESULT_CANCELED, resultIntent())

        bindViews()
        loadSettings()
        refreshStatusLine()

        if (widgetId == AppWidgetManager.INVALID_APPWIDGET_ID &&
            AppWidgetManager.getInstance(this)
                .getAppWidgetIds(android.content.ComponentName(this, WeatherWidgetProvider::class.java))
                .isEmpty()
        ) {
            findViewById<TextView>(R.id.text_hint).visibility = View.VISIBLE
        }
    }

    private fun bindViews() {
        locationGroup = findViewById(R.id.radio_location)
        manualRow = findViewById(R.id.row_manual)
        placeInput = findViewById(R.id.edit_place)
        placeStatus = findViewById(R.id.text_place_status)
        permissionNote = findViewById(R.id.text_permission_note)
        permissionButton = findViewById(R.id.btn_permission)
        unitGroup = findViewById(R.id.radio_unit)
        iconGroup = findViewById(R.id.radio_icons)
        hoursSpinner = findViewById(R.id.spinner_hours)
        precipCheck = findViewById(R.id.check_precip)
        tapGroup = findViewById(R.id.radio_tap)
        tapNote = findViewById(R.id.text_tap_note)
        status = findViewById(R.id.text_status)

        val labels = hourOptions.map {
            if (it == 0) getString(R.string.hours_auto) else it.toString()
        }
        hoursSpinner.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_dropdown_item,
            labels,
        )

        locationGroup.setOnCheckedChangeListener { _, _ -> syncLocationUi() }
        tapGroup.setOnCheckedChangeListener { _, _ -> syncTapNote() }
        findViewById<Button>(R.id.btn_search).setOnClickListener { searchPlace() }
        permissionButton.setOnClickListener {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION),
                REQUEST_LOCATION,
            )
        }
        findViewById<Button>(R.id.btn_refresh).setOnClickListener { saveSettings(); refreshNow() }
        findViewById<Button>(R.id.btn_save).setOnClickListener { saveAndFinish() }
    }

    private fun loadSettings() {
        val manual = Prefs.locationMode(this) == Prefs.LOC_MANUAL
        (if (manual) findViewById<RadioButton>(R.id.radio_loc_manual)
        else findViewById(R.id.radio_loc_auto)).isChecked = true

        pendingPlace = Prefs.manualPlace(this)
        pendingPlace?.let {
            placeInput.setText(it.label)
            placeStatus.text = it.label
        }

        findViewById<RadioButton>(
            if (Prefs.useFahrenheit(this)) R.id.radio_fahrenheit else R.id.radio_celsius,
        ).isChecked = true

        findViewById<RadioButton>(
            if (Prefs.iconStyle(this) == Prefs.ICONS_MONO) R.id.radio_icons_mono
            else R.id.radio_icons_colour,
        ).isChecked = true

        hoursSpinner.setSelection(
            hourOptions.indexOf(Prefs.hoursOverride(this)).coerceAtLeast(0),
        )
        precipCheck.isChecked = Prefs.showPrecipitation(this)

        findViewById<RadioButton>(
            when (Prefs.tapTarget(this)) {
                Prefs.TAP_VENTUSKY -> R.id.radio_tap_ventusky
                Prefs.TAP_BROWSER -> R.id.radio_tap_browser
                Prefs.TAP_NONE -> R.id.radio_tap_none
                else -> R.id.radio_tap_windy
            },
        ).isChecked = true

        syncLocationUi()
        syncTapNote()
    }

    private fun syncLocationUi() {
        val manual = locationGroup.checkedRadioButtonId == R.id.radio_loc_manual
        manualRow.visibility = if (manual) View.VISIBLE else View.GONE
        placeStatus.visibility = if (manual) View.VISIBLE else View.GONE
        val needsPermission = !manual && !LocationResolver.hasPermission(this)
        permissionNote.visibility = if (needsPermission) View.VISIBLE else View.GONE
        permissionButton.visibility = if (needsPermission) View.VISIBLE else View.GONE
    }

    private fun syncTapNote() {
        val pkg = when (tapGroup.checkedRadioButtonId) {
            R.id.radio_tap_windy -> WidgetRenderer.PKG_WINDY
            R.id.radio_tap_ventusky -> WidgetRenderer.PKG_VENTUSKY
            else -> null
        }
        val missing = pkg != null && packageManager.getLaunchIntentForPackage(pkg) == null
        tapNote.visibility = if (missing) View.VISIBLE else View.GONE
    }

    private fun searchPlace() {
        val query = placeInput.text.toString().trim()
        if (query.isEmpty()) return
        placeStatus.text = getString(R.string.location_searching)
        io.execute {
            val result = try {
                WeatherApi.geocode(query)
            } catch (e: IOException) {
                OFFLINE
            }
            main.post {
                when (result) {
                    OFFLINE -> placeStatus.setText(R.string.location_offline)
                    null -> placeStatus.setText(R.string.location_not_found)
                    else -> {
                        pendingPlace = result
                        placeStatus.text = result.label
                    }
                }
            }
        }
    }

    private fun refreshNow() {
        val place = LocationResolver.resolve(this)
        if (place == null) {
            status.setText(R.string.refresh_no_location)
            return
        }
        status.setText(R.string.refreshing)
        io.execute {
            val forecast = try {
                WeatherApi.fetch(place.lat, place.lon, place.label)
            } catch (e: IOException) {
                null
            } catch (e: org.json.JSONException) {
                null
            }
            main.post {
                if (forecast == null) {
                    status.setText(R.string.refresh_failed)
                } else {
                    Prefs.setCachedForecast(this, forecast)
                    WidgetRenderer.updateAll(this)
                    refreshStatusLine()
                }
            }
        }
    }

    private fun refreshStatusLine() {
        val forecast = Prefs.cachedForecast(this)
        if (forecast == null) {
            status.setText(R.string.no_data_yet)
            return
        }
        val time = DateFormat.getTimeFormat(this).format(Date(forecast.fetchedAt * 1000))
        val label = forecast.place.label.ifEmpty {
            WeatherApi.describe(forecast.place.lat, forecast.place.lon)
        }
        status.text = getString(R.string.refreshed_at, time, label)
    }

    private fun saveSettings() {
        val manual = locationGroup.checkedRadioButtonId == R.id.radio_loc_manual
        Prefs.setLocationMode(this, if (manual) Prefs.LOC_MANUAL else Prefs.LOC_AUTO)
        Prefs.setManualPlace(this, pendingPlace)
        Prefs.setUseFahrenheit(this, unitGroup.checkedRadioButtonId == R.id.radio_fahrenheit)
        Prefs.setIconStyle(
            this,
            if (iconGroup.checkedRadioButtonId == R.id.radio_icons_mono) Prefs.ICONS_MONO
            else Prefs.ICONS_COLOUR,
        )
        Prefs.setHoursOverride(this, hourOptions[hoursSpinner.selectedItemPosition])
        Prefs.setShowPrecipitation(this, precipCheck.isChecked)
        Prefs.setTapTarget(
            this,
            when (tapGroup.checkedRadioButtonId) {
                R.id.radio_tap_ventusky -> Prefs.TAP_VENTUSKY
                R.id.radio_tap_browser -> Prefs.TAP_BROWSER
                R.id.radio_tap_none -> Prefs.TAP_NONE
                else -> Prefs.TAP_WINDY
            },
        )
    }

    private fun saveAndFinish() {
        saveSettings()
        Scheduler.ensurePeriodicRefresh(this)
        Scheduler.armHourlyRepaint(this)
        Scheduler.refreshNow(this)
        WidgetRenderer.updateAll(this)
        setResult(Activity.RESULT_OK, resultIntent())
        finish()
    }

    private fun resultIntent(): Intent =
        Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId)

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray,
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_LOCATION) {
            syncLocationUi()
            if (LocationResolver.hasPermission(this)) refreshNow()
        }
    }

    override fun onDestroy() {
        io.shutdown()
        super.onDestroy()
    }

    private companion object {
        const val REQUEST_LOCATION = 42

        /** Sentinel so the UI can tell "no network" apart from "no such place". */
        val OFFLINE = Place(Double.NaN, Double.NaN, "")
    }
}
