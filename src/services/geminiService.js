import { GoogleGenerativeAI } from '@google/generative-ai';
import { APP_CONSTANTS } from '../utils/constants';

let genAI = null;

const initAI = () => {
    // We always re-initialize if the key in constants changes (HMR support)
    const apiKey = APP_CONSTANTS.geminiApiKey?.trim();
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error("API Key Missing: Please add your VITE_GEMINI_API_KEY to the .env file.");
    }

    // Check if we need to reset genAI (e.g., key changed)
    if (!genAI || genAI._apiKey !== apiKey) {
        console.log(`Debug - Initializing Gemini with Key: ${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`);
        genAI = new GoogleGenerativeAI(apiKey);
        genAI._apiKey = apiKey; // Store for change detection
    }
    return genAI;
};

const AGRICULTURE_SYSTEM_PROMPT = `
You are an AI Agriculture Assistant. 
Your main role is to help farmers, students, and agriculture professionals.

Focus strongly on:
- Crops (rice, wheat, maize, vegetables, fruits, pulses)
- Soil types and soil health
- Fertilizers and manures
- Pest and disease management
- Irrigation methods
- Weather impact on farming
- Modern farming techniques
- Organic and sustainable agriculture
- Government agriculture schemes (general info)

You can answer other general questions if asked, 
but ALWAYS prioritize agriculture-related guidance.
Explain answers in simple, practical language.
Use Markdown formatting (bullet points, bold text) to make your answers very easy to read line-by-line.
`;

export const geminiService = {

    getPrediction: async (user_input) => {
        const ai = initAI();
        // Prioritize gemini-1.5-flash (via flash-latest) for stability on free tier
        const modelsToTry = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-pro-latest"];
        let lastError = null;

        const fullPrompt = `${AGRICULTURE_SYSTEM_PROMPT}\nUser question: ${user_input}`;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying Gemini with model: ${modelName}`);
                const model = ai.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(fullPrompt);
                const response = await result.response;
                return response.text();
            } catch (error) {
                console.warn(`Model ${modelName} failed:`, error.message);
                lastError = error;
                // Continue to next model regardless of error (might have different quota/status)
                continue;
            }
        }

        // Final error handler
        console.error("All Gemini models failed. Last Error:", lastError);
        const errMsg = lastError?.message || "";

        if (errMsg.includes("429") || errMsg.toLowerCase().includes("quota")) {
            return "AI Service Error: API Quota Exceeded. You've reached the free tier limit. Please wait 60 seconds and try again, or create a completely NEW PROJECT in Google AI Studio to get a fresh quota.";
        }

        if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("401")) {
            return "AI Service Error: Invalid API Key. Please ensure you copied the FULL key correctly into your .env file.";
        }

        return `AI Service Error: ${errMsg || "Unknown Error"}. Please check your Google AI Studio settings and internet connection.`;
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
