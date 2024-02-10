import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import mapboxgl from 'mapbox-gl';
import { Popup } from 'mapbox-gl';

document.addEventListener('DOMContentLoaded', function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGdjb2Jvc3MiLCJhIjoiY2xzY2JnajIzMGZsNzJpcGM4b3l5OWttaCJ9.1GzkF8EERgQ5u1jkmP3C7w';
  
  const hoveredCircleTable = document.createElement('table');
  hoveredCircleTable.classList.add('hovered-circle-table');
  document.body.appendChild(hoveredCircleTable);

  const hoveredPointTable = document.createElement('table');
  hoveredPointTable.classList.add('hovered-point-table');
  document.body.appendChild(hoveredPointTable);

  let hoveredCircleProperties = {};
  const vectorSource = new VectorLayer({
      url: 'CampusData.geojson',
      format: new GeoJSON(),
      wrapX: true,
  });

  const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/dgcoboss/clsf6yac1008601qxfmtfhiu6',
      center: [2.349014, 48.864716],
      zoom: 11,
  });

  // let popup = new mapboxgl.Popup({
  //     closeButton: true,
  //     closeOnClick: false,
  //     offset: [0, -7] // Adjust the offset if needed
  // });

  map.on('load', function () {
      map.addSource('vectorSource', {
          type: 'geojson',
          data: 'CampusData.geojson',
      });

      map.addLayer({
          id: 'vectorLayer',
          type: 'circle',
          source: 'vectorSource',
          paint: {
              'circle-radius': 7,
              'circle-color': '#40549e',
              'circle-stroke-color':'white', // Yellow stroke color for hovered circle
              'circle-stroke-width': 1,
          },
      });

      map.on('mousemove', function (e) {
          const features = map.queryRenderedFeatures(e.point);
          if (features.length > 0) {
              const hoveredFeature = features[0];
              const hoveredPointProperties = hoveredFeature.properties;
              updateHoveredFeatureTable(hoveredPointProperties);
              if (hoveredFeature.layer.type === 'circle') {
                  hoveredCircleProperties = hoveredFeature.properties;
                  updateHoveredCircleTable();
              }
          }
      });

      map.on('mouseenter', 'vectorLayer', (e) => {
          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = 'pointer';
          
          const hoveredFeature = e.features[0];
          const hoveredFeatureNomCourt = hoveredFeature.properties.nom_court;
          if (hoveredFeatureNomCourt) {
              const coordinates = e.lngLat;
              const description = hoveredFeatureNomCourt;
              
              popup.setLngLat(coordinates)
                  .setHTML(`<p>${description}</p>`)
                  .addTo(map);
          }
      });

      map.on('mouseleave', 'vectorLayer', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
      });
  });

  // Function to update the HTML table with hovered feature properties
  function updateHoveredCircleTable() {
    hoveredCircleTable.innerHTML = '';
    const headerRow = document.createElement('tr');
    const valueRow = document.createElement('tr');

    for (const [key, value] of Object.entries(hoveredCircleProperties)) {
        const headerCell = document.createElement('th');
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);

        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        valueRow.appendChild(valueCell);
    }

    hoveredCircleTable.appendChild(headerRow);
    hoveredCircleTable.appendChild(valueRow);
}
});
function updateHoveredFeatureTable(properties) {
  const table = document.getElementById('hovered-feature-table');

  // Clear existing table content
  table.innerHTML = '';



  // Create data row
  const dataRow = document.createElement('tr');
  for (const key in properties) {
    const dataCell = document.createElement('td');
    dataCell.textContent = properties[key];
    dataRow.appendChild(dataCell);
  }
  table.appendChild(dataRow);
}




// document.addEventListener('DOMContentLoaded', function () {
//   mapboxgl.accessToken = 'pk.eyJ1IjoiZGdjb2Jvc3MiLCJhIjoiY2xzY2JnajIzMGZsNzJpcGM4b3l5OWttaCJ9.1GzkF8EERgQ5u1jkmP3C7w';
  
