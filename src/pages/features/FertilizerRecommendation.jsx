import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { geminiService } from '../../services/geminiService';
import { fertilizerService } from '../../services/fertilizerService';
import { FlaskConical, Loader, CheckCircle, AlertTriangle, Droplets, Thermometer, Wind } from 'lucide-react';

export default function FertilizerRecommendation() {
    const [formData, setFormData] = useState({
        nitrogen: '', phosphorous: '', potassium: '',
        temperature: '', humidity: '', moisture: '',
        soilType: '', cropType: ''
    });
    const [result, setResult] = useState('');
    const [reasoning, setReasoning] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock Dropdowns based on dataset
    const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
    const cropTypes = ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setReasoning('');

        // 1. Get deterministic recommendation
        const recommendedFertilizer = fertilizerService.recommendFertilizer(formData);
        setResult(recommendedFertilizer);

        // 2. Get AI reasoning
        const aiReason = await geminiService.getFertilizerReasoning(formData, recommendedFertilizer);
        setReasoning(aiReason);

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 text-center shadow-inner">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Fertilizer Recommendation</h1>
                <p className="text-blue-100 text-xl max-w-2xl mx-auto px-4">Optimize your crop's health with data-driven nutrient planning and AI-powered insights.</p>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left: Form */}
                <div className="animate-slide-in-left">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-8 border border-slate-100">
                        <div className="bg-blue-600 p-4 flex items-center gap-3">
                            <FlaskConical className="text-white" />
                            <h2 className="text-xl font-bold text-white">Soil & Crop Analysis</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Nitrogen (N)" name="nitrogen" val={formData.nitrogen} set={setFormData} />
                                <InputField label="Phosphorous (P)" name="phosphorous" val={formData.phosphorous} set={setFormData} />
                                <InputField label="Potassium (K)" name="potassium" val={formData.potassium} set={setFormData} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Temperature (°C)" name="temperature" val={formData.temperature} set={setFormData} icon={<Thermometer size={14} />} />
                                <InputField label="Humidity (%)" name="humidity" val={formData.humidity} set={setFormData} icon={<Wind size={14} />} />
                                <InputField label="Moisture" name="moisture" val={formData.moisture} set={setFormData} icon={<Droplets size={14} />} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField label="Soil Type" name="soilType" opts={soilTypes} val={formData.soilType} set={setFormData} />
                                <SelectField label="Crop Type" name="cropType" opts={cropTypes} val={formData.cropType} set={setFormData} />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-3 shadow-lg shadow-blue-200"
                            >
                                {loading ? <Loader className="animate-spin" /> : <FlaskConical />}
                                {loading ? 'Analyzing data...' : 'Generate Recommendation'}
                            </button>
                        </form>

                        {result && (
                            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-blue-100 animate-fade-in">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="bg-blue-600 p-3 rounded-xl shadow-md">
                                        <CheckCircle className="text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Recommended Fertilizer</span>
                                        <h3 className="text-3xl font-black text-slate-800 leading-tight">{result}</h3>
                                    </div>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-blue-200/50">
                                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                        ✨ Expert Reasoning:
                                    </h4>
                                    <p className="text-slate-700 leading-relaxed italic">{reasoning || 'AI is crafting your personalized explanation...'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Content */}
                <div className="space-y-12 animate-slide-in-right">
                    <section className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 transition-transform hover:-translate-y-1">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="bg-blue-100 p-2 rounded-lg text-blue-600">📊</span>
                            Smart Nutrient Model
                        </h2>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <img src="/images/fertilizer_hand.png" alt="Fertilizer" className="w-40 h-40 object-cover rounded-2xl shadow-lg ring-4 ring-blue-50" />
                            <div className="flex-1">
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Our system implements a sophisticated hybrid approach. We first use <strong>Nearest Centroid Analysis</strong> on validated agricultural datasets to provide a mathematically precise recommendation.
                                </p>
                                <p className="text-slate-600 leading-relaxed mt-4">
                                    This is then enriched by <strong>Generative AI</strong> to provide expert-level reasoning, explaining exactly why your soil needs specific nutrients and how it will impact your yield.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Core Benefits</h3>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex gap-3">
                                    <span className="text-emerald-500 font-bold">✓</span>
                                    <span>Precise NPK balancing</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-emerald-500 font-bold">✓</span>
                                    <span>Reduced chemical waste</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-emerald-500 font-bold">✓</span>
                                    <span>Enhanced soil health</span>
                                </li>
                            </ul>
                        </section>

                        <section className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Critical Notes</h3>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex gap-3">
                                    <span className="text-amber-500 font-bold">!</span>
                                    <span>Requires accurate lab data</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-amber-500 font-bold">!</span>
                                    <span>Weather impacts dosage</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-amber-500 font-bold">!</span>
                                    <span>Monitor over 14 days</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, name, val, set, icon }) {
    return (
        <div className="relative">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                {icon}
                {label}
            </label>
            <input
                type="number"
                required
                placeholder="0.00"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-700 font-semibold"
                value={val}
                onChange={e => set(p => ({ ...p, [name]: e.target.value }))}
            />
        </div>
    );
}

function SelectField({ label, name, opts, val, set }) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{label}</label>
            <select
                required
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-700 font-semibold appearance-none"
                value={val}
                onChange={e => set(p => ({ ...p, [name]: e.target.value }))}
            >
                <option value="">Choose Option</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}
