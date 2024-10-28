import mapboxgl from 'mapbox-gl';

document.addEventListener('DOMContentLoaded', function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGdjb2Jvc3MiLCJhIjoiY2xzY2JnajIzMGZsNzJpcGM4b3l5OWttaCJ9.1GzkF8EERgQ5u1jkmP3C7w';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/dgcoboss/clsf6yac1008601qxfmtfhiu6',
        center: [2.349014, 48.864716],
        zoom: 10,
        projection: 'mercator',
    });

    const filterOptions = ["Retail", "Hotel", "Office", "Restaurant/bar", "Cultural space", "Private residence", "Urban space/Transportation"];
    let selectedFilter = null;

    map.on('load', function () {
        map.addSource('vectorSource', {
            type: 'geojson',
            data: 'output.geojson',
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

        // Create the filter buttons container
        const filterContainer = document.createElement('div');
        filterContainer.style.position = 'absolute';
        filterContainer.style.top = '10px';
        filterContainer.style.right = '10px';
        filterContainer.style.backgroundColor = 'white';
        filterContainer.style.padding = '10px';
        filterContainer.style.borderRadius = '5px';
        filterContainer.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        filterContainer.style.fontFamily = 'Arial, sans-serif';
        filterContainer.style.fontSize = '13px';

        // Create filter buttons
        filterOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.style.display = 'block';
            button.style.marginBottom = '5px';
            button.style.padding = '5px';
            button.style.backgroundColor = '#40549e';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '3px';

            // Add click event to filter by option
            button.addEventListener('click', () => {
                selectedFilter = option;
                applyFilter();
            });

            filterContainer.appendChild(button);
        });

        // Reset button to clear filter
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Show All';
        resetButton.style.display = 'block';
        resetButton.style.padding = '5px';
        resetButton.style.backgroundColor = 'gray';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.cursor = 'pointer';
        resetButton.style.borderRadius = '3px';
        resetButton.addEventListener('click', () => {
            selectedFilter = null;
            applyFilter();
        });
        filterContainer.appendChild(resetButton);

        document.body.appendChild(filterContainer);

        function applyFilter() {
            if (selectedFilter) {
                map.setFilter('vectorLayer', ['==', ['get', 'points_of_interest'], selectedFilter]);
            } else {
                map.setFilter('vectorLayer', null); // Reset filter to show all features
            }
        }

        map.on('click', 'vectorLayer', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties;

            // Extract and prepare images for slider
            const imageUrls = properties.photos_projet.split(',').map(url => url.trim());
            const sliderHTML = imageUrls.length > 1 ? createSliderHTML(imageUrls) : `<img src="${imageUrls[0]}" style="width: 100%; height: auto; display: block; margin-bottom: 10px;" alt="Project Image">`;

            // Create properties HTML
            const propertiesHTML = Object.entries(properties).map(
                ([key, value]) => `<strong>${key}</strong>: ${value || 'N/A'}`
            ).join('<br>');

            const popupContent = `${sliderHTML}${propertiesHTML}`;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            const popup = new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);

            initializeSlider(popup);
        });
    });

    function createSliderHTML(imageUrls) {
        return `
            <div class="slider-container">
                <button class="slider-btn left">&#10094;</button>
                <div class="slider-images">
                    ${imageUrls.map((url, index) => `<img src="${url}" class="slider-image" style="width:100%; display: ${index === 0 ? 'block' : 'none'};">`).join('')}
                </div>
                <button class="slider-btn right">&#10095;</button>
            </div>
            <style>
                .slider-container { position: relative; width: 100%; }
                .slider-btn { position: absolute; top: 50%; width: auto; padding: 16px; color: white; font-weight: bold; background-color: rgba(0, 0, 0, 0.5); border: none; cursor: pointer; }
                .slider-btn.left { left: 0; }
                .slider-btn.right { right: 0; }
                .slider-images { display: flex; overflow: hidden; }
                .slider-image { display: none; width: 100%; }
            </style>
        `;
    }

    function initializeSlider(popup) {
        const popupContainer = popup.getElement();
        const images = popupContainer.querySelectorAll('.slider-image');
        const nextBtn = popupContainer.querySelector('.slider-btn.right');
        const prevBtn = popupContainer.querySelector('.slider-btn.left');
        let currentIndex = 0;

        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });
    }
});