//   const hoveredCircleTable = document.createElement('table');
//   hoveredCircleTable.classList.add('hovered-circle-table');
//   document.body.appendChild(hoveredCircleTable);

//   const hoveredPointTable = document.createElement('table');
//   hoveredPointTable.classList.add('hovered-point-table');
//   document.body.appendChild(hoveredPointTable);

//   let hoveredCircleProperties = {};
//   const vectorSource = new VectorLayer({
//       url: 'CampusData.geojson',
//       format: new GeoJSON(),
//       wrapX: true,
//   });

//   const map = new mapboxgl.Map({
//       container: 'map',
//       style: 'mapbox://styles/dgcoboss/clsf6yac1008601qxfmtfhiu6',
//       center: [2.349014, 48.864716],
//       zoom: 11,
//   });

//   let popup = new mapboxgl.Popup({
//       closeButton: true,
//       closeOnClick: false,
//       offset: [0, -7] // Adjust the offset if needed
//   });

//   map.on('load', function () {
//       map.addSource('vectorSource', {
//           type: 'geojson',
//           data: 'CampusData.geojson',
//       });

//       map.addLayer({
//           id: 'vectorLayer',
//           type: 'circle',
//           source: 'vectorSource',
//           paint: {
//               'circle-radius': 7,
//               'circle-color': '#40549e',
//               'circle-stroke-color':'white', // Yellow stroke color for hovered circle
//               'circle-stroke-width': 1,
//           },
//       });

//       map.on('mousemove', function (e) {
//           const features = map.queryRenderedFeatures(e.point);
//           if (features.length > 0) {
//               const hoveredFeature = features[0];
//               const hoveredPointProperties = hoveredFeature.properties;
// //         updateHoveredFeatureTable(hoveredPointProperties);
//               if (hoveredFeature.layer.type === 'circle') {
//                   hoveredCircleProperties = hoveredFeature.properties;
//                   updateHoveredCircleTable();
//               }
//           }
//       });

//       map.on('mouseenter', 'vectorLayer', (e) => {
//           // Change the cursor style as a UI indicator.
//           map.getCanvas().style.cursor = 'pointer';
          
//           const hoveredFeature = e.features[0];
//           const hoveredFeatureNomCourt = hoveredFeature.properties.nom_court;
//           if (hoveredFeatureNomCourt) {
//               const coordinates = e.lngLat;
//               const description = hoveredFeatureNomCourt;
              
              
//               popup.setLngLat(coordinates)
//                   .setHTML(`<p>${description}</p>`)
//                   .addTo(map);
//           }
//       });

//       map.on('mouseleave', 'vectorLayer', () => {
//           map.getCanvas().style.cursor = '';
//           popup.remove();
//       });
//   });

//   // Function to update the HTML table with hovered feature properties
//   function updateHoveredCircleTable() {
//       hoveredCircleTable.innerHTML = '';
//       for (const [key, value] of Object.entries(hoveredCircleProperties)) {
//           const row = document.createElement('tr');
//           const cellKey = document.createElement('td');
//           cellKey.textContent = key;
//           const cellValue = document.createElement('td');
//           cellValue.textContent = value;
//           row.appendChild(cellKey);
//           row.appendChild(cellValue);
//           hoveredCircleTable.appendChild(row);
//       }
//   }
// });


// document.addEventListener('DOMContentLoaded', function () {
//   mapboxgl.accessToken = 'pk.eyJ1IjoiZGdjb2Jvc3MiLCJhIjoiY2xzY2JnajIzMGZsNzJpcGM4b3l5OWttaCJ9.1GzkF8EERgQ5u1jkmP3C7w';
//   const hoveredCircleTable = document.createElement('table');
//   hoveredCircleTable.classList.add('hovered-circle-table');
//   document.body.appendChild(hoveredCircleTable);

//   const hoveredPointTable = document.createElement('table');
// hoveredPointTable.classList.add('hovered-point-table');
// document.body.appendChild(hoveredPointTable);


//   let hoveredCircleProperties = {};
//   const vectorSource = new VectorLayer({
//     url: 'CampusData.geojson',
//     format: new GeoJSON(),
//     wrapX: true,
//   });

