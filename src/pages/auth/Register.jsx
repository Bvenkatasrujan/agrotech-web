import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, User, Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from '../../services/firebaseConfig';
import LoginBg from '../../assets/login-bg.png';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: formData.name,
            });

            await sendEmailVerification(user);

            alert("Verification email sent. Please check your inbox and verify before login.");
            navigate('/login');

        } catch (error) {
            console.error("Registration Error:", error);
            setError(error.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen font-sans">
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-16 lg:p-24 relative z-10">
                <div className="w-full max-w-md mx-auto">
                    <Link to="/login" className="flex items-center gap-2 mb-8 group w-fit">
                        <div className="bg-gradient-to-br from-green-600 to-green-800 p-2.5 rounded-xl shadow-lg shadow-green-200">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">AgroTech AI</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500 mb-8">Join smart farmers optimizing their yields.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Full Name" required
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" placeholder="Email Address" required
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="password" placeholder="Password" required
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="password" placeholder="Confirm Password" required
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                            {loading ? 'Creating Account...' : 'Continue'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-gray-900 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block w-1/2 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-900/40 mix-blend-multiply z-10"></div>
                <img
                    src={LoginBg}
                    alt="Agricultural Field"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="relative z-20 h-full flex flex-col justify-end p-20 text-white">
                    <h2 className="text-4xl font-bold mb-4">Empowering Farmers with AI</h2>
                    <p className="text-lg text-white/80 max-w-md">Join the largest network of smart farmers using technology to predict market trends and improve soil health.</p>
                </div>
            </div>
        </div>
    );
}

