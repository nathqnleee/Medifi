import {
  CAMERA_EASING_MODE,
  MapView,
  Marker,
  TGeolocationObject
} from "@mappedin/mappedin-js";

// Speed for officer movement
const SPEED = 1000;

export default class OfficerPositionUpdater {
  mapView: MapView;
  marker: Marker;
  interval: NodeJS.Timeout | null = null;
  positions: TGeolocationObject[] = [];
  loopPositions: TGeolocationObject[] = [];
  currentPosition: TGeolocationObject | null = null;

  constructor(mapView: MapView, marker: Marker) {
    this.mapView = mapView;
    this.marker = marker;
  }

  /**
   * Cancel any existing position updates
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Start a new set of position updates
   */
  start(
    positions: TGeolocationObject[],
    callback?: (self: OfficerPositionUpdater) => void
  ) {
    if (positions.length < 1) return;

    // Save the most recent settings
    this.positions = positions;

    // Stop any existing updates
    this.stop();

    // Start a new set of updates
    let i = 0;
    this.interval = setInterval(() => {
      if (i >= positions.length - 1) {
        this.stop();
        if (callback) callback(this);
      }
      if (positions[i]?.coords) {
        this.currentPosition = this.positions[i];
        const coordinate = this.mapView.currentMap.createCoordinate(
          positions[i].coords.latitude,
          positions[i].coords.longitude
        );
        this.mapView.Markers.animate(this.marker, coordinate, {
          easing: CAMERA_EASING_MODE.LINEAR
        });
      }
      i++;
    }, SPEED);
  }

  /**
   * Loop officer position updates
   */
  loop(positions: TGeolocationObject[]) {
    // Save the most recent settings
    this.loopPositions = positions;

    // Stop any existing updates
    this.stop();

    // Start a new set of updates
    let i = 0;
    this.interval = setInterval(() => {
      if (i >= this.loopPositions.length - 1) {
        // If we reach the end of the positions, reverse it and start over
        this.loopPositions = [...this.loopPositions].reverse();
        i = 0;
      }
      if (this.loopPositions[i]?.coords) {
        this.currentPosition = this.loopPositions[i];
        const coordinate = this.mapView.currentMap.createCoordinate(
          this.loopPositions[i].coords.latitude,
          this.loopPositions[i].coords.longitude
        );
        // Apply a smooth linear animation
        this.mapView.Markers.animate(this.marker, coordinate, {
          easing: CAMERA_EASING_MODE.LINEAR
        });
      }
      i++;
    }, SPEED);
  }
}
