import {
  TGetVenueMakerOptions,
  MARKER_ANCHOR,
  COLLISION_RANKING_TIERS,
  TMapViewOptions
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import { useEffect, useMemo } from "react";
import useMapClick from "./hooks/useMapClick";
import useMapView from "./hooks/useMapView";
import useVenueMaker from "./hooks/useVenueMaker";
import "./styles.css";

/* This demo shows you how to add interactive elements to the map. */
export default function InteractivityExample() {
  const credentials = useMemo<TGetVenueMakerOptions>(
    () => ({
      mapId: "65ab7a47ca641a9a1399dbf7",
      key: "65ac73bb04c23e7916b1d0ea",
      secret: "553457a54e0d18a40711dcab8ece3fc65dabe23cabbfd32a2fed06e0fc7e87b2"
    }),
    []
  );
  const venue = useVenueMaker(credentials);
  const { elementRef, mapView } = useMapView(venue);

  useEffect(() => {
    if (!mapView || !venue) {
      return;
    }

    // Enable interactivity for polygons (spaces, desks)
    mapView.addInteractivePolygonsForAllLocations();
    // Set hover colour for polygons
    venue.locations.forEach((location) => {
      // An obstruction is something like a desk
      if (location.id.includes("ICU")) {
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
    for (const label of props.floatingLabels) {
      console.log(`[useMapClick] Clicked label "${label.text}"`);

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
          anchor: MARKER_ANCHOR.TOP // Position of the Marker
        }
      );
      return;
    }
  });

  return (
    <div id="app">
      <div id="map-container" ref={elementRef}></div>
    </div>
  );
}