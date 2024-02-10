import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import mapboxgl from 'mapbox-gl';

document.addEventListener('DOMContentLoaded', function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGdjb2Jvc3MiLCJhIjoiY2xzY2JnajIzMGZsNzJpcGM4b3l5OWttaCJ9.1GzkF8EERgQ5u1jkmP3C7w';
  const hoveredCircleTable = document.createElement('table');
  hoveredCircleTable.classList.add('hovered-circle-table');
  document.body.appendChild(hoveredCircleTable);

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
        'circle-stroke-color': [
          'case',
          ['==', ['get', 'id'], hoveredFeatureId],
          'yellow', // Yellow stroke color for hovered circle
          'black' // Default stroke color
        ],
        'circle-stroke-width': 1,
      },
    });

    map.on('mousemove', function (e) {
      const features = map.queryRenderedFeatures(e.point);
      if (features.length > 0) {
        const hoveredFeature = features[0];
        const hoveredFeatureId = hoveredFeature.properties.id;
        if (hoveredFeature.layer.type === 'circle') {
          hoveredCircleProperties = hoveredFeature.properties;
          updateHoveredCircleTable();
        } // Define hoveredFeatureId here
        if (hoveredFeatureId !== hoveredFeatureId) {
          if (hoveredFeatureId) {
            map.setFeatureState(
              { source: 'vectorSource', id: hoveredFeatureId },
              { hover: false }
            );
          }
          map.setFeatureState(
            { source: 'vectorSource', id: hoveredFeatureId },
            { hover: true }
          );
        }

        
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


    map.on('mouseleave', function () {
      
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
    const headerRow = document.createElement('tr');
    for (const key in properties) {
      const headerCell = document.createElement('th');
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

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
});
