import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebaseConfig';
import { Sprout, MapPin, ChevronRight, Save } from 'lucide-react';

export default function RegistrationDetails() {
    const [registrationData, setRegistrationData] = useState({
        state: "",
        city: "",
        mandal: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) navigate("/login");
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleContinue = (e) => {
        e.preventDefault();
        const { state, city, mandal } = registrationData;

        if (!state || !city || !mandal) {
            alert("Please fill all details");
            return;
        }

        navigate("/dashboard", {
            state: { state, city, mandal },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 font-sans">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-green-600 p-8 text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Regional Settings</h2>
                    <p className="text-green-100 mt-1 text-sm">Help us localize your agricultural advice</p>
                </div>

                <form onSubmit={handleContinue} className="p-8 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">State</label>
                        <select
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                            value={registrationData.state}
                            onChange={(e) => setRegistrationData({ ...registrationData, state: e.target.value })}
                            required
                        >
                            <option value="">Select State</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Punjab">Punjab</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">City / Village</label>
                        <input
                            type="text"
                            placeholder="Enter your village or city"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                            value={registrationData.city}
                            onChange={(e) => setRegistrationData({ ...registrationData, city: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Mandal / Tehsil</label>
                        <input
                            type="text"
                            placeholder="e.g., Kavali"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                            value={registrationData.mandal}
                            onChange={(e) => setRegistrationData({ ...registrationData, mandal: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        Enter Dashboard
                        <ChevronRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
