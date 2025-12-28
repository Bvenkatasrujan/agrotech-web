import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import SideMenu from '../../components/SideMenu';
import locationsData from '../../data/locations.json';
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        district: '',
        mandal: '',
        city: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Derived data for location selection
    const availableStates = locationsData.states || [];
    const selectedStateData = availableStates.find(s => s.name === profileData.state);
    const availableDistricts = selectedStateData ? selectedStateData.districts : [];
    const selectedDistrictData = availableDistricts.find(d => d.name === profileData.district);
    const availableMandals = selectedDistrictData ? selectedDistrictData.mandals : [];

    useEffect(() => {
        const fetchUserProfile = async (currentUser) => {
            try {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfileData({
                        name: data.name || currentUser.displayName || '',
                        email: currentUser.email || '',
                        phone: data.phone || '',
                        state: data.state || '',
                        district: data.district || '',
                        mandal: data.mandal || '',
                        city: data.city || '',
                        pincode: data.pincode || ''
                    });
                } else {
                    setProfileData(prev => ({
                        ...prev,
                        name: currentUser.displayName || '',
                        email: currentUser.email || ''
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((u) => {
            if (!u) {
                navigate("/login");
            } else {
                setUser(u);
                fetchUserProfile(u);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                name: profileData.name,
                phone: profileData.phone,
                state: profileData.state,
                district: profileData.district,
                mandal: profileData.mandal,
                city: profileData.city,
                pincode: profileData.pincode,
                updatedAt: new Date().toISOString()
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-slate-50 min-h-screen items-center justify-center">
                <div className="h-10 w-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <SideMenu user={{
                name: profileData.name || 'Farmer',
                email: profileData.email
            }} />

            <main className="flex-1 ml-64 p-8">
                <div className="profile-container max-w-4xl mx-auto">
                    <div className="profile-header mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 line-height-tight">My Agriculture Profile</h2>
                        <p className="text-gray-500 mt-2">Manage your account details and regional settings for localized crop advice.</p>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <p className="font-semibold">{message.text}</p>
                        </div>
                    )}

                    <form className="profile-form space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100" onSubmit={handleSave}>
                        <div className="form-section">
                            <h3 className="text-lg font-bold text-[#1b5e20] mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-[#1b5e20] rounded-full inline-block"></span>
                                Account Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="input-group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                        value={profileData.name}
                                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                        value={profileData.email}
                                        disabled
                                    />
                                    <small className="text-xs text-gray-400 mt-1 block px-1">Email cannot be changed after verification.</small>
                                </div>
                                <div className="input-group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                        value={profileData.phone}
                                        onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div className="form-section">
                            <h3 className="text-lg font-bold text-[#1b5e20] mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-[#1b5e20] rounded-full inline-block"></span>
                                Farm Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="input-group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all appearance-none"
                                        value={profileData.state}
                                        onChange={e => setProfileData({ ...profileData, state: e.target.value, district: '', mandal: '' })}
                                        required
                                    >
                                        <option value="">Select State</option>
                                        {availableStates.map(state => (
                                            <option key={state.name} value={state.name}>{state.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">District</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all appearance-none disabled:opacity-50"
                                        value={profileData.district}
                                        onChange={e => setProfileData({ ...profileData, district: e.target.value, mandal: '' })}
                                        disabled={!profileData.state}
                                        required
                                    >
                                        <option value="">Select District</option>
                                        {availableDistricts.map(district => (
                                            <option key={district.name} value={district.name}>{district.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mandal / Tehsil</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all appearance-none disabled:opacity-50"
                                        value={profileData.mandal}
                                        onChange={e => setProfileData({ ...profileData, mandal: e.target.value })}
                                        disabled={!profileData.district}
                                        required
                                    >
                                        <option value="">Select Mandal</option>
                                        {availableMandals.map(mandal => (
                                            <option key={mandal.name} value={mandal.name}>{mandal.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">City / Village</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                        value={profileData.city}
                                        onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                                        placeholder="Enter village name"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pincode</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                        value={profileData.pincode}
                                        onChange={e => setProfileData({ ...profileData, pincode: e.target.value })}
                                        placeholder="6-digit code"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions mt-8 pt-6 border-t border-gray-100 flex gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#1b5e20] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#154d1a] active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-green-900/10 disabled:opacity-70"
                            >
                                {saving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save className="w-5 h-5" /> Save Changes</>}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
