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

    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.style.position = 'absolute';
    sidebar.style.top = '20%';
    sidebar.style.left = '10px';
    sidebar.style.width = '300px'; // Adjust width as needed
    sidebar.style.height = '80%';
    sidebar.style.backgroundColor = 'white';
    sidebar.style.padding = '10px';
    sidebar.style.borderRadius = '5px';
    sidebar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
    sidebar.style.overflowY = 'auto';
    sidebar.style.zIndex = '1';
    sidebar.style.display = 'none'; // Hide the sidebar initially
    document.body.appendChild(sidebar);

    function addLogoOverlay() {
        const logo = document.createElement('img');
        logo.src = 'logomap.svg';
        logo.alt = 'Map Logo';
        logo.id = 'logo-overlay';
        logo.style.position = 'absolute';
        logo.style.top = '10px';
        logo.style.left = '10px';
        logo.style.width = '100px';
        logo.style.height = '100px';
        logo.style.zIndex = '1';
        logo.style.cursor = 'pointer';

        document.getElementById('map').appendChild(logo);
    }

    const pointsOfInterestOptions = [
        "Retail", "Hotel", "Office", "Restaurant/bar",
        "Cultural space", "Private residence", "Urban space/Transportation"
    ];

    const designEventsOptions = [
        "Business France", "Paris Design Week 2023", "Design Miami",
        "Downtown Design Dubaï", "ICFF + WantedDesign Manhattan",
        "In the City", "Milan Design Week 2022", "Villa Albertine"
    ];

    const designPointsOfSalesOptions = [
        "Art de Vivre", "Atelier Bam Design", "Atelier George", "Bernardaud", "Bibelo",
        "Bruno Moinard Editions", "Coedition", "Collectional", "Cuisines Morel", "Devialet",
        "Drugeot", "Fermob", "Forestier", "Gautier", "Habitat", "Henryot & Cie 1867", "Ibride",
        "Kann Design", "La Chance", "La Manufacture", "Lafuma Mobilier", "Le Point D", "Lelièvre",
        "Liaigre", "Maison Dada", "Maison Pouenat", "Manufacture de Février", 
        "Manufacture de Tapis de Bourgogne", "Manufacture des Emaux De Longwy 1798", 
        "Moissonnier", "NOMA", "Par Excellence", "Petite Friture", "Philippe Hurel", 
        "Plumbum", "Red Edition", "Roche Bobois", "Semeur d'Etoiles", "Smarin", "Stamp", "Tolix"
    ];

    let selectedPointsOfInterest = null;
    let selectedDesignEvent = null;
    let selectedDesignPointsOfSales = null;

    map.on('load', function () {
        addLogoOverlay();

        map.addSource('vectorSource', {
            type: 'geojson',
            data: 'output.geojson',
        });

        map.addLayer({
            id: 'vectorLayer',
            type: 'circle',
            source: 'vectorSource',
            paint: {
                'circle-radius': 4,
                'circle-color': '#1534da',
                'circle-stroke-color': 'black',
                'circle-stroke-width': 1,
                'circle-opacity': 0.8,
                'circle-transition': {
                    duration: 300,
                    delay: 0
                }
            },
        });

        createFilterContainer();
        createToggleableFilter('Points of Interest', pointsOfInterestOptions, onPointsOfInterestFilter);
        createToggleableFilter('Design Events', designEventsOptions, onDesignEventsFilter);
        createToggleableFilter('Design Points of Sales', designPointsOfSalesOptions, onDesignPointsOfSalesFilter);

        function createFilterContainer() {
            const filterContainer = document.createElement('div');
            filterContainer.id = 'filter-container';
            filterContainer.style.position = 'absolute';
            filterContainer.style.top = '10px';
            filterContainer.style.right = '10px';
            filterContainer.style.backgroundColor = 'white';
            filterContainer.style.padding = '10px';
            filterContainer.style.borderRadius = '5px';
            filterContainer.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
            filterContainer.style.fontFamily = 'Arial, sans-serif';
            filterContainer.style.fontSize = '13px';
            filterContainer.style.maxHeight = '100%';
            filterContainer.style.overflow = 'scroll';
            document.body.appendChild(filterContainer);
        }

        function createToggleableFilter(title, options, filterFunction) {
            const filterContainer = document.getElementById('filter-container');

            const titleElement = document.createElement('div');
            titleElement.style.fontWeight = 'bold';
            titleElement.style.color = '#40549e';
            titleElement.style.cursor = 'pointer';

            const toggleButton = document.createElement('span');
            toggleButton.textContent = '+';
            toggleButton.style.marginRight = '5px';

            titleElement.appendChild(toggleButton);
            titleElement.appendChild(document.createTextNode(title));
            filterContainer.appendChild(titleElement);

            const optionsContainer = document.createElement('div');
            optionsContainer.style.display = 'none';
            optionsContainer.style.paddingLeft = '15px';

            options.forEach(option => {
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

                button.addEventListener('click', () => filterFunction(option));
                optionsContainer.appendChild(button);
            });

            titleElement.addEventListener('click', () => {
                const isHidden = optionsContainer.style.display === 'none';
                optionsContainer.style.display = isHidden ? 'block' : 'none';
                toggleButton.textContent = isHidden ? '-' : '+';
            });

            filterContainer.appendChild(optionsContainer);
        }

        function onPointsOfInterestFilter(option) {
            selectedPointsOfInterest = option;
            resetOtherFilters('pointsOfInterest');
            applyFilters();
        }

        function onDesignEventsFilter(option) {
            selectedDesignEvent = option;
            resetOtherFilters('designEvent');
            applyFilters();
        }

        function onDesignPointsOfSalesFilter(option) {
            selectedDesignPointsOfSales = option;
            resetOtherFilters('pointsOfSales');
            applyFilters();
        }

        function resetOtherFilters(callingFilter) {
            if (callingFilter !== 'pointsOfInterest') {
                selectedPointsOfInterest = null;
            }
            if (callingFilter !== 'designEvent') {
                selectedDesignEvent = null;
            }
            if (callingFilter !== 'pointsOfSales') {
                selectedDesignPointsOfSales = null;
            }
        }

        function applyFilters() {
            const filters = ['all'];

            if (selectedPointsOfInterest) {
                filters.push(['==', ['get', 'points_of_interest'], selectedPointsOfInterest]);
            }
            if (selectedDesignEvent) {
                filters.push(['==', ['get', 'design_events'], selectedDesignEvent]);
            }
            if (selectedDesignPointsOfSales) {
                filters.push(['==', ['get', 'design_points_of_sales'], selectedDesignPointsOfSales]);
            }

            map.setFilter('vectorLayer', filters.length > 1 ? filters : null); 
        }
    });

    // map.on('click', 'vectorLayer', (e) => {
    //     const properties = e.features[0].properties;
    //     const imageUrls = properties.photos_projet.split(',').map(url => url.trim());
    //     const sliderHTML = imageUrls.length > 1 ? createSliderHTML(imageUrls) : `<img src="${imageUrls[0]}" style="width: 100%; height: auto; display: block; margin-bottom: 10px;" alt="Project Image">`;

    //     const propertiesHTML = Object.entries(properties).map(
    //         ([key, value]) => `<strong>${key}</strong>: ${value || 'N/A'}`
    //     ).join('<br>');

    //     // Populate sidebar with content
    //     sidebar.innerHTML = `${sliderHTML}${propertiesHTML}`;
    //     sidebar.style.display = 'block'; // Show the sidebar when a feature is clicked
    //     initializeSlider(); // Initialize the slider in the sidebar
    // });

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

    function initializeSlider() {
        const images = sidebar.querySelectorAll('.slider-image');
        const nextBtn = sidebar.querySelector('.slider-btn.right');
        const prevBtn = sidebar.querySelector('.slider-btn.left');
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
