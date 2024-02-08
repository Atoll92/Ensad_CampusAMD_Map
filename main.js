import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import Vector from 'ol/source/Vector.js';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style.js';

document.addEventListener('DOMContentLoaded', function () {
  // Call useGeographic() to set up the projection for geographic coordinates
  useGeographic();

  const vectorSource = new Vector({
    url: 'CampusData.geojson',
    format: new GeoJSON(),
    wrapX: true,
  });

  const view = new View({
    center: [2.349014, 48.864716],
    zoom: 11,
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: '#40549e' }),
        stroke: new Stroke({ color: 'black', width: 1 }),
      }),
    }),
  });

  const darkTileLayer = new TileLayer({
    source: new OSM({
      url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
    })
  });

  const map = new Map({
    layers: [
      darkTileLayer,
      vectorLayer,
    ],
    target: document.getElementById('map'),
    view: view
  });

  // Set the background color of the map container to dark blue
  map.getTargetElement().style.backgroundColor = '#2c3e50';

  let selected = null;

  map.on('pointermove', function (ev) {
    if (selected !== null) {
      selected.setStyle(new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: '#40549e' }),
          stroke: new Stroke({ color: 'black', width: 1 }),
          
        }),
      }));
      selected = null;
    }

    map.forEachFeatureAtPixel(ev.pixel, function (feature) {
      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 10, // Increase the radius when hovering
          fill: new Fill({ color: '#6ae759' }), // Change fill color on hover
          stroke: new Stroke({ color: 'black', width: 1 }),
          cursor:'pointer',
        }),
      }));
      selected = feature;
      return true;
    });
  });

  map.on('pointerleave', function () {
    if (selected !== null) {
      selected.setStyle(new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: '#40549e' }),
          stroke: new Stroke({ color: 'black', width: 1 }),
        }),
      }));
      selected = null;
    }
  });

  // animate the map
  function animate() {
    map.render();
    window.requestAnimationFrame(animate);
  }
  animate();

});
