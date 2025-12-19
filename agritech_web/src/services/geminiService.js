import { GoogleGenerativeAI } from '@google/generative-ai';
import { APP_CONSTANTS } from '../utils/constants';

let genModel = null;

const initModel = () => {
    if (!genModel) {
        const genAI = new GoogleGenerativeAI(APP_CONSTANTS.geminiApiKey);
        genModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    }
    return genModel;
};

export const geminiService = {
    getPrediction: async (prompt) => {
        try {
            const model = initModel();
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Error:", error);
            return "AI Service Unavailable";
        }
    },

    getSellRecommendation: async (crop) => {
        const prompt = `When is the best time to sell ${crop} in the next 7 days based on general market trends in India? Provide a specific day and a short reason.`;
        return await geminiService.getPrediction(prompt);
    },

    getFertilizerReasoning: async (data, fertilizer) => {
        const prompt = `
      Act as an agricultural expert. A farmer has been recommended the fertilizer "${fertilizer}" 
      for their ${data.cropType} crop grown in ${data.soilType} soil.
      The soil nutrient levels are: Nitrogen: ${data.nitrogen}, Phosphorous: ${data.phosphorous}, Potassium: ${data.potassium}.
      Temperature: ${data.temperature}°C, Humidity: ${data.humidity}%, Moisture: ${data.moisture}%.
      
      Provide a 2-sentence expert explanation on why "${fertilizer}" is the best fit for these conditions and how it helps the ${data.cropType} plant.
    `;
        return await geminiService.getPrediction(prompt);
    }
};
