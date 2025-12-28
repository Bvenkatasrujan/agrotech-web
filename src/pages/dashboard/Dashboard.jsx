import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import SideMenu from '../../components/SideMenu';
import PriceChart from '../../components/PriceChart';
import { climateService } from '../../services/climateService';
import { geminiService } from '../../services/geminiService';
import { auth, db } from '../../services/firebaseConfig';

import { Thermometer, Droplets, Wind, CloudRain, AlertTriangle, ExternalLink, UserCheck } from 'lucide-react';

export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [weather, setWeather] = useState(null);
    const [recommendations, setRecommendations] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get registration data from Navigation state (passed during first signup redirect)
    const navData = location.state;

    useEffect(() => {
        const loadData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    navigate('/login');
                    return;
                }

                // If we don't have navData (e.g. on refresh), fetch from Firestore
                let city = navData?.city;
                let state = navData?.state;
                let mandal = navData?.mandal;

                if (!city || city === "N/A") {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        city = data.city || data.district || "N/A";
                        state = data.state || "N/A";
                        mandal = data.mandal || "N/A";
                    }
                }

                const userData = {
                    name: currentUser.displayName || "Farmer",
                    email: currentUser.email,
                    city,
                    state,
                    mandal
                };
                setUser(userData);

                // Fetch weather with the localized city
                const weatherCity = city !== "N/A" ? city : "Delhi"; // Fallback to Delhi for weather if N/A
                const w = await climateService.getWeather(weatherCity).catch(() => ({
                    temperature: '--', rainfall: '--', humidity: '--', wind: '--', alerts: ['Weather data unavailable']
                }));
                setWeather(w);

                setRecommendations({});
            } catch (err) {
                console.error("Dashboard Load Error:", err);
                setError("Something went wrong while loading your dashboard.");
            } finally {
                setLoading(false);
            }
        };

        if (auth.currentUser || localStorage.getItem('user_session')) {
            loadData();
        } else {
            const unsubscribe = auth.onAuthStateChanged((u) => {
                if (u) loadData();
                else navigate('/login');
            });
            return () => unsubscribe();
        }
    }, [navigate, navData]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-medium">Sprouting your dashboard...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
            <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Oops!</h2>
            <p className="text-slate-600 mt-2">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Retry</button>
        </div>
    );

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <SideMenu user={user} />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Welcome, {user.name}!</h1>
                            <p className="text-slate-500 text-lg mt-1">
                                {user.mandal}, {user.city}, {user.state}
                            </p>
                        </div>

                        {/* Compulsory Registration Form Button */}
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSegsGMSDOrhrK38O7zIiVcPJo5cLxLUd5ljaC0qVBL-F7PSdA/viewform?usp=dialog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-green-200 hover:scale-105 transition-all ring-4 ring-offset-2 ring-transparent hover:ring-green-100"
                        >
                            <UserCheck size={20} />
                            Complete Official Registration
                            <ExternalLink size={16} className="opacity-70" />
                        </a>
                    </div>

                    {/* Climate Section */}
                    <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 px-2">Local Weather Conditions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <ClimateCard icon={<Thermometer className="text-orange-500" />} label="Temp" value={`${weather.temperature}°C`} color="orange" />
                            <ClimateCard icon={<CloudRain className="text-blue-500" />} label="Rainfall" value={`${weather.rainfall} mm`} color="blue" />
                            <ClimateCard icon={<Droplets className="text-cyan-500" />} label="Humidity" value={`${weather.humidity}%`} color="cyan" />
                            <ClimateCard icon={<Wind className="text-slate-400" />} label="Wind" value={`${weather.wind} km/h`} color="slate" />
                        </div>

                        {weather.alerts?.length > 0 && weather.alerts[0] !== 'Weather data unavailable' ? (
                            <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 flex items-center gap-4 text-red-700">
                                <AlertTriangle className="animate-pulse" />
                                <span className="font-bold">Active Warning: {weather.alerts.join(', ')}</span>
                            </div>
                        ) : (
                            <div className="mt-6 bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4 flex items-center gap-4 text-green-700">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                                <span className="font-medium">All systems normal. Favorable conditions ahead.</span>
                            </div>
                        )}
                    </section>

                    {/* Price Trends */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full text-center">
                                <h2 className="text-xl font-bold text-slate-700 mb-6">Market Price Trends</h2>
                                <PriceChart />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-emerald-800 p-8 rounded-3xl shadow-2xl text-white">
                            <h3 className="text-2xl font-bold mb-4">Official Notice</h3>
                            <p className="opacity-90 leading-relaxed mb-8">
                                To unlock full governmental subsidies and priority market access, please complete the official farmer registration form.
                            </p>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSegsGMSDOrhrK38O7zIiVcPJo5cLxLUd5ljaC0qVBL-F7PSdA/viewform?usp=dialog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-black w-full justify-center shadow-lg hover:bg-slate-50 transition-colors"
                            >
                                Open Form <ExternalLink size={18} />
                            </a>
                        </div>
                    </section>

                    {/* AI Recommendations */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                            <span className="bg-green-100 text-green-600 p-2 rounded-xl">✨</span>
                            AI Sell Recommendations
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(recommendations).map(([crop, advice]) => (
                                <div key={crop} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                                    <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform">
                                        <SproutIcon size={200} />
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                            <SproutIcon size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">{crop} Strategy</h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-lg">{advice}</p>
                                </div>
                            ))}
                            {Object.keys(recommendations).length === 0 && !loading && (
                                <div className="col-span-2 py-12 text-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                                    <p className="text-slate-500 font-medium italic">Wait for AI to analyze your crop data...</p>
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}

function ClimateCard({ icon, label, value, color }) {
    const colors = {
        orange: 'bg-orange-50 text-orange-600',
        blue: 'bg-blue-50 text-blue-600',
        cyan: 'bg-cyan-50 text-cyan-600',
        slate: 'bg-slate-50 text-slate-600'
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-colors">
            <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-slate-800">{value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${colors[color] || colors.slate}`}>{icon}</div>
        </div>
    );
}

function SproutIcon({ size = 24 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.9 4 2.2 4.9 3" /><path d="M15 13.5c4.7 1 6.6 4.9 6.6 6.5" /><path d="M3 20c.5-2 1.9-4.6 4.8-6.5" /></svg>
    )
}



// Quick Icon component duplicate for internal use if needed, but Sprout is imported from lucide

