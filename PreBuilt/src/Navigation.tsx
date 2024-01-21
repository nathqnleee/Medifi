import {
  MappedinMap,
  TGetVenueMakerOptions,
  TMapViewOptions,
  MARKER_ANCHOR,
  COLLISION_RANKING_TIERS,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import { useEffect, useMemo, useState } from "react";
import useMapChanged from "./hooks/useMapChanged";
import useMapView from "./hooks/useMapView";
import useVenueMaker from "./hooks/useVenueMaker";
import "./styles.css";
import useMapClick from "./hooks/useMapClick"; // Import the useMapClick hook

export default function NavigationExample() {
  const [selectedMap, setSelectedMap] = useState<MappedinMap | undefined>();
  const [clickedLocation, setClickedLocation] = useState<string | null>(null);

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
      xRayPath: true,
      multiBufferRendering: true,
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
    // Set hover color for polygons
    venue.locations.forEach((location) => {
      // An obstruction is something like a desk
      if (location.id.includes("obstruction")) {
        location.polygons.forEach((polygon) => {
          mapView.setPolygonHoverColor(polygon, "#BFBFBF");
        });
      } else {
        location.polygons.forEach((polygon) => {
          mapView.setPolygonHoverColor(polygon, "#F0F0F0");
        });
      }
    });

    mapView.FloatingLabels.labelAllLocations({
      interactive: true, // Make labels interactive
    });
  }, [mapView, venue]);

  // Hook to handle map clicks
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
    // Interact with clicked Floating Labels
    for (const label of props.floatingLabels) {
      console.log(`[useMapClick] Clicked label "${label.text}"`);

      // Check for different rooms and their corresponding paths
      if (label.text === "ICU Beds 20 - 27") {
        handlePathForDoctor("Doctor 5", label.text);

        // Schedule the removal of the path after 5 seconds
        setTimeout(() => {
          mapView.Journey.clear(); // Clear the path
        }, 5000);
      } else if (label.text === "ICU Beds 1-7") {
        handlePathForDoctor("Doctor 4", label.text);

        // Schedule the removal of the path after 5 seconds
        setTimeout(() => {
          mapView.Journey.clear(); // Clear the path
        }, 5000);
      } else if (label.text === "Yet Another Room") {
        handlePathForDoctor("Doctor C", label.text);

        // Schedule the removal of the path after 5 seconds
        setTimeout(() => {
          mapView.Journey.clear(); // Clear the path
        }, 5000);
      }

      if (label.node) {
        mapView.FloatingLabels.remove(label.node);
      }
      return;
    }



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

      // And add a new Marker where we clicked
      mapView.Markers.add(
        clickedCoordinate,
        // Provide a HTML template string for the Marker appearance
        `<div class="marker">${location.name}</div>`,
        {
          interactive: true, // Make markers clickable
          rank: COLLISION_RANKING_TIERS.ALWAYS_VISIBLE, // Marker collision priority
          anchor: MARKER_ANCHOR.TOP, // Position of the Marker
        }
      );
      return;
    }

    // Handle additional logic based on the clicked elements (markers, labels, polygons)
  });

  const handleLocationClick = (clickedLocationName: string) => {
    if (!mapView || !venue) {
      return;
    }

    // Add more conditions as needed...
  };

  const handleDynamicLocationClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapView || !venue) {
      return;
    }

    // Determine the clicked location dynamically based on the event
    const clickedLocationName = determineClickedLocation(event);

    if (clickedLocationName) {
      setClickedLocation(clickedLocationName);
      // Print the clicked location name to the console (replace with your logic)
      console.log("Clicked on:", clickedLocationName);

      // Call the handleLocationClick function if needed
      handleLocationClick(clickedLocationName);
    }
  };

  const determineClickedLocation = (event: React.MouseEvent<HTMLDivElement>): string | null => {
    if (!mapView || !venue) {
      return null;
    }

    // Use clientX and clientY from the event to simulate getting the clicked location
    const { clientX, clientY } = event;

    // Simulate finding the location based on the clientX and clientY (replace with actual logic)
    const clickedLocation = findLocationByCoordinates(clientX, clientY);

    // Return the name of the clicked location if found, otherwise return null
    return clickedLocation ? clickedLocation.name : null;
  };

  const findLocationByCoordinates = (x: number, y: number) => {
    // Implement your logic to find the location based on the x and y coordinates
    // This could involve using mapView's API or other means provided by the library
    // For now, this is a placeholder, replace it with your actual logic
    return venue?.locations.find((location) => {
      // Replace this condition with the actual logic to check if the coordinates are within the location
      // For now, it always returns true, indicating a found location
      return true;
    }) || null;
  };

  const handlePathForDoctor = (doctorName: string, clickedLocationName: string) => {
    if (!mapView || !venue) {
      return;
    }

    const startLocation = venue.locations.find((location) => location.name === doctorName);
    const endLocation = venue.locations.find((location) => location.name === clickedLocationName);

    if (startLocation && endLocation) {
      const directions = startLocation.directionsTo(endLocation);

      if (directions && directions.path.length > 0) {
        mapView.Journey.draw(directions, {
          // Customize the drawing options if needed
        });

        mapView.setMap(directions.path[0].map);
      }
    }

    // Update the selected map state
    setSelectedMap(mapView.currentMap);
  };

  // Monitor floor level changes and update the UI
  useMapChanged(mapView, (map) => {
    setSelectedMap(map);
  });

  return (
    <div id="app">
      <div id="ui">
        {venue?.venue.name ?? "Loading..."}
        {venue &&
          selectedMap && (
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
      <div
        id="map-container"
        ref={elementRef}
        onClick={(event) => handleDynamicLocationClick(event)}
      ></div>
    </div>
  );
}
