// import {
//   MappedinMap,
//   TGetVenueMakerOptions,
//   TMapViewOptions
// } from "@mappedin/mappedin-js";
// import "@mappedin/mappedin-js/lib/mappedin.css";
// import { useEffect, useMemo, useState } from "react";
// import useMapChanged from "./hooks/useMapChanged";
// import useMapView from "./hooks/useMapView";
// import useVenueMaker from "./hooks/useVenueMaker";
// import "./styles.css";

// export default function NavigationExample() {
//   const credentials = useMemo<TGetVenueMakerOptions>(
//     () => ({
//       mapId: "65ab7a47ca641a9a1399dbf7",
//       key: "65ac73bb04c23e7916b1d0ea",
//       secret: "553457a54e0d18a40711dcab8ece3fc65dabe23cabbfd32a2fed06e0fc7e87b2"
//     }),
//     []
//   );
//   const venue = useVenueMaker(credentials);


//   const mapOptions = useMemo<TMapViewOptions>(
//     () => ({
//       xRayPath: true,
//       multiBufferRendering: true
//     }),
//     []
//   );
//   const { elementRef, mapView } = useMapView(venue, mapOptions);

//   const handleLocationClick = (clickedLocationName: string) => {
//     if (!mapView || !venue) {
//       return;
//     }

//     /*
//      * All maps made in Maker will contain a location called "footprintcomponent"
//      * which represents the exterior "footprint"
//      * You can use this location to get the nearest entrance or exit
//      */
//     const startLocation = venue.locations.find((location) =>
//       location.id.includes("footprintcomponent")
//     );
//     // Navigate to some location on another floor
//     const endLocation = venue.locations.find((location) =>
//       location.id.includes("delly")
//     );

//       if (startLocation && endLocation) {
//         const directions = startLocation.directionsTo(endLocation);

//         if (directions && directions.path.length > 0) {
//           mapView.Journey.draw(directions, {
//             departureMarkerTemplate: (props) => {
//               return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
//               <div class="departure-marker">${
//                 props.location ? props.location.name : "Departure"
//               }</div>
//               ${props.icon}
//               </div>`;
//             },
//             destinationMarkerTemplate: (props) => {
//               return `<div style="display: flex; flex-direction: column; justify-items: center; align-items: center;">
//               <div class="destination-marker">${
//                 props.location ? props.location.name : "Destination"
//               }</div>
//               ${props.icon}
//               </div>`;
//             },
//             connectionTemplate: (props) => {
//               return `<div class="connection-marker">Take ${props.type} ${props.icon}</div>`;
//             },
//             pathOptions: {
//               nearRadius: 0.25,
//               farRadius: 1,
//               color: "#40A9FF",
//               displayArrowsOnPath: false,
//               showPulse: true,
//               pulseIterations: Infinity
//             }
//           });

//           mapView.setMap(directions.path[0].map);
//         }
//       }

//       // Update the selected map state
//       setSelectedMap(mapView.currentMap);
//     }
//   };

//   // Track the selected map with state, for the UI
//   const [selectedMap, setSelectedMap] = useState<MappedinMap | undefined>();

//   // Monitor floor level changes and update the UI
//   useMapChanged(mapView, (map) => {
//     setSelectedMap(map);
//   });

//   return (
//     <div id="app">
//       <div id="ui">
//         {venue?.venue.name ?? "Loading..."}
//         {venue && selectedMap && (
//           <select
//             value={selectedMap.id}
//             onChange={(e) => {
//               if (!mapView || !venue) {
//                 return;
//               }

//                 const floor = venue.maps.find((map) => map.id === e.target.value);
//                 if (floor) {
//                   mapView.setMap(floor);
//                 }
//               }}
//             >
//               {venue?.maps.map((level, index) => {
//                 return (
//                   <option value={level.id} key={index}>
//                     {level.name}
//                   </option>
//                 );
//               })}
//             </select>
//           )}
//       </div>
//       <div
//         id="map-container"
//         ref={elementRef}
//         onClick={() => handleLocationClick("ICU Beds 20 - 27")}
//       ></div>
//     </div>
//   );
// }