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

  const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/dgcoboss/clsf6yac1008601qxfmtfhiu6',
      center: [2.349014, 48.864716],
      zoom: 11,
  });

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
              'circle-stroke-color': 'black', // Yellow stroke color for hovered circle
              'circle-stroke-width': 1,
            'circle-opacity': 0.8,
              'circle-transition': {
                duration: 300, // Transition duration in milliseconds
                delay: 0 // Transition delay in milliseconds
            }
          },
      });

      map.on('mousemove', function (e) {
          // const features = map.queryRenderedFeatures(e.point);
          const features = map.queryRenderedFeatures([
            [e.point.x - 5, e.point.y - 5], // Decrease x and y by 5 pixels
            [e.point.x + 5, e.point.y + 5]  // Increase x and y by 5 pixels
        ]);
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

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        });

      map.on('mouseenter', 'vectorLayer', (e) => {
          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = 'pointer';

          const hoveredFeature = e.features[0];
          const hoveredFeatureId = hoveredFeature.properties.nom_court;
          

          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
          
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          
          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates).setHTML(description).addTo(map);
          console.log('Hovered Feature ID:', hoveredFeatureId);

          map.setPaintProperty('vectorLayer', 'circle-stroke-color', ['case', ['==', ['get', 'nom_court'], hoveredFeatureId], 'white', '#40549e']), {
            transition: { duration: 3000 } // Transition duration in milliseconds
          };
          map.setPaintProperty('vectorLayer', 'circle-radius', ['case', ['==', ['get', 'nom_court'], hoveredFeatureId], 9, 7]), {
            transition: { duration: 3000 } // Transition duration in milliseconds
          };

          // map.setPaintProperty('vectorLayer', 'circle-color', ['case', ['==', ['get', 'id'], hoveredFeatureId], 'red', '#40549e']);
      });

      map.on('mouseleave', 'vectorLayer', () => {
          map.getCanvas().style.cursor = '';

          map.setPaintProperty('vectorLayer', 'circle-color', '#40549e'), {
            transition: { duration: 3000 } // Transition duration in milliseconds
          };
          map.setPaintProperty('vectorLayer', 'circle-radius',  7), {
            transition: { duration: 3000 } // Transition duration in milliseconds
          };

      });
  });

  // Function to update the HTML table with hovered feature properties
  function updateHoveredCircleTable() {
    hoveredCircleTable.innerHTML = '';

    const headerRow = document.createElement('tr');
    headerRow.style.borderBottom = '1px solid #ccc'; // Add bottom border to header row

    const valueRow = document.createElement('tr');

    for (const [key, value] of Object.entries(hoveredCircleProperties)) {
        const headerCell = document.createElement('th');
        headerCell.textContent = key;
        headerCell.style.padding = '8px'; // Add padding to header cell
        headerCell.style.textAlign = 'center'; // Align text to left in header cell
        // headerCell.style.borderRight = '1px solid #ccc'; // Add right border to header cell
        headerCell.style.borderBottom = '1px solid #ccc'; // Add right border to header cell

        headerCell.style.backgroundColor = 'white'; // Add right border to header cell

        headerRow.appendChild(headerCell);

        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        valueCell.style.padding = '8px'; // Add padding to value cell
        valueCell.style.textAlign = 'center'; // Align text to left in value cell
        valueRow.appendChild(valueCell);
    }

    hoveredCircleTable.appendChild(headerRow);
    hoveredCircleTable.appendChild(valueRow);

    // Add bottom border to value row
    valueRow.style.borderBottom = '1px solid #ccc';
}


// function updateHoveredCircleTable() {
//   hoveredCircleTable.innerHTML = '';

//   // Hardcoded headers row
//   const headerRow = document.createElement('tr');
//   headerRow.style.borderBottom = '1px solid #ccc'; // Add bottom border to header row

//   const headers = ['Header1', 'Header2', 'Header3']; // Replace with your actual header names

//   headers.forEach(headerText => {
//       const headerCell = document.createElement('th');
//       headerCell.textContent = headerText;
//       headerCell.style.padding = '8px'; // Add padding to header cell
//       headerCell.style.textAlign = 'center'; // Align text to center in header cell
//       headerCell.style.borderRight = '1px solid #ccc'; // Add right border to header cell
//       headerCell.style.backgroundColor = '#96a4e4'; // Add background color to header cell
//       headerRow.appendChild(headerCell);
//   });

//   hoveredCircleTable.appendChild(headerRow);

//   // Second row of data
//   const valueRow = document.createElement('tr');
//   const values = ['Value1', 'Value2', 'Value3']; // Replace with your actual values

//   values.forEach(valueText => {
//       const valueCell = document.createElement('td');
//       valueCell.textContent = valueText;
//       valueCell.style.padding = '8px'; // Add padding to value cell
//       valueCell.style.textAlign = 'center'; // Align text to center in value cell
//       valueRow.appendChild(valueCell);
//   });

//   hoveredCircleTable.appendChild(valueRow);

//   // Add bottom border to value row
//   valueRow.style.borderBottom = '1px solid #ccc';
// }

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
});





