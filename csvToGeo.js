import fs from 'fs';
import csv from 'csv-parser';

// Specify the path to your CSV file
const csvFilePath = 'public/points.csv';
const geojson = {
    type: "FeatureCollection",
    name: "Projects and Places",
    features: []
};

// Function to convert each row to a GeoJSON feature
function rowToFeature(row) {
    try {
        // Parse coordinates, assuming format is "latitude,longitude"
        const [lat, lon] = row['Coordonnées'].split(',').map(Number);

        // Create the feature with properties and geometry
        return {
            type: "Feature",
            properties: {
                nom_etablissement: row['Nom du lieu ou du projet'],
                fiche_agence: row['Fiche agence liée'],
                titre_affiche: row['Titre affiché'],
                adresse: row['Adresse'],
                interior_designers: row['Interior Designers'],
                points_of_interest: row['Points of Interest'],
                design_events: row['Design events'],
                design_points_of_sales: row['Design point of sales'],
                annee_projet: row['Année projet'],
                description_projet: row['Description projet'],
                date_vernissage: row['Date du vernissage'],
                heure_vernissage: row['Heure de vernissage'],
                date_debut_expo: row['Date de début de l\'exposition'],
                date_fin_expo: row['Date de fin de l\'exposition'],
                site_web: row['Site web du projet'],
                credits_photo: row['Crédits photo'],
                photos_projet: row['Photos du projet']
            },
            geometry: {
                type: "Point",
                coordinates: [lon, lat]  // Ensure coordinates are [longitude, latitude]
            }
        };
    } catch (error) {
        console.error("Error processing row:", error);
        return null;
    }
}

// Read and process the CSV file
fs.createReadStream(csvFilePath)
    .pipe(csv({ separator: ';' }))  // Specify semicolon delimiter
    .on('data', (row) => {
        const feature = rowToFeature(row);
        if (feature) geojson.features.push(feature);
    })
    .on('end', () => {
        // Write the GeoJSON data to a file
        const outputGeojsonPath = 'output.geojson';
        fs.writeFileSync(outputGeojsonPath, JSON.stringify(geojson, null, 4), 'utf8');
        console.log(`GeoJSON file saved at ${outputGeojsonPath}`);
    });
