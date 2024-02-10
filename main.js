import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import mapboxgl from 'mapbox-gl';

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

  let hoveredFeatureId = null;

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
        const hoveredFeatureId = hoveredFeature.properties.id;
        const hoveredPointProperties = hoveredFeature.properties;
        updateHoveredFeatureTable(hoveredPointProperties);
        // If the hovered feature is a circle
        if (hoveredFeature.layer.type === 'circle') {
          const hoveredFeatureNomCourt = hoveredFeature.properties.nom_court;
          hoveredCircleProperties = hoveredFeature.properties;
          updateHoveredCircleTable();
          // If nom_court property exists, display tooltip
          if (hoveredFeatureNomCourt) {
              new mapboxgl.Popup({
                  closeButton: false,
                  closeOnClick: false
              })
              .setLngLat(e.lngLat)
              .setHTML(`<p>${hoveredFeatureNomCourt}</p>`)
              .addTo(map);
          }
      } else {
        // If the hovered feature is not a circle (point), update the point table
        updateHoveredPointTable(hoveredFeature.properties);
    }

        // if (hoveredFeature.layer.type === 'circle') {
        //   hoveredCircleProperties = hoveredFeature.properties;
        //   updateHoveredCircleTable();
          
        // } // Define hoveredFeatureId here
        // if (hoveredFeatureId !== hoveredFeatureId) {
        //   if (hoveredFeatureId) {
        //     map.setFeatureState(
        //       { source: 'vectorSource', id: hoveredFeatureId },
        //       { hover: true }
        //     );
        //   }
        //   map.setFeatureState(
        //     { source: 'vectorSource', id: hoveredFeatureId },
        //     { hover: false }
        //   );
        // }

        
      }
    });

    // map.on('mousemove', function (e) {
    //   const features = map.queryRenderedFeatures(e.point);
    //   if (features.length > 0) {
    //     const hoveredFeature = features[0];
    //     if (hoveredFeature.layer.type === 'circle') {
    //       hoveredCircleProperties = hoveredFeature.properties;
    //       updateHoveredCircleTable();
    //     }
    //   }
    // });

    // Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
  });
   
  map.on('mouseenter', 'vectorLayer', (e) => {
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = 'pointer';
   
  // Copy coordinates array.
  const coordinates = e.features[0].geometry.coordinates.slice();
  const description = e.features[0].properties.nom_court;
   
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
   
  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });
   
  map.on('mouseleave', 'places', () => {
  map.getCanvas().style.cursor = '';
  popup.remove();
  });


    map.on('mouseleave', function () {
      map.getCanvas().style.cursor = 'none';
      clearHoveredCircleTable();
      if (hoveredFeatureId) {
        map.setFeatureState(
          { source: 'vectorSource', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
      }
    });
  });

  // Function to update the HTML table with hovered feature properties
  function updateHoveredFeatureTable(properties) {
    const table = document.getElementById('hovered-feature-table');

    // Clear existing table content
    table.innerHTML = '';

    // Create header row
    // const headerRow = document.createElement('tr');
    // for (const key in properties) {
    //   const headerCell = document.createElement('th');
    //   headerCell.textContent = key;
    //   headerRow.appendChild(headerCell);
    // }
    // table.appendChild(headerRow);

    // Create data row
    const dataRow = document.createElement('tr');
    for (const key in properties) {
      const dataCell = document.createElement('td');
      dataCell.textContent = properties[key];
      dataRow.appendChild(dataCell);
    }
    table.appendChild(dataRow);
  }

  function updateHoveredCircleTable() {
    hoveredCircleTable.innerHTML = '';
    for (const [key, value] of Object.entries(hoveredCircleProperties)) {
      const row = document.createElement('tr');
      const cellKey = document.createElement('td');
      cellKey.textContent = key;
      const cellValue = document.createElement('td');
      cellValue.textContent = value;
      row.appendChild(cellKey);
      row.appendChild(cellValue);
      hoveredCircleTable.appendChild(row);
    }
  }

  function clearHoveredCircleTable() {
    hoveredCircleProperties = {};
    hoveredCircleTable.innerHTML = '';
  }

  function updateHoveredPointTable(properties) {
    const table = document.getElementById('hovered-point-table');
  
    // Clear existing table content
    table.innerHTML = '';
  
    // Create header row
    const headerRow = document.createElement('tr');
    const headerCellKey = document.createElement('th');
    headerCellKey.textContent = 'Property';
    headerRow.appendChild(headerCellKey);
    const headerCellValue = document.createElement('th');
    headerCellValue.textContent = 'Value';
    headerRow.appendChild(headerCellValue);
    table.appendChild(headerRow);
  
    // Create data rows for each property
    for (const [key, value] of Object.entries(properties)) {
      const row = document.createElement('tr');
      const cellKey = document.createElement('td');
      cellKey.textContent = key;
      const cellValue = document.createElement('td');
      cellValue.textContent = value;
      row.appendChild(cellKey);
      row.appendChild(cellValue);
      table.appendChild(row);
    }
  }
  
});
