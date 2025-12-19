import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { APP_CONSTANTS } from '../../utils/constants';

// Extended Mock Data for Demo Purposes
const LOCATION_DATA = {
    'Andhra Pradesh': {
        cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Kurnool', 'Nellore', 'Tirupati'],
        mandis: ['Anakapalle', 'Guntur Yard', 'Kurnool Market', 'Adoni', 'Nellore APMC', 'Tirupati Market']
    },
    'Telangana': {
        cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar'],
        mandis: ['Bowenpally', 'Warangal Market', 'Nizamabad Yard', 'Khammam', 'Karimnagar Yard']
    },
    'Maharashtra': {
        cities: ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Jalgaon', 'Solapur'],
        mandis: ['Vashi APMC', 'Pune APMC', 'Lasalgaon', 'Nagpur Market', 'Aurangabad Yard', 'Jalgaon Mandi', 'Solapur Market']
    },
    'Punjab': {
        cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
        mandis: ['Khanna', 'Sirhind', 'Rajpura', 'Jalandhar Cantt', 'Bathinda Market']
    },
    'Uttar Pradesh': {
        cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Prayagraj'],
        mandis: ['Lucknow Market', 'Kanpur Grain', 'Varanasi Yard', 'Agra Mandi', 'Meerut Yard', 'Prayagraj Mandi']
    },
    'Karnataka': {
        cities: ['Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore', 'Shimoga'],
        mandis: ['Yeshwantpur', 'Mysore APMC', 'Hubli Market', 'Belgaum Yard', 'Mangalore APMC', 'Shimoga Mandi']
    },
    'Gujarat': {
        cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Unjha', 'Bhavnagar'],
        mandis: ['Ahmedabad Market', 'Surat APMC', 'Vadodara Yard', 'Rajkot Mandi', 'Unjha Mandi', 'Bhavnagar Yard']
    },
    'Madhya Pradesh': {
        cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
        mandis: ['Bhopal Mandi', 'Indore Yard', 'Gwalior Market', 'Jabalpur APMC', 'Ujjain Yard']
    },
    'Rajasthan': {
        cities: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Barmer'],
        mandis: ['Jaipur Mandi', 'Jodhpur Yard', 'Kota APMC', 'Udaipur Market', 'Barmer Mandi']
    },
    'Tamil Nadu': {
        cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
        mandis: ['Koyambedu', 'Coimbatore Market', 'Madurai Yard', 'Trichy Mandi', 'Salem APMC']
    },
    'Haryana': {
        cities: ['Gurgaon', 'Faridabad', 'Ambala', 'Karnal', 'Hisar', 'Rohtak'],
        mandis: ['Gurugram Mandi', 'Ballabgarh', 'Ambala Cantt', 'Karnal Yard', 'Hisar Market', 'Rohtak Mandi']
    },
    'Bihar': {
        cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
        mandis: ['Patna Mandi', 'Gaya Yard', 'Bhagalpur Market', 'Muzaffarpur APMC']
    },
    'West Bengal': {
        cities: ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
        mandis: ['Kolkata Market', 'Howrah Yard', 'Durgapur Mandi', 'Siliguri APMC']
    },
    'Kerala': {
        cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
        mandis: ['Kochi Market', 'TVM Yard', 'Kozhikode Mandi', 'Thrissur APMC']
    },
    'Odisha': {
        cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur'],
        mandis: ['Bhubaneswar APMC', 'Cuttack Yard', 'Rourkela Market', 'Sambalpur Mandi']
    },
    // Default fallback for others
    'default': {
        cities: ['District 1', 'District 2', 'District 3'],
        mandis: ['Local Mandi 1', 'Local Mandi 2']
    }
};

const CROP_OPTIONS = [
    'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane',
    'Potato', 'Tomato', 'Onion', 'Soybean', 'Groundnut',
    'Barley', 'Pulses', 'Turmeric', 'Chilli'
];

export default function Register() {
    const [formData, setFormData] = useState({
        name: '', password: '', state: '', city: '', preferredMandi: '', cropsGrown: []
    });
    const [cities, setCities] = useState([]);
    const [mandis, setMandis] = useState([]);
    const navigate = useNavigate();

    // Handle State Change
    const handleStateChange = (e) => {
        const state = e.target.value;
        const data = LOCATION_DATA[state] || LOCATION_DATA['default'];
        setFormData({ ...formData, state, city: '', preferredMandi: '' });
        setCities(data.cities);
        setMandis(data.mandis);
    };

    // Handle Crop Selection (Multi-select)
    const toggleCrop = (crop) => {
        if (formData.cropsGrown.includes(crop)) {
            setFormData({ ...formData, cropsGrown: formData.cropsGrown.filter(c => c !== crop) });
        } else {
            // Limit to 4 for UI neatness if needed, or allow all
            setFormData({ ...formData, cropsGrown: [...formData.cropsGrown, crop] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation
        if (formData.cropsGrown.length === 0) {
            alert('Please select at least one crop.');
            return;
        }

        const result = dataService.registerUser(formData);
        if (result.success) {
            // Redirect to Home/Dashboard. 
            // User requested "home page where user name... is in up most side".
            // We'll go to Dashboard, often the "Home" for users.
            navigate('/dashboard');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-agri-light flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl my-8">
                <h1 className="text-3xl font-bold text-agri-green mb-2 text-center">Join AgroTech AI</h1>
                <p className="text-gray-500 text-center mb-8">Create your detailed farmer profile</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Access Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Location Details */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Location Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                                    onChange={handleStateChange}
                                    required
                                    value={formData.state}
                                >
                                    <option value="">Select State</option>
                                    {APP_CONSTANTS.indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">City / District</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    required
                                    value={formData.city}
                                    disabled={!formData.state}
                                >
                                    <option value="">Select City</option>
                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Preferred Mandi</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                                    onChange={e => setFormData({ ...formData, preferredMandi: e.target.value })}
                                    required
                                    value={formData.preferredMandi}
                                    disabled={!formData.city}
                                >
                                    <option value="">Select Mandi</option>
                                    {mandis.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Crop Selection */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Crops Grown</h3>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                            {CROP_OPTIONS.map(crop => (
                                <div
                                    key={crop}
                                    onClick={() => toggleCrop(crop)}
                                    className={`cursor-pointer px-2 py-2 rounded-lg text-sm text-center border transition-all ${formData.cropsGrown.includes(crop)
                                        ? 'bg-green-600 text-white border-green-700 shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-green-50'
                                        }`}
                                >
                                    {crop}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Selected: {formData.cropsGrown.join(', ') || 'None'}</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-agri-green text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg mt-6"
                    >
                        Create Account & Login
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm font-medium text-green-700 hover:underline">Already have an account? Login here</Link>
                </div>
            </div>
        </div>
    );
}
