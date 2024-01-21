import {
  E_SDK_EVENT,
  E_SDK_EVENT_PAYLOAD,
  MappedinLocation,
  MapView
} from "@mappedin/mappedin-js";
import { useEffect, useState } from "react";
import useMapClick from "./useMapClick";

/**
 * Maintain an active MappedinLocation; automatically change the selected location when
 * a polygon is clicked; also allow the selected location to be changed externally
 */
export default function useSelectedLocation(mapView: MapView | undefined) {
  // Store the active MappedinLocation
  const [selectedLocation, setSelectedLocation] = useState<
    MappedinLocation | undefined
  >();

  // Change the selected location when a polygon is clicked using useMapClick
  useMapClick(
    mapView,
    ({ polygons }: E_SDK_EVENT_PAYLOAD[E_SDK_EVENT.CLICK]) => {
      if (polygons[0] != null && polygons[0].locations[0] != null) {
        setSelectedLocation(polygons[0].locations[0]);
      } else {
        setSelectedLocation(undefined);
      }
    }
  );

  // Highlight all the polygons of and focus on the selected location
  useEffect(() => {
    if (mapView == null) {
      return;
    }

    // Clear any existing highlights
    mapView.clearAllPolygonColors();

    if (selectedLocation != null) {
      const polygons = selectedLocation.polygons;
      const nodes = selectedLocation.nodes;

      let hasPolygonOnCurrentMap = false;

      // Highlight each of its polygons
      polygons.forEach((polygon) => {
        mapView.setPolygonColor(polygon, "red");
        if (polygon.map.id === mapView.currentMap.id) {
          hasPolygonOnCurrentMap = true;
        }
      });

      if (polygons.length > 0 && !hasPolygonOnCurrentMap) {
        mapView.setMap(polygons[0].map);
      }

      // Focus on all its polygons and nodes
      mapView.Camera.focusOn({
        polygons,
        nodes
      });
    }
  }, [selectedLocation, mapView]);

  // Return the selected location and a setter
  return { selectedLocation, setSelectedLocation };
}
