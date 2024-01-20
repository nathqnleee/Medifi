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

    override fun onBlueDotPositionUpdate(update: MPIBlueDotPositionUpdate) {
        // Called when the blueDot that tracks the user position is updated
    }

    override fun onBlueDotStateChange(stateChange: MPIBlueDotStateChange) {
        // Called when the state of blueDot is changed
    }

    override fun onMapChanged(map: MPIMap) {
        // Called when the map is changed
    }

    override fun onPolygonClicked(polygon: MPIPolygon) {
        // Called when the polygon is clicked
    }

    override fun onNothingClicked() {
        // Called when a tap doesn't hit any spaces
    }

    override fun onDataLoaded(data: MPIData) {
        // Called when the mapView has finished loading both the view and venue data
    }

    override fun onFirstMapLoaded() {
        // Called when the first map is fully loaded
    }

    override fun onStateChanged(state: MPIState) {
        // Called when the state of the map has changed
    }


    override fun onFirstMapLoaded() {
        val departure = mapView.venueData?.locations?.first { it.name == "Pet World" }!!
        val destination = mapView.venueData?.locations?.first { it.name == "Microsoft" }!!

        mapView.getDirections(to = destination, from = departure) {
            if (it != null) {
                mapView.journeyManager.draw(directions = it)
            }
        }
    }



}

