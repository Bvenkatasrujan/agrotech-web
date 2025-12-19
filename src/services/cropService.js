
/**
 * Crop Recommendation Service
 * Logic derived from niteshhalai/crop-recommendation-dataset centroids.
 * Uses a Nearest Centroid algorithm for deterministic recommendations.
 */

const CROP_CENTROIDS = {
    rice: { n: 79.89, p: 47.58, k: 39.88, temp: 23.69, hum: 82.27, ph: 6.42, rain: 236.18 },
    maize: { n: 77.71, p: 48.44, k: 19.79, temp: 22.38, hum: 65.09, ph: 6.24, rain: 84.77 },
    chickpea: { n: 40.09, p: 67.79, k: 79.92, temp: 18.87, hum: 16.86, ph: 7.33, rain: 79.61 },
    kidneybeans: { n: 20.75, p: 67.54, k: 20.05, temp: 20.11, hum: 21.60, ph: 5.74, rain: 105.91 },
    pigeonpeas: { n: 20.73, p: 67.73, k: 20.29, temp: 27.74, hum: 48.06, ph: 5.79, rain: 149.45 },
    mothbeans: { n: 21.44, p: 48.01, k: 20.23, temp: 28.19, hum: 53.16, ph: 6.83, rain: 51.19 },
    mungbean: { n: 20.99, p: 47.28, k: 19.87, temp: 28.52, hum: 85.49, ph: 6.72, rain: 48.40 },
    blackgram: { n: 40.02, p: 67.47, k: 19.24, temp: 29.97, hum: 65.11, ph: 7.14, rain: 67.88 },
    lentil: { n: 18.77, p: 68.36, k: 19.41, temp: 24.50, hum: 64.80, ph: 6.92, rain: 45.68 },
    pomegranate: { n: 18.87, p: 18.75, k: 40.21, temp: 21.83, hum: 90.12, ph: 6.42, rain: 107.50 },
    banana: { n: 100.23, p: 82.01, k: 50.05, temp: 27.37, hum: 80.35, ph: 5.98, rain: 104.62 },
    mango: { n: 20.07, p: 27.18, k: 29.92, temp: 31.20, hum: 50.15, ph: 5.76, rain: 94.70 },
    grapes: { n: 23.18, p: 132.53, k: 200.11, temp: 23.84, hum: 81.87, ph: 6.02, rain: 69.61 },
    watermelon: { n: 99.22, p: 17.00, k: 50.22, temp: 25.59, hum: 85.16, ph: 6.49, rain: 50.78 },
    muskmelon: { n: 100.32, p: 17.72, k: 50.08, temp: 28.66, hum: 92.34, ph: 6.35, rain: 24.68 },
    apple: { n: 20.80, p: 134.22, k: 199.89, temp: 22.63, hum: 92.33, ph: 5.92, rain: 112.65 },
    orange: { n: 19.58, p: 16.55, k: 10.01, temp: 22.76, hum: 92.17, ph: 5.73, rain: 110.47 },
    papaya: { n: 49.88, p: 59.05, k: 50.04, temp: 33.72, hum: 92.40, ph: 6.74, rain: 142.62 },
    coconut: { n: 21.98, p: 16.92, k: 30.59, temp: 27.40, hum: 94.84, ph: 5.97, rain: 175.68 },
    cotton: { n: 117.77, p: 46.24, k: 19.56, temp: 23.98, hum: 79.84, ph: 6.91, rain: 80.25 },
    jute: { n: 78.40, p: 46.86, k: 39.99, temp: 24.95, hum: 79.63, ph: 6.73, rain: 174.79 },
    coffee: { n: 101.20, p: 28.74, k: 29.94, temp: 25.54, hum: 58.86, ph: 6.79, rain: 158.06 }
};

export const cropService = {
    /**
     * Recommends a crop using Nearest Centroid logic.
     * Normalizes inputs roughly to standard scales from the dataset.
     */
    recommendCrop: (data) => {
        const input = {
            n: parseFloat(data.nitrogen),
            p: parseFloat(data.phosphorous),
            k: parseFloat(data.potassium),
            temp: parseFloat(data.temperature),
            hum: parseFloat(data.humidity),
            ph: parseFloat(data.ph),
            rain: parseFloat(data.rainfall)
        };

        let bestMatch = null;
        let minDistance = Infinity;

        // Weights to balance importance (Roughly based on feature variance in the dataset)
        // Rain and NPK are usually high impact.
        const weights = { n: 1, p: 1, k: 1, temp: 0.5, hum: 0.2, ph: 5, rain: 0.1 };

        for (const [crop, centroid] of Object.entries(CROP_CENTROIDS)) {
            let distance = 0;
            distance += weights.n * Math.pow(input.n - centroid.n, 2);
            distance += weights.p * Math.pow(input.p - centroid.p, 2);
            distance += weights.k * Math.pow(input.k - centroid.k, 2);
            distance += weights.temp * Math.pow(input.temp - centroid.temp, 2);
            distance += weights.hum * Math.pow(input.hum - centroid.hum, 2);
            distance += weights.ph * Math.pow(input.ph - centroid.ph, 2);
            distance += weights.rain * Math.pow(input.rain - centroid.rain, 2);

            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = crop;
            }
        }

        // Capitalize for display
        return bestMatch.charAt(0).toUpperCase() + bestMatch.slice(1);
    }
};
