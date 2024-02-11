import mapboxgl from 'mapbox-gl';

document.addEventListener('DOMContentLoaded', function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGdjb2Jvc3MiLCJhIjoiY2xzY2JnajIzMGZsNzJpcGM4b3l5OWttaCJ9.1GzkF8EERgQ5u1jkmP3C7w';

    const hoveredCircleTable = createTable('hovered-circle-table');

    let hoveredCircleProperties = {};
    let campusDataFeatures = [];

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/dgcoboss/clsf6yac1008601qxfmtfhiu6',
        center: [2.349014, 48.864716],
        zoom: 10,
        projection: 'mercator',
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
                'circle-stroke-color': 'black',
                'circle-stroke-width': 1,
                'circle-opacity': 0.8,
                'circle-transition': {
                    duration: 300,
                    delay: 0
                }
            },
        });

        map.on('data', function (e) {
          if (e.sourceId === 'vectorSource') {
              campusDataFeatures = map.querySourceFeatures('vectorSource');
            //   updateCampusDataTable();
            //   console.log("campusDataFeatures" + campusDataFeatures)
          }
      });

        map.on('mousemove', function (e) {
            const features = map.queryRenderedFeatures([
                [e.point.x - 2, e.point.y - 2],
                [e.point.x + 2, e.point.y + 2]
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

        map.on('click', 'vectorLayer', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.nom_etablissement;
            const ville = e.features[0].properties.ville;
            const adresse = e.features[0].properties.adresse;
            const url = e.features[0].properties.url;

            const clickCoordinates = e.lngLat;

            console.log("coordinates", coordinates);
            console.log("clickCoordinates", clickCoordinates);

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`<b>${description}</b><br> ${adresse}, ${ville}</br><a href="${url}">${url}</a>`)
                .addTo(map);
        });

        map.on('mouseenter', 'vectorLayer', (e) => {
            map.getCanvas().style.cursor = 'pointer';

            const hoveredFeature = e.features[0];
            const hoveredFeatureId = hoveredFeature.properties.nom_court;

            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            console.log('Hovered Feature ID:', hoveredFeatureId);

            map.setPaintProperty('vectorLayer', 'circle-stroke-color', ['case', ['==', ['get', 'nom_court'], hoveredFeatureId], 'white', '#40549e']), {
                transition: { duration: 500 }
            };
            map.setPaintProperty('vectorLayer', 'circle-color', ['case', ['==', ['get', 'nom_court'], hoveredFeatureId], '#566CBB', '#40549e']), {
                transition: { duration: 500 }
            };
            map.setPaintProperty('vectorLayer', 'circle-radius', ['case', ['==', ['get', 'nom_court'], hoveredFeatureId], 9, 7]), {
                transition: { duration: 500 }
            };
        });

        map.on('mouseleave', 'vectorLayer', () => {
            map.getCanvas().style.cursor = '';
        });
    });

    function createTable(className) {
        const table = document.createElement('table');
        table.classList.add(className);
        // table.style.borderCollapse = 'collapse';
        document.body.appendChild(table);
        return table;
    }

    function updateHoveredCircleTable() {
        hoveredCircleTable.innerHTML = '';
    
        // Define the columns to include
        const columnsToInclude = ['nom_etablissement', 'adresse', 'ville', 'code_postal', 'type_etablissement', 'mode', 'metiers_art', 'design'];
    
        // Create header row
        const headerRow = document.createElement('tr');
        headerRow.style.color = '#40549e';
        headerRow.style.fontSize = '15px';
        headerRow.style.marginTop = '15px';

        columnsToInclude.forEach(column => {
            const headerCell = document.createElement('th');
            headerCell.textContent = column;
            headerRow.appendChild(headerCell);
        });
        hoveredCircleTable.appendChild(headerRow);
    
        // Create rows for each feature
        const allFeatures = [hoveredCircleProperties, ...campusDataFeatures.map(feature => feature.properties)];
        allFeatures.forEach((featureProperties, index) => {
            const valueRow = document.createElement('tr');
            columnsToInclude.forEach(column => {
                const valueCell = document.createElement('td');
                valueCell.textContent = featureProperties[column] || ''; // Handle cases where the property may be undefined
                valueRow.appendChild(valueCell);
            });
            
            // Style the first row (currently hovered feature) differently
            if (index === 0) {
                valueRow.style.backgroundColor = 'white'; // Light gray background
                valueRow.style.fontWeight = 'bold';
                valueRow.style.paddingBottom = '1rem';
                valueRow.style.border = 'solid 1px black'; // Bold font weight
            }
            
            hoveredCircleTable.appendChild(valueRow);
        });
    }
    
  

    function updateHoveredFeatureTable(properties) {
        const table = document.getElementById('hovered-feature-table');
        table.innerHTML = '';
        const dataRow = document.createElement('tr');

        for (const key in properties) {
            const dataCell = document.createElement('td');
            dataCell.textContent = properties[key];
            dataRow.appendChild(dataCell);
        }

        table.appendChild(dataRow);
    }

    

});
