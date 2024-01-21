package com.example.nw

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.mappedin.sdk.MPIMapView
import com.mappedin.sdk.listeners.MPIMapViewListener
import com.mappedin.sdk.models.*
import com.mappedin.sdk.web.MPIOptions

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val mapView = findViewById<MPIMapView>(R.id.mapView)


// use loadVenue to load venue
        mapView.loadVenue(
            MPIOptions.Init("5eab30aa91b055001a68e996", "RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1",
                "mappedin-demo-mall",
                headers = listOf(MPIHeader("testName", "testValue"))),
            MPIOptions.ShowVenue(labelAllLocationsOnInit = true, backgroundColor = "#CDCDCD")
        ) {}
    }





}

