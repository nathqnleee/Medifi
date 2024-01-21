import {
  CAMERA_EASING_MODE,
  TGetVenueMakerOptions
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import { useCallback, useEffect, useMemo } from "react";
import useMapClick from "./hooks/useMapClick";
import useMapView from "./hooks/useMapView";
import useVenueMaker from "./hooks/useVenueMaker";
import "./styles.css";

/* This demo shows you how to move the camera. */
export default function CameraExample() {
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

  /* Basic map setup */
  useEffect(() => {
    if (!mapView || !venue) {
      return;
    }

    mapView.FloatingLabels.labelAllLocations();
    mapView.Camera.minZoom = 50; // Min camera zoom in approx metres
    mapView.Camera.set({
      tilt: 0.4, // tilt from 0 (top down) to 1 (side view)
      rotation: 1, // rotation in radians
      zoom: 1000 // altitude in approximate metres
    });
  }, [mapView, venue]);

  /* Focus on a single polygon to zoom */
  const focusOnPolygon = useCallback(() => {
    if (!mapView || !venue) {
      return;
    }
    const LOCATION_ID = "mappedin";
    const location = venue.locations.find((location) =>
      location.id.includes(LOCATION_ID)
    );
    if (location) {
      mapView.Camera.focusOn(
        {
          polygons: location.polygons,
          nodes: location.nodes
        },
        {
          tilt: 0,
          duration: 500, // time in ms
          easing: CAMERA_EASING_MODE.EASE_IN_OUT, // animation easing
          updateZoomLimits: false // if this animation should update global min zoom
        }
      );
    } else {
      console.warn(`[Mappedin]: Location with ID ${LOCATION_ID} not found.`);
    }
  }, [mapView, venue]);

  /* Focus on all polygons in the current map to zoom out */
  const focusOnMap = useCallback(() => {
    if (!mapView || !venue) {
      return;
    }
    const polygonsOnMap = venue.polygons.filter(
      (polygon) => polygon.map.id === mapView.currentMap.id
    );
    if (polygonsOnMap.length > 0) {
      mapView.Camera.focusOn(
        {
          polygons: polygonsOnMap
        },
        {
          tilt: 0.9,
          rotation: 0,
          duration: 1000, // time in ms
          easing: CAMERA_EASING_MODE.EASE_OUT, // animation easing
          updateZoomLimits: false // if this animation should update global min zoom
        }
      );
    } else {
      console.warn(`[Mappedin]: No polygons on current map.`);
    }
  }, [mapView, venue]);

  /* Focus on a specific point using map click events */
  useMapClick(mapView, (props) => {
    if (!mapView || !venue) {
      return;
    }
    const coordinate = mapView.currentMap.createCoordinate(
      props.position.latitude,
      props.position.longitude
    );
    mapView.Camera.focusOn(
      {
        coordinates: [coordinate]
      },
      {
        duration: 1500, // time in ms
        easing: CAMERA_EASING_MODE.EASE_OUT, // animation easing
        minZoom: 500, // min zoom in metres of the animation
        updateZoomLimits: false // if this animation should update global min zoom
      }
    );
  });

  return (
    <div id="app">
      <div id="ui">
        Camera Actions
        <button onClick={focusOnPolygon}>Focus On A Polygon</button>
        <button onClick={focusOnMap}>Focus On Entire Map</button>
        <p>Click anywhere to focus on a point</p>
      </div>
      <div id="map-container" ref={elementRef}></div>
    </div>
  );
}
