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
      mapId: "657cc670040fcba69696e69e",
      key: "65a0422df128bbf7c7072349",
      secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4"
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
