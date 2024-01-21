import {
  TGetVenueMakerOptions,
  MARKER_ANCHOR,
  COLLISION_RANKING_TIERS,
  MappedinMap,
  TMapViewOptions
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import { useEffect, useMemo, useState} from "react";
import useMapClick from "./hooks/useMapClick";
import useMapChanged from "./hooks/useMapChanged";
import useMapView from "./hooks/useMapView";
import useVenueMaker from "./hooks/useVenueMaker";
import SlideButton from "./ClientButton"; // Adjust the import path

import "./styles.css";

/* This demo shows you how to add interactive elements to the map. */
export default function InteractivityExample() {
  const [image1Version, setImage1Version] = useState(1);
  const [image2Version, setImage2Version] = useState(1);
  const [image3Version, setImage3Version] = useState(1);


  const credentials = useMemo<TGetVenueMakerOptions>(
    () => ({
      mapId: "65ab7a47ca641a9a1399dbf7",
      key: "65ac73bb04c23e7916b1d0ea",
      secret: "553457a54e0d18a40711dcab8ece3fc65dabe23cabbfd32a2fed06e0fc7e87b2",

    }),
    []
  );
  const venue = useVenueMaker(credentials);
  const mapOptions = useMemo<TMapViewOptions>(
    () => ({
      backgroundColor: "#CFCFCF" // Background colour behind the map
    }),
    []
  );
  const { elementRef, mapView } = useMapView(venue, mapOptions);

  useEffect(() => {
    if (!mapView || !venue) {
      return;
    }

    
    // Enable interactivity for polygons (spaces, desks)
    mapView.addInteractivePolygonsForAllLocations();
    // Set hover colour for polygons
    venue.locations.forEach((location) => {
      // An obstruction is something like a desk
      if (location.name === "ICU Beds 1-7" || location.name === "ICU Beds 20 - 27") {
        location.polygons.forEach((polygon) => {
          mapView.setPolygonHoverColor(polygon, "#FF0000");
        });
      } else {
        location.polygons.forEach((polygon) => {
          mapView.setPolygonHoverColor(polygon, "#BFBFBF");
        });
      }
    });

    mapView.FloatingLabels.labelAllLocations({
      interactive: true // Make labels interactive
    });
  }, [mapView, venue]);

  /* This hook can be used to interact with the map on click */
  useMapClick(mapView, (props) => {
    if (!mapView || !venue) {
      return;
    }

    // We can get the clicked geolocation
    console.log(
      `[useMapClick] Clicked at ${props.position.latitude}, ${props.position.longitude}`
    );

    // Interact with clicked markers
    for (const marker of props.markers) {
      console.log(`[useMapClick] Clicked marker ID "${marker.id}"`);
      mapView.Markers.remove(marker.id);
      return;
    }

    // Interact with clicked Floating Labels
    // for (const label of props.floatingLabels) {
    //   console.log(`[useMapClick] Clicked label "${label.text}"`);

    //   if (label.node) {
    //     mapView.FloatingLabels.remove(label.node);
    //   }
    //   return;
    // }

    // Interact with clicked polygons
    for (const polygon of props.polygons) {
      console.log(`[useMapClick] Clicked polygon ID "${polygon.id}"`);

  // Get location details for the clicked polygon
  const location = mapView.getPrimaryLocationForPolygon(polygon);

  // Convert the click information to a coordinate on the map
  const clickedCoordinate = mapView.currentMap.createCoordinate(
    props.position.latitude,
    props.position.longitude
  );

  // Check if the clicked location has the desired name
  if (location && location.name === "ICU Beds 20 - 27") {

    setImage1Version(2); // Set the version to 2 when condition is met


    const startLocation = venue.locations.find(
      (location) => location.name === "Doctor 5"
    );

    const endLocation = venue.locations.find(
      (location) => location.name === "ICU Beds 20 - 27"
    );

    if (startLocation && endLocation) {
      const directions = startLocation.directionsTo(endLocation);

      if (directions && directions.path.length > 0) {
        mapView.Journey.draw(directions, {
          departureMarkerTemplate: (props) => {
            return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
              <div class="departure-marker">${
                props.location ? props.location.name : "Departure"
              }</div>
              ${props.icon}
            </div>`;
          },
          destinationMarkerTemplate: (props) => {
            return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
              <div class="destination-marker">${
                props.location ? props.location.name : "Destination"
              }</div>
              ${props.icon}
            </div>`;
          },
          connectionTemplate: (props) => {
            return `<div class="connection-marker">Take ${props.type} ${props.icon}</div>`;
          },
          pathOptions: {
            nearRadius: 0.25,
            farRadius: 1,
            color: "#40A9FF",
            displayArrowsOnPath: false,
            showPulse: true,
            pulseIterations: Infinity
          }
        });

        mapView.setMap(directions.path[0].map);
      }
    }


    // Update the selected map state
    //setSelectedMap(mapView.currentMap);
  } 
  if (location && location.name === "Laurener Room") {
    const startLocation = venue.locations.find(
      (location) => location.name === "Doctor 2"
    );
    setImage3Version(2);


    const endLocation = venue.locations.find(
      (location) => location.name === "Laurener Room"
    );

    if (startLocation && endLocation) {
      const directions = startLocation.directionsTo(endLocation);

      if (directions && directions.path.length >= 0) {
        mapView.Journey.draw(directions, {
          departureMarkerTemplate: (props) => {
            return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
              <div class="departure-marker">${
                props.location ? props.location.name : "Departure"
              }</div>
              ${props.icon}
            </div>`;
          },
          destinationMarkerTemplate: (props) => {
            return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
              <div class="destination-marker">${
                props.location ? props.location.name : "Destination"
              }</div>
              ${props.icon}
            </div>`;
          },
          connectionTemplate: (props) => {
            return `<div class="connection-marker">Take ${props.type} ${props.icon}</div>`;
          },
          pathOptions: {
            nearRadius: 0.25,
            farRadius: 1,
            color: "#40A9FF",
            displayArrowsOnPath: false,
            showPulse: true,
            pulseIterations: Infinity
          }
        });

        mapView.setMap(directions.path[0].map);
      }
    }

    // Update the selected map state
    //setSelectedMap(mapView.currentMap);
  }
  if (location && location.name === "ICU Beds 1-7") {
    const startLocation = venue.locations.find(
      (location) => location.name === "Doctor 3"
    );
    setImage2Version(2);


    const endLocation = venue.locations.find(
      (location) => location.name === "ICU Beds 1-7"
    );

    if (startLocation && endLocation) {
      
      const directions = startLocation.directionsTo(endLocation);

      if (directions && directions.path.length > 0) {

        
        console.log(`Distance: ${directions.distance} meters`);
        
        mapView.Journey.draw(directions, {
          departureMarkerTemplate: (props) => {
            return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
              <div class="departure-marker">${
                props.location ? props.location.name : "Departure"
              }</div>
              ${props.icon}
            </div>`;
          },
          destinationMarkerTemplate: (props) => {
            return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
              <div class="destination-marker">${
                props.location ? props.location.name : "Destination"
              }</div>
              ${props.icon}
            </div>`;
          },
          connectionTemplate: (props) => {
            return `<div class="connection-marker">Take ${props.type} ${props.icon}</div>`;
          },
          pathOptions: {
            nearRadius: 0.25,
            farRadius: 1,
            color: "#40A9FF",
            displayArrowsOnPath: false,
            showPulse: true,
            pulseIterations: Infinity
          }
        });

        mapView.setMap(directions.path[0].map);
      }
    }

    // Update the selected map state
    //setSelectedMap(mapView.currentMap);
  }

      

      // And add a new Marker where we clicked
      // mapView.Markers.add(
      //   clickedCoordinate,
      //   // Provide a HTML template string for the Marker appearance
      //   `<div class="marker">${location.name}</div>`,
      //   {
      //     interactive: true, // Make markers clickable
      //     rank: COLLISION_RANKING_TIERS.ALWAYS_VISIBLE, // Marker collision priority
      //     anchor: MARKER_ANCHOR.TOP // Position of the Marker
      //   }
      // );
      return;
    }
  });

  
  const [selectedMap, setSelectedMap] = useState<MappedinMap | undefined>();

  useMapChanged(mapView, (map) => {
    setSelectedMap(map);
  });

  return (
    <div id="app">
      <div id="ui">
        {/* Render some map details to the UI */}
        {venue?.venue.name ?? "Loading..."}
        {venue && (
          <select
            onChange={(e) => {
              if (!mapView || !venue) {
                return;
              }
            }}
          >
            {/* The venue "maps" represent each floor */}
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
      <div>
        {/* Pass all image versions to SlideButton */}
        <SlideButton
          image1Version={image1Version}
          image2Version={image2Version}
          image3Version={image3Version}
        />
      </div>
    </div>
  );
}
