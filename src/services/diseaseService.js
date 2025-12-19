
const API_KEY = "OSFZJItIDBaYbDtia03f6oNnsUpQ1U5PVMnOfHdSRnzr767RWy";
const API_URL = "https://plant.id/api/v3/health_assessment"; // Using v3 for better results

export const diseaseService = {
    detectDisease: async (imageFile) => {
        try {
            // 1. Convert image to Base64
            const base64Image = await toBase64(imageFile);

            // 2. Prepare payload
            const payload = {
                images: [base64Image],
                latitude: 49.207, // Optional, can be removed or made dynamic
                longitude: 16.608,
                similar_images: true
            };

            // 3. Make API Request
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": API_KEY,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Disease Detection Error:", error);
            throw error;
        }
    }
};

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result); // key requires full data url or just base64? v3 usually accepts full data url in "images" array.
        reader.onerror = (error) => reject(error);
    });
