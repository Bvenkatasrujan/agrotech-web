
/**
 * Soil Quality Service
 * Analyzes soil parameters to provide a health score and suggestions.
 */

export const soilService = {
    analyzeSoil: (data) => {
        const { nitrogen, phosphorous, potassium, ph, moisture } = data;
        
        // Simple heuristic for soil health
        let score = 75; // Base score
        let suggestions = [];

        if (ph < 6.0) {
            score -= 10;
            suggestions.push("Apply lime to increase pH level.");
        } else if (ph > 7.5) {
            score -= 10;
            suggestions.push("Apply sulfur to decrease pH level.");
        }

        if (nitrogen < 20) {
            score -= 5;
            suggestions.push("Increase nitrogen levels using organic compost or urea.");
        }

        if (moisture < 30) {
            score -= 5;
            suggestions.push("Improve irrigation or use mulch to retain moisture.");
        }

        if (score > 90) {
            suggestions.push("Soil quality is excellent! Maintain current practices.");
        } else {
            suggestions.push("Monitor nutrient levels regularly for optimal growth.");
        }

        return {
            score: Math.min(100, Math.max(0, score)),
            status: score > 80 ? "Healthy" : score > 60 ? "Moderate" : "Poor",
            suggestions
        };
    }
};
