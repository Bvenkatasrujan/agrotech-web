import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { climateService } from '../../services/climateService';
import { CloudRain, Sun, Wind, Droplets, Calendar, CheckCircle, AlertTriangle, Search, Eye, Thermometer, Sunrise, Sunset, Gauge, Cloud, CloudSnow, CloudLightning, CloudDrizzle } from 'lucide-react';

export default function Forecast() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('Kāvali');

    useEffect(() => {
        loadWeather(location);
    }, []);

    const loadWeather = async (loc) => {
        setLoading(true);
        try {
            const data = await climateService.getWeather(loc);
            setWeather(data);
            setLocation(data.name);
        } catch (error) {
            console.error("Failed to load weather:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            loadWeather(searchQuery);
        }
    };

    const getWeatherIcon = (description, size = 20) => {
        const desc = description?.toLowerCase() || '';
        if (desc.includes('clear')) return <Sun className="text-yellow-500" size={size} />;
        if (desc.includes('rain')) return <CloudRain className="text-blue-500" size={size} />;
        if (desc.includes('cloud')) return <Cloud className="text-gray-400" size={size} />;
        if (desc.includes('snow')) return <CloudSnow className="text-blue-300" size={size} />;
        if (desc.includes('thunder')) return <CloudLightning className="text-purple-500" size={size} />;
        if (desc.includes('drizzle')) return <CloudDrizzle className="text-blue-400" size={size} />;
        return <Sun className="text-yellow-500" size={size} />;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Top Search Bar Area */}
            <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 flex justify-end">
                <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md bg-white p-1 rounded-lg shadow-sm border border-gray-200">
                    <input
                        type="text"
                        placeholder="Search for a location"
                        className="flex-1 px-4 py-2 outline-none text-gray-700 placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-[#22c55e] text-white px-6 py-2 rounded-md font-medium hover:bg-green-600 transition-colors">
                        Search
                    </button>
                </form>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left: Current Weather & Forecast Card */}
                <div className="bg-gradient-to-b from-[#b2dfdb] to-[#80cbc4] rounded-3xl p-8 shadow-lg text-[#263238] flex flex-col justify-between relative overflow-hidden min-h-[500px]">
                    <div className="text-center z-10">
                        <h2 className="text-2xl font-bold mb-2">{location}</h2>
                        <div className="flex justify-center my-4">
                            {getWeatherIcon(weather?.condition, 64)}
                        </div>
                        <div className="text-6xl font-bold mb-2">{weather?.temp}°C</div>
                        <p className="text-gray-600 capitalize">{weather?.condition}</p>
                    </div>

                    <div className="mt-8 z-10">
                        <h3 className="font-bold mb-4 text-gray-700">5-Day Forecast</h3>
                        <div className="space-y-4 divide-y divide-gray-400/30">
                            {weather?.forecast?.map((day, index) => (
                                <div key={index} className="flex items-center justify-between pt-3 first:pt-0">
                                    <div className="flex items-center gap-3">
                                        {getWeatherIcon(day.description)}
                                        <span className="text-gray-700 font-medium">{day.date}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm text-gray-500 capitalize'>{day.description}</span>
                                        <span className="font-bold text-gray-700">{day.temp}°C</span>
                                    </div>
                                </div>
                            )) || <p className="text-gray-500 text-center">Loading forecast...</p>}
                        </div>
                    </div>
                </div>

                {/* Right: Current Conditions Grid */}
                <div className="bg-gradient-to-b from-[#b2dfdb] to-[#80cbc4] rounded-3xl p-8 shadow-lg flex flex-col">
                    <h2 className="text-2xl font-bold text-[#263238] mb-8 text-center">Current Conditions</h2>

                    <div className="grid grid-cols-2 gap-4 flex-1">
                        {/* Air Quality */}
                        <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <Wind className="text-gray-600 mb-3" size={32} />
                            <span className="font-semibold text-gray-700">Air Quality Index</span>
                            <span className="text-xl font-bold text-gray-800 mt-2">{weather?.aqi || 5}</span>
                        </div>

                        {/* Sunrise/Sunset */}
                        <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <Sun className="text-yellow-500 mb-3" size={32} />
                            <div className="text-sm">
                                <p className="font-bold text-gray-700">Sunrise</p>
                                <p className="text-gray-600 mb-2">{weather?.sunrise}</p>
                                <p className="font-bold text-gray-700">Sunset</p>
                                <p className="text-gray-600">{weather?.sunset}</p>
                            </div>
                        </div>

                        {/* Humidity */}
                        <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <Droplets className="text-blue-500 mb-3" size={32} />
                            <span className="font-semibold text-gray-700">Humidity</span>
                            <span className="text-xl font-bold text-gray-800 mt-2">{weather?.humidity}%</span>
                        </div>

                        {/* Temperature */}
                        <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <Thermometer className="text-red-500 mb-3" size={32} />
                            <span className="font-semibold text-gray-700">Temperature</span>
                            <span className="text-xl font-bold text-gray-800 mt-2">{weather?.temp}°C</span>
                        </div>

                        {/* Wind Speed */}
                        <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <Wind className="text-green-500 mb-3" size={32} />
                            <span className="font-semibold text-gray-700">Wind Speed</span>
                            <span className="text-xl font-bold text-gray-800 mt-2">{weather?.wind} km/h</span>
                        </div>

                        {/* Pressure */}
                        <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <Gauge className="text-gray-600 mb-3" size={32} />
                            <span className="font-semibold text-gray-700">Pressure</span>
                            <span className="text-xl font-bold text-gray-800 mt-2">{weather?.pressure} hPa</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Information Content (Retained) */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="space-y-12">
                    <section className="bg-white p-8 rounded-xl shadow-md border-l-4 border-blue-500">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Price Forecasting System</h2>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            {/* Reusing existing image or placeholder */}
                            <img src="/images/forecast_farmers.png" alt="Forecasting" className="w-32 h-32 object-cover rounded-lg shadow-sm" />
                            <div>
                                <h3 className="text-xl font-bold text-blue-600 mb-2">Forecasting</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    The Price Forecasting System provides short-term (next 7 days) price trends for selected crops and mandis.
                                    By considering recent price movements, demand patterns, and weather conditions, it helps farmers decide the most profitable day to sell their produce.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">🤔 How it Works!</h2>
                        <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                            <div className="flex items-center gap-3"><span className="text-2xl">🌍</span><span className="text-gray-700 font-medium">Collect recent mandi price and weather data.</span></div>
                            <div className="flex items-center gap-3"><span className="text-2xl">📊</span><span className="text-gray-700 font-medium">Forecast crop prices for the next 7 days.</span></div>
                            <div className="flex items-center gap-3"><span className="text-2xl">🌾</span><span className="text-gray-700 font-medium">Recommend the best day to sell for maximum profit.</span></div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2"><CheckCircle /> Advantages</h3>
                            <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside">
                                <li>Assists farmers in short-term decision-making.</li>
                                <li>Improves profit margins by identifying peak prices.</li>
                                <li>Reduces losses caused by poor market timing.</li>
                                <li>Easy to understand and farmer-friendly insights.</li>
                            </ul>
                        </section>

                        <section className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2"><AlertTriangle /> Disadvantages</h3>
                            <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside">
                                <li>Short-term forecasts may change frequently.</li>
                                <li>Dependent on market and weather stability.</li>
                                <li>Limited accuracy during sudden market disruptions.</li>
                                <li>Requires daily data updates for reliability.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
