
/**
 * Fertilizer Recommendation Service
 * Logic based on provided dataset with centroids.
 */

const FERTILIZER_CENTROIDS = [
    { name: 'Urea', temp: 26, hum: 52, moist: 38, soil: 'Sandy', crop: 'Maize', n: 37, k: 0, p: 0 },
    { name: 'DAP', temp: 29, hum: 52, moist: 45, soil: 'Loamy', crop: 'Sugarcane', n: 12, k: 0, p: 36 },
    { name: '14-35-14', temp: 34, hum: 65, moist: 62, soil: 'Black', crop: 'Cotton', n: 7, k: 9, p: 30 },
    { name: '28-28', temp: 32, hum: 62, moist: 34, soil: 'Red', crop: 'Tobacco', n: 22, k: 0, p: 20 },
    { name: '17-17-17', n: 17, k: 17, p: 17 }, // Generic centroid for 17-17-17
    { name: '20-20', n: 20, k: 0, p: 20 },      // Generic centroid for 20-20
    { name: '10-26-26', n: 10, k: 26, p: 26 }   // Generic centroid for 10-26-26
];

export const fertilizerService = {
    recommendFertilizer: (data) => {
        const input = {
            temp: parseFloat(data.temperature || 0),
            hum: parseFloat(data.humidity || 0),
            moist: parseFloat(data.moisture || 0),
            n: parseFloat(data.nitrogen || 0),
            p: parseFloat(data.phosphorous || 0),
            k: parseFloat(data.potassium || 0),
            soilType: data.soilType,
            cropType: data.cropType
        };

        let bestMatch = null;
        let minDistance = Infinity;

        // Weights to balance importance (Soil and Crop Type are critical, but NPK are the core)
        const weights = { n: 2, p: 2, k: 2, temp: 0.2, hum: 0.2, moist: 0.5 };

        FERTILIZER_CENTROIDS.forEach(centroid => {
            let distance = 0;
            // Feature distance
            distance += weights.n * Math.pow(input.n - (centroid.n || 0), 2);
            distance += weights.p * Math.pow(input.p - (centroid.p || 0), 2);
            distance += weights.k * Math.pow(input.k - (centroid.k || 0), 2);

            // Only add other features if they exist in the centroid definition
            if (centroid.temp !== undefined) distance += weights.temp * Math.pow(input.temp - centroid.temp, 2);
            if (centroid.hum !== undefined) distance += weights.hum * Math.pow(input.hum - centroid.hum, 2);
            if (centroid.moist !== undefined) distance += weights.moist * Math.pow(input.moist - centroid.moist, 2);

            // Soil and Crop type penalties (Categorical matching)
            if (centroid.soil && input.soilType !== centroid.soil) distance += 100;
            if (centroid.crop && input.cropType !== centroid.crop) distance += 100;

            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = centroid.name;
            }
        });

        return bestMatch;
    }
};
