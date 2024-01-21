import {
  MappedinMap,
  TGetVenueMakerOptions,
  TMapViewOptions
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import { useEffect, useMemo, useState } from "react";
import useMapChanged from "./hooks/useMapChanged";
import useMapView from "./hooks/useMapView";
import useVenueMaker from "./hooks/useVenueMaker";
import "./styles.css";

/* This demo shows you how to draw a path between two locations. */
export default function NavigationExample() {
  const credentials = useMemo<TGetVenueMakerOptions>(
    () => ({
      mapId: "659efcf1040fcba69696e7b6",
      key: "65a0422df128bbf7c7072349",
      secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4"
    }),
    []
  );
  const venue = useVenueMaker(credentials);

  const mapOptions = useMemo<TMapViewOptions>(
    () => ({
      xRayPath: true, // X Ray enables seeing the path through walls
      multiBufferRendering: true // Multi buffer rendering is necessary for features like x ray
    }),
    []
  );
  const { elementRef, mapView } = useMapView(venue, mapOptions);

  /* Start navigation when the map loads */
  useEffect(() => {
    if (!mapView || !venue) {
      return;
    }

    /*
     * All maps made in Maker will contain a location called "footprintcomponent"
     * which represents the exterior "footprint"
     * You can use this location to get the nearest entrance or exit
     */
    const startLocation = venue.locations.find((location) =>
      location.id.includes("footprintcomponent")
    );
    // Navigate to some location on another floor
    const endLocation = venue.locations.find((location) =>
      location.id.includes("delly")
    );

    if (startLocation && endLocation) {
      // Generate a route between these two locations
      const directions = startLocation.directionsTo(endLocation);
      if (directions && directions.path.length > 0) {
        // The Journey class draws the path & can be configured with a few options
        mapView.Journey.draw(directions, {
          polygonHighlightColor: "#e74c3c", // Start and end polygons colour
          departureMarkerTemplate: (props) => {
            // The departure marker is the person at the start location
            return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
            <div class="departure-marker">${
              props.location ? props.location.name : "Departure"
            }</div>
            ${props.icon}
            </div>`;
          },
          destinationMarkerTemplate: (props) => {
            // The destination marker is the pin at the end location
            return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
            <div class="destination-marker">${
              props.location ? props.location.name : "Destination"
            }</div>
            ${props.icon}
            </div>`;
          },
          connectionTemplate: (props) => {
            // The connection marker is the button to switch floors on the map
            return `<div class="connection-marker">Take ${props.type} ${props.icon}</div>`;
          },
          pathOptions: {
            nearRadius: 0.25, // The path size in metres at the nearest zoom
            farRadius: 1, // The path size in metres at the furthest zoom
            color: "#40A9FF", // Path colour
            displayArrowsOnPath: false, // Arrow animation on path
            showPulse: true, // Pulse animation on path
            pulseIterations: Infinity // How many times to play the pulse animation
          }
        });

        // Set the map (floor level) to start at the beginning of the path
        mapView.setMap(directions.path[0].map);
      }
    }
    // Update the selected map state
    setSelectedMap(mapView.currentMap);
  }, [mapView, venue]);

  // Track the selected map with state, for the UI
  const [selectedMap, setSelectedMap] = useState<MappedinMap | undefined>();

  /* Monitor floor level changes and update the UI */
  useMapChanged(mapView, (map) => {
    setSelectedMap(map);
  });

  return (
    <div id="app">
      <div id="ui">
        {venue?.venue.name ?? "Loading..."}
        {venue && selectedMap && (
          <select
            value={selectedMap.id}
            onChange={(e) => {
              if (!mapView || !venue) {
                return;
              }

              const floor = venue.maps.find((map) => map.id === e.target.value);
              if (floor) {
                mapView.setMap(floor);
              }
            }}
          >
            {venue?.maps.map((level, index) => {
              return (
                <option value={level.id} key={index}>
                  {level.name}
                </option>
              );
            })}
          </select>
        )}
      </div>
      <div id="map-container" ref={elementRef}></div>
    </div>
  );
}
