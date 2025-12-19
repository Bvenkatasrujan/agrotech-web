
/**
 * Price Prediction Service
 * Provides mock market prices and trends for various crops.
 */

const MOCK_PRICES = {
    Wheat: { current: 2200, trend: "+5%", forecast: [2150, 2180, 2200, 2220, 2250] },
    Maize: { current: 1850, trend: "-2%", forecast: [1900, 1880, 1860, 1850, 1840] },
    Rice: { current: 2500, trend: "+3%", forecast: [2400, 2450, 2500, 2550, 2600] },
    Cotton: { current: 6500, trend: "+10%", forecast: [5800, 6000, 6200, 6500, 6800] },
    Sugarcane: { current: 310, trend: "Stable", forecast: [310, 310, 310, 310, 310] },
};

export const priceService = {
    getPriceData: (crop) => {
        return MOCK_PRICES[crop] || { current: "N/A", trend: "Unknown", forecast: [] };
    },

    getAllCrops: () => Object.keys(MOCK_PRICES)
};
