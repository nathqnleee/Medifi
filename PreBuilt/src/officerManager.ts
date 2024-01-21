import {
  MappedinNode,
  MapView,
  TGeolocationObject
} from "@mappedin/mappedin-js";
import OfficerPositionUpdater from "./officerUpdater";

export default class OfficerManager {
  mapView: MapView;
  officers = new Map<string, OfficerPositionUpdater>();

  constructor(mapView: MapView) {
    this.mapView = mapView;
  }

  /**
   * Add a new officer
   */
  add(id: string, color: string, positions: TGeolocationObject[]) {
    // Create a new officer marker
    const templateHtml = `<div class="marker" style="background-color: ${color}"><div id="info" class="marker-info" style="display: none;"><p class="title">Guard</p> #${id}</div></div>`;
    const coordinate = this.mapView.currentMap.createCoordinate(
      positions[0].coords.latitude,
      positions[0].coords.longitude
    );
    const marker = this.mapView.Markers.add(coordinate, templateHtml);
    marker.containerEl.querySelector(".marker").onclick = () => {
      const info = marker.containerEl.querySelector(".marker-info");
      if (info.style.display === "none") {
        info.style.display = "block";
      } else {
        info.style.display = "none";
      }
    };

    // Use a position updater since we don't have live data
    const officerUpdater = new OfficerPositionUpdater(this.mapView, marker);

    // Store in Map()
    this.officers.set(id, officerUpdater);

    // Loop the route positions
    officerUpdater.loop(positions);
  }

  /**
   * Determine nearest officer to node
   */
  nearestTo(node: MappedinNode): OfficerPositionUpdater {
    const officersArray = Array.from(this.officers.entries());
    let nearestIndex = 0;
    let nearest: number = this.mapView.currentMap
      .createCoordinate(
        officersArray[nearestIndex][1].currentPosition!.coords.latitude,
        officersArray[nearestIndex][1].currentPosition!.coords.longitude
      )
      .nearestNode.distanceTo(node, {});

    // Iterate through all the officers to check which is the nearest to the node
    for (let i = 1; i < officersArray.length; i++) {
      const distance = this.mapView.currentMap
        .createCoordinate(
          officersArray[i][1].currentPosition!.coords.latitude,
          officersArray[i][1].currentPosition!.coords.longitude
        )
        .nearestNode.distanceTo(node, {});
      if (distance < nearest) {
        nearest = distance;
        nearestIndex = i;
      }
    }

    // Return the nearest officer's position updater
    return officersArray[nearestIndex][1];
  }

  /**
   * Determines if every officer has received their first position update
   */
  hasLoaded() {
    return Array.from(this.officers.entries()).every((item) => {
      return item[1].currentPosition;
    });
  }
}
