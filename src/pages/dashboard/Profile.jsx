import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebaseConfig';
import SideMenu from '../../components/SideMenu';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            if (!u) {
                navigate("/login");
            } else {
                setUser(u);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <SideMenu user={{
                name: user.displayName || 'Farmer',
                email: user.email
            }} />

            <main className="flex-1 ml-64 p-8">
                <div className="profile-container">
                    <div className="profile-header">
                        <h2>My Agriculture Profile</h2>
                        <p>Manage your account details and regional settings for localized crop advice.</p>
                    </div>

                    <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-section">
                            <h3>Account Identity</h3>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input type="text" defaultValue={user.displayName || ""} placeholder="Enter your name" />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" value={user.email || ""} disabled />
                                <small>Email cannot be changed after verification.</small>
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input type="password" value="********" readOnly />
                                <button type="button" className="text-btn">Update Password</button>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="form-section">
                            <h3>Farm Location</h3>
                            <div className="grid-row">
                                <div className="input-group">
                                    <label>State</label>
                                    <select defaultValue="">
                                        <option value="" disabled>Select State</option>
                                        <option>Andhra Pradesh</option>
                                        <option>Telangana</option>
                                        <option>Punjab</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Mandal / Tehsil</label>
                                    <input type="text" placeholder="e.g., Kavali" />
                                </div>
                            </div>

                            <div className="grid-row">
                                <div className="input-group">
                                    <label>City / Village</label>
                                    <input type="text" placeholder="Enter village name" />
                                </div>
                                <div className="input-group">
                                    <label>Pincode</label>
                                    <input type="number" placeholder="6-digit code" />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions mt-8 flex gap-4">
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" className="cancel-btn bg-gray-100 text-gray-700 px-6 py-3 rounded-md font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
