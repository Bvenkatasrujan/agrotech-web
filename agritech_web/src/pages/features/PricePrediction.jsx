import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { priceService } from '../../services/priceService';
import { TrendingUp, Loader, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus, BarChart3 } from 'lucide-react';

export default function PricePrediction() {
    const [selectedCrop, setSelectedCrop] = useState('');
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(false);

    const crops = priceService.getAllCrops();

    const handlePredict = (e) => {
        e.preventDefault();
        if (!selectedCrop) return;

        setLoading(true);
        setTimeout(() => {
            const data = priceService.getPriceData(selectedCrop);
            setPriceData(data);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="bg-gradient-to-r from-orange-600 to-amber-700 text-white py-16 text-center shadow-inner">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Market Intelligence</h1>
                <p className="text-orange-50 text-xl max-w-2xl mx-auto px-4">Predictive crop pricing to help you time the market perfectly.</p>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="animate-slide-in-left">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-8 border border-slate-100">
                        <div className="bg-orange-600 p-4 flex items-center gap-3">
                            <TrendingUp className="text-white" />
                            <h2 className="text-xl font-bold text-white">Price Forecast Tool</h2>
                        </div>
                        <form onSubmit={handlePredict} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Select Your Crop</label>
                                <select
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all outline-none text-slate-700 font-semibold appearance-none"
                                    value={selectedCrop}
                                    onChange={(e) => setSelectedCrop(e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Crop --</option>
                                    {crops.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 active:scale-95 transition-all flex justify-center items-center gap-3 shadow-lg shadow-orange-200"
                            >
                                {loading ? <Loader className="animate-spin" /> : <BarChart3 />}
                                {loading ? 'Analyzing Market...' : 'Analyze Price Trend'}
                            </button>
                        </form>

                        {priceData && (
                            <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-t border-orange-100 animate-fade-in">
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Current Mkt Price</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-slate-800">₹{priceData.current}</span>
                                            <span className="text-sm font-bold text-slate-500">/qtl</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Weekly Trend</span>
                                        <div className={`flex items-center gap-1 text-2xl font-black ${priceData.trend.startsWith('+') ? 'text-emerald-600' :
                                                priceData.trend.startsWith('-') ? 'text-red-600' : 'text-slate-600'
                                            }`}>
                                            {priceData.trend.startsWith('+') ? <ArrowUpRight /> :
                                                priceData.trend.startsWith('-') ? <ArrowDownRight /> : <Minus />}
                                            {priceData.trend}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-700 size-sm uppercase tracking-widest px-1">5-Day Forecast Trend</h4>
                                    <div className="flex items-end justify-between h-32 px-2 pb-2">
                                        {priceData.forecast.map((val, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2 group">
                                                <div
                                                    className="w-8 bg-orange-500 rounded-t-lg transition-all group-hover:bg-orange-600"
                                                    style={{ height: `${(val / Math.max(...priceData.forecast)) * 100}%` }}
                                                ></div>
                                                <span className="text-[10px] font-bold text-slate-500">₹{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-12 animate-slide-in-right">
                    <section className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-orange-600 transition-transform hover:-translate-y-1">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="bg-orange-100 p-2 rounded-lg text-orange-600">📈</span>
                            Market Intelligence Model
                        </h2>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <img src="/images/price_tech.png" alt="Price Technology" className="w-40 h-40 object-cover rounded-2xl shadow-lg ring-4 ring-orange-50" />
                            <div className="flex-1">
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Gain the upper hand in negotiations. Our AI analyzes historical Mandi data and seasonal patterns to predict price fluctuations.
                                </p>
                                <p className="text-slate-600 leading-relaxed mt-4">
                                    By understanding the supply-demand curves, you can decide whether to sell immediately or hold stock for better returns in the coming weeks.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Strategic Gains</h3>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex gap-3"><span className="text-emerald-500 font-bold">✓</span><span>Maximized profit margins</span></li>
                                <li className="flex gap-3"><span className="text-emerald-500 font-bold">✓</span><span>Avoid seasonal price drops</span></li>
                                <li className="flex gap-3"><span className="text-emerald-500 font-bold">✓</span><span>Better negotiation power</span></li>
                            </ul>
                        </section>

                        <section className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Market Risks</h3>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex gap-3"><span className="text-red-500 font-bold">!</span><span>Sudden import/export changes</span></li>
                                <li className="flex gap-3"><span className="text-red-500 font-bold">!</span><span>Extreme weather impacts</span></li>
                                <li className="flex gap-3"><span className="text-red-500 font-bold">!</span><span>Logistic disruptions</span></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