//   const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/dgcoboss/clsf6yac1008601qxfmtfhiu6',
//     center: [2.349014, 48.864716],
//     zoom: 11,
//   });

//   let hoveredFeatureId = null;

//   map.on('load', function () {
//     map.addSource('vectorSource', {
//       type: 'geojson',
//       data: 'CampusData.geojson',
//     });

//     map.addLayer({
//       id: 'vectorLayer',
//       type: 'circle',
//       source: 'vectorSource',
//       paint: {
//         'circle-radius': 7,
//         'circle-color': '#40549e',
//         'circle-stroke-color':'white', // Yellow stroke color for hovered circle
//         'circle-stroke-width': 1,
//       },
//     });

//     map.on('mousemove', function (e) {
//       const features = map.queryRenderedFeatures(e.point);
//       if (features.length > 0) {
//         const hoveredFeature = features[0];
//         // const hoveredFeatureId = hoveredFeature.properties.id;
//         const hoveredPointProperties = hoveredFeature.properties;
//         updateHoveredFeatureTable(hoveredPointProperties);
//         // If the hovered feature is a circle
//         if (hoveredFeature.layer.type === 'circle') {
//           // const hoveredFeatureNomCourt = hoveredFeature.properties.nom_court;
//           hoveredCircleProperties = hoveredFeature.properties;
//           // map.getCanvas().style.cursor = 'pointer';

//           updateHoveredCircleTable();
     
//     }
// } 

    
        
      
//     });


//   map.on('mouseenter', 'vectorLayer', (e) => {
 
//     // Change the cursor style as a UI indicator.
//     map.getCanvas().style.cursor = 'pointer';
    
//     const hoveredFeature = e.features[0];
//     const hoveredFeatureNomCourt = hoveredFeature.properties.nom_court;
//     console.log("hoveredFeatureNomCourt" + hoveredFeatureNomCourt)

//     // Create and display the popup if nom_court property exists
//     if (hoveredFeatureNomCourt) {
//         const coordinates = e.features[0].geometry.coordinates.slice();
//         const description = hoveredFeatureNomCourt;

//         // Close the existing popup if one is open
//         // if (popup) {
//         //     popup.remove();
//         //     popup = null;
//         // }

//         // Create new popup
//         popup = new mapboxgl.Popup({
//           offset: [0, -7], 
//             closeButton: true,
//             closeOnClick: false
//         })
//         .setLngLat(coordinates)
//         .setHTML(`<p>${description}</p><p>${coordinates}</p>`)
//         .addTo(map);
//     }
// });

// map.on('mouseleave', 'vectorLayer', () => {
//     // Reset cursor style
//     map.getCanvas().style.cursor = '';
//     // Close the popup if it's open
//     if (popup) {
//         popup.remove();
//         popup = null;
//     }
// });

   
//   });

//   // Function to update the HTML table with hovered feature properties
//   function updateHoveredFeatureTable(properties) {
//     const table = document.getElementById('hovered-feature-table');

//     // Clear existing table content
//     table.innerHTML = '';

  

//     // Create data row
//     const dataRow = document.createElement('tr');
//     for (const key in properties) {
//       const dataCell = document.createElement('td');
//       dataCell.textContent = properties[key];
//       dataRow.appendChild(dataCell);
//     }
//     table.appendChild(dataRow);
//   }

//   function updateHoveredCircleTable() {
//     hoveredCircleTable.innerHTML = '';
//     for (const [key, value] of Object.entries(hoveredCircleProperties)) {
//       const row = document.createElement('tr');
//       const cellKey = document.createElement('td');
//       cellKey.textContent = key;
//       const cellValue = document.createElement('td');
//       cellValue.textContent = value;
//       row.appendChild(cellKey);
//       row.appendChild(cellValue);
//       hoveredCircleTable.appendChild(row);
//     }
//   }

//   function clearHoveredCircleTable() {
//     hoveredCircleProperties = {};
//     hoveredCircleTable.innerHTML = '';
//   }

 
  
// });
