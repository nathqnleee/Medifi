import {
  E_SDK_EVENT,
  E_SDK_EVENT_PAYLOAD,
  MapView
} from "@mappedin/mappedin-js";
import { useCallback, useEffect } from "react";

/**
 * Declarative API to subscribe to an E_SDK_EVENT.MAP_CHANGED
 */
export default function useMapChanged(
  mapView: MapView | undefined,
  onChange: (payload: E_SDK_EVENT_PAYLOAD[E_SDK_EVENT.MAP_CHANGED]) => void
) {
  const handleChange = useCallback(
    (payload: E_SDK_EVENT_PAYLOAD[E_SDK_EVENT.MAP_CHANGED]) => {
      onChange(payload);
    },
    [onChange]
  );

  // Subscribe to E_SDK_EVENT.CLICK
  useEffect(() => {
    if (mapView == null) {
      return;
    }

    mapView.on(E_SDK_EVENT.MAP_CHANGED, handleChange);

    // Cleanup
    return () => {
      mapView.off(E_SDK_EVENT.MAP_CHANGED, handleChange);
    };
  }, [mapView, handleChange]);
}
