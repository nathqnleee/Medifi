import {
  E_SDK_EVENT,
  E_SDK_EVENT_PAYLOAD,
  MapView
} from "@mappedin/mappedin-js";
import { useCallback, useEffect } from "react";

/**
 * Declarative API to subscribe to an E_SDK_EVENT.CLICK
 */
export default function useMapClick(
  mapView: MapView | undefined,
  onClick: (payload: E_SDK_EVENT_PAYLOAD[E_SDK_EVENT.CLICK]) => void
) {
  const handleClick = useCallback(
    (payload: E_SDK_EVENT_PAYLOAD[E_SDK_EVENT.CLICK]) => {
      onClick(payload);
    },
    [onClick]
  );

  // Subscribe to E_SDK_EVENT.CLICK
  useEffect(() => {
    if (mapView == null) {
      return;
    }

    mapView.on(E_SDK_EVENT.CLICK, handleClick);

    // Cleanup
    return () => {
      mapView.off(E_SDK_EVENT.CLICK, handleClick);
    };
  }, [mapView, handleClick]);
}
