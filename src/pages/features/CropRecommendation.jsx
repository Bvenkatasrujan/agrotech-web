import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { geminiService } from '../../services/geminiService';
import { cropService } from '../../services/cropService';
import { Sprout, Loader, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CropRecommendation() {
    const [formData, setFormData] = useState({
        nitrogen: '', phosphorous: '', potassium: '',
        ph: '', rainfall: '', temperature: '', humidity: ''
    });
    const [result, setResult] = useState('');
    const [reasoning, setReasoning] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Get deterministic recommendation from Kaggle dataset logic
        const recommendedCrop = cropService.recommendCrop(formData);
        setResult(recommendedCrop);

        // 2. Get AI reasoning for the specific recommendation
        const prompt = `
      Act as an agricultural expert. You just recommended growing "${recommendedCrop}" 
      based on the following soil data from the niteshhalai/crop-recommendation-dataset:
      Nitrogen: ${formData.nitrogen}, Phosphorous: ${formData.phosphorous}, Potassium: ${formData.potassium},
      pH Level: ${formData.ph}, Rainfall: ${formData.rainfall}mm, Temperature: ${formData.temperature}°C, 
      Humidity: ${formData.humidity}%.
      
      Provide a 2-sentence expert explanation on why this crop is the best fit for these specific values.
    `;
        const aiReason = await geminiService.getPrediction(prompt);
        setReasoning(aiReason);
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Title Header */}
            <div className="bg-green-700 text-white py-12 text-center">
                <h1 className="text-4xl font-bold mb-2">Crop Recommendation</h1>
                <p className="text-green-100 text-lg">Find the perfect crop for your soil conditions</p>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Column: Form */}
                <div>
                    <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Sprout className="text-agri-green" />
                            Find Your Crop
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Nitrogen (N)" name="nitrogen" value={formData.nitrogen} onChange={handleChange} />
                            <InputField label="Phosphorous (P)" name="phosphorous" value={formData.phosphorous} onChange={handleChange} />
                            <InputField label="Potassium (K)" name="potassium" value={formData.potassium} onChange={handleChange} />
                            <InputField label="pH Level" name="ph" value={formData.ph} onChange={handleChange} />
                            <InputField label="Temperature (°C)" name="temperature" value={formData.temperature} onChange={handleChange} />
                            <InputField label="Humidity (%)" name="humidity" value={formData.humidity} onChange={handleChange} />
                            <InputField label="Rainfall (mm)" name="rainfall" value={formData.rainfall} onChange={handleChange} />

                            <div className="md:col-span-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-agri-green text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader className="animate-spin" /> : <Sprout />}
                                    {loading ? 'Analyzing Soil...' : 'Get Recommendation'}
                                </button>
                            </div>
                        </form>

                        {result && (
                            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
                                <h3 className="text-xl font-bold text-green-800 mb-2">Analysis Result</h3>
                                <div className="p-4 bg-white rounded border border-green-100 mb-4">
                                    <span className="text-sm uppercase font-bold text-green-600 block mb-1">Recommended Crop:</span>
                                    <span className="text-3xl font-black text-green-800">{result}</span>
                                </div>
                                <h4 className="font-bold text-green-700 mb-1 italic text-sm">Expert Reasoning:</h4>
                                <p className="text-gray-700 leading-relaxed">{reasoning || 'Analyzing context...'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Information Content */}
                <div className="space-y-12">

                    {/* About Section */}
                    <section className="bg-white p-8 rounded-xl shadow-md border-l-4 border-green-500">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Crop Recommendation Model</h2>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <img src="/images/crop_hand.png" alt="Farmer Hand" className="w-32 h-32 object-cover rounded-lg shadow-sm" />
                            <div>
                                <h3 className="font-bold text-green-700 mb-2">Empowering Farmers with AI-Driven Crop Insights</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    The Crop Recommendation System revolutionizes how farmers choose crops. It takes into account the mineral composition of the soil,
                                    including potassium, nitrogen, and phosphorous, as well as factors like humidity, temperature, and rainfall.
                                    By analyzing these factors, farmers can ensure optimal crop selection, leading to higher yields and sustainable farming practices.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How it Works */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">🤔 How it Works!</h2>
                        <div className="bg-blue-50 p-6 rounded-xl flex items-center gap-6">
                            <img src="/images/crop_growth.png" alt="Growth" className="w-24 h-24 object-contain" />
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <span className="text-2xl">🌍</span>
                                    <span className="text-gray-700 font-medium">Analyze soil and environmental parameters.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-2xl">📊</span>
                                    <span className="text-gray-700 font-medium">Get precise crop recommendations based on data.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-2xl">🌾</span>
                                    <span className="text-gray-700 font-medium">Make informed decisions on crop management.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Advantages & Disadvantages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                                <CheckCircle /> Advantages
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex gap-2"><span className="text-green-500">•</span> Enhances crop productivity by informing soil management decisions.</li>
                                <li className="flex gap-2"><span className="text-green-500">•</span> Facilitates efficient resource allocation and planning.</li>
                                <li className="flex gap-2"><span className="text-green-500">•</span> Enables early detection of nutrient deficiencies and soil issues.</li>
                                <li className="flex gap-2"><span className="text-green-500">•</span> Supports better water management and conservation efforts.</li>
                            </ul>
                        </section>

                        <section className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                                <AlertTriangle /> Disadvantages
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex gap-2"><span className="text-red-400">•</span> Requires access to technology and data for accurate predictions.</li>
                                <li className="flex gap-2"><span className="text-red-400">•</span> Initial costs for implementing soil testing and modeling can be high.</li>
                                <li className="flex gap-2"><span className="text-red-400">•</span> Predictions may vary based on environmental changes and model accuracy.</li>
                                <li className="flex gap-2"><span className="text-red-400">•</span> Complexity of soil science may lead to misinterpretations of data.</li>
                            </ul>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}

function InputField({ label, name, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agri-green focus:border-agri-green"
            />
        </div>
    );
}
