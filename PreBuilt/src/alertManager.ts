import {
    COLLISION_RANKING_TIERS,
    MappedinNode,
    MapView,
    Marker,
    TGeolocationObject
  } from "@mappedin/mappedin-js";
  import OfficerPositionUpdater from "./officerUpdater";
  
  export default class AlertManager {
    mapView: MapView;
    marker: Marker | null = null;
    node: MappedinNode | null = null;
    responder: OfficerPositionUpdater | null = null;
  
    constructor(mapView: MapView) {
      this.mapView = mapView;
    }
  
    /**
     * Add a new alert
     */
    add(node: MappedinNode) {
      // Save the alert node
      this.node = node;
  
      if (this.marker) {
        // If there's an existing marker reuse it
        this.mapView.Markers.setPosition(this.marker, node);
  
        // Clear the old path and resume the previous officer's route
        this.mapView.Paths.removeAll();
        this.resume();
        return;
      }
  
      // Create a new marker
      const templateHtml = `<div class="dot alarm-marker" style="pointer-events: all;"><span></span><img  src="https://images.ctfassets.net/wlcuh44rvj2s/hsqKvGmeau6Z5Oo9432Ru/f65fac66795948f2a74151ece270f206/alarm.svg" /></div>`;
      this.marker = this.mapView.Markers.add(node, templateHtml, {
        rank: COLLISION_RANKING_TIERS.ALWAYS_VISIBLE
      });
  
      (this.marker.contentEl as HTMLDivElement).onclick = (ev: MouseEvent) => {
        // On click remove the marker and resume the officer's route
        this.mapView.Markers.remove(this.marker!);
        this.marker = null;
        this.resume();
        ev.stopPropagation();
      };
    }
  
    /**
     * Send an officer to the alert
     */
    respond(officer: OfficerPositionUpdater) {
      if (!this.node) return;
      this.responder = officer;
  
      // Generate directions from current position to alert node
      const start = this.mapView.currentMap.createCoordinate(
        this.responder.currentPosition!.coords.latitude,
        this.responder.currentPosition!.coords.longitude
      ).nearestNode;
      const directions = start.directionsTo(this.node);
  
      // Draw path
      this.mapView.Paths.add(directions.path, {
        farRadius: 2
      });
  
      // Start navigating
      this.responder.start(
        directions.path.map(
          (p): TGeolocationObject => {
            return {
              timestamp: 0,
              coords: {
                latitude: p.lat,
                longitude: p.lon,
                accuracy: 5
              }
            };
          }
        )
      );
    }
  
    /**
     * Send an officer back to their route
     */
    resume() {
      if (!this.responder) {
        console.log("no responder");
        return;
      }
  
      // Clear path
      this.mapView.Paths.removeAll();
  
      // Generate directions for officer back to previous route
      const start = this.mapView.currentMap.createCoordinate(
        this.responder.currentPosition!.coords.latitude,
        this.responder.currentPosition!.coords.longitude
      ).nearestNode;
      const end = this.mapView.currentMap.createCoordinate(
        this.responder!.loopPositions[this.responder.loopPositions.length - 1]!
          .coords.latitude,
        this.responder!.loopPositions[this.responder.loopPositions.length - 1]!
          .coords.longitude
      ).nearestNode;
      const directions = start.directionsTo(end);
  
      // Start navigating
      this.responder.start(
        directions.path.map(
          (p): TGeolocationObject => {
            return {
              timestamp: 0,
              coords: {
                latitude: p.lat,
                longitude: p.lon,
                accuracy: 5
              }
            };
          }
        ),
        (self) => {
          // When the officer reaches their destination, return to route loop
          console.log("when is this firing");
          self.loop([...self.loopPositions].reverse());
        }
      );
    }
  }
  