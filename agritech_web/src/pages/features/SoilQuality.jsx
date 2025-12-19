import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { soilService } from '../../services/soilService';
import { Leaf, Loader, CheckCircle, AlertTriangle, Droplets, FlaskConical } from 'lucide-react';

export default function SoilQuality() {
    const [formData, setFormData] = useState({ ph: '', nitrogen: '', phosphorous: '', potassium: '', moisture: '' });
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Use soilService for analysis
        setTimeout(() => {
            const result = soilService.analyzeSoil(formData);
            setAnalysis(result);
            setLoading(false);
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16 text-center shadow-inner">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Soil Quality Analysis</h1>
                <p className="text-emerald-50 text-xl max-w-2xl mx-auto px-4">Deep dive into your soil's health with professional diagnostic tools.</p>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="animate-slide-in-left">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-8 border border-slate-100">
                        <div className="bg-emerald-600 p-4 flex items-center gap-3">
                            <Leaf className="text-white" />
                            <h2 className="text-xl font-bold text-white">Soil Parameters</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="pH Level" name="ph" val={formData.ph} onChange={handleChange} icon={<FlaskConical size={14} />} />
                                <InputField label="Moisture (%)" name="moisture" val={formData.moisture} onChange={handleChange} icon={<Droplets size={14} />} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Nitrogen" name="nitrogen" val={formData.nitrogen} onChange={handleChange} />
                                <InputField label="Phosphorous" name="phosphorous" val={formData.phosphorous} onChange={handleChange} />
                                <InputField label="Potassium" name="potassium" val={formData.potassium} onChange={handleChange} />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all flex justify-center items-center gap-3 shadow-lg shadow-emerald-200"
                            >
                                {loading ? <Loader className="animate-spin" /> : <Leaf />}
                                {loading ? 'Analyzing Soil...' : 'Run Diagnostics'}
                            </button>
                        </form>

                        {analysis && (
                            <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-t border-emerald-100 animate-fade-in">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Health Score</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-slate-800">{analysis.score}</span>
                                            <span className="text-xl font-bold text-slate-400">/100</span>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full font-bold text-sm ${analysis.status === 'Healthy' ? 'bg-emerald-200 text-emerald-800' :
                                            analysis.status === 'Moderate' ? 'bg-amber-200 text-amber-800' : 'bg-red-200 text-red-800'
                                        }`}>
                                        {analysis.status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-700 size-sm uppercase tracking-widest px-1">Recommendations</h4>
                                    {analysis.suggestions.map((s, i) => (
                                        <div key={i} className="flex gap-3 bg-white/60 p-3 rounded-lg border border-emerald-100">
                                            <CheckCircle className="text-emerald-500 shrink-0" size={20} />
                                            <p className="text-slate-700 text-sm leading-snug">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-12 animate-slide-in-right">
                    <section className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-600 transition-transform hover:-translate-y-1">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="bg-emerald-100 p-2 rounded-lg text-emerald-600">🧪</span>
                            Scientific Analysis
                        </h2>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <img src="/images/soil_analysis.png" alt="Soil Analysis" className="w-40 h-40 object-cover rounded-2xl shadow-lg ring-4 ring-emerald-50" />
                            <div className="flex-1">
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Our soil quality model uses multi-parameter heuristic analysis to determine the biological and chemical health of your land.
                                </p>
                                <p className="text-slate-600 leading-relaxed mt-4">
                                    By cross-referencing pH, moisture, and core NPK ratios, we provide a holistic "Health Score" and actionable steps to optimize your soil for future planting cycles.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Why Analyze?</h3>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex gap-3"><span className="text-emerald-500 font-bold">✓</span><span>Optimize yield potential</span></li>
                                <li className="flex gap-3"><span className="text-emerald-500 font-bold">✓</span><span>Early deficiency detection</span></li>
                                <li className="flex gap-3"><span className="text-emerald-500 font-bold">✓</span><span>Sustainable land use</span></li>
                            </ul>
                        </section>

                        <section className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Common Risks</h3>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex gap-3"><span className="text-red-500 font-bold">!</span><span>Over-acidification</span></li>
                                <li className="flex gap-3"><span className="text-red-500 font-bold">!</span><span>Nutrient leaching</span></li>
                                <li className="flex gap-3"><span className="text-red-500 font-bold">!</span><span>Soil erosion risk</span></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, name, val, onChange, icon }) {
    return (
        <div className="relative">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                {icon}
                {label}
            </label>
            <input
                type="number"
                name={name}
                required
                placeholder="0"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-slate-700 font-semibold"
                value={val}
                onChange={onChange}
            />
        </div>
    );
}
