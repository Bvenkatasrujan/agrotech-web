import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertTriangle, CheckCircle2, MapPin, ChevronRight, Chrome, ArrowLeft } from 'lucide-react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { auth, db } from '../../services/firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";


import AuthIllustration from '../../assets/auth-illustration.png';
import locationsData from '../../data/locations.json';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        state: '',
        district: '',
        mandal: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);

    const navigate = useNavigate();


    // Derived data for location selection
    const availableStates = locationsData.states || [];
    const selectedStateData = availableStates.find(s => s.name === formData.state);
    const availableDistricts = selectedStateData ? selectedStateData.districts : [];
    const selectedDistrictData = availableDistricts.find(d => d.name === formData.district);
    const availableMandals = selectedDistrictData ? selectedDistrictData.mandals : [];

    useEffect(() => {

        // Reset state/mandals if parent selection changes
        if (step === 2) {
            // No action needed yet, but could reset child selections
        }
    }, [formData.state, formData.district]);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user has profile in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                localStorage.setItem('user_session', JSON.stringify(user));
                navigate("/home");
            } else {
                // If new user via Google, they still need to complete Step 2 (Location)
                setFormData(prev => ({ ...prev, name: user.displayName, email: user.email }));
                setIsLogin(false);
                setStep(2);
            }
        } catch (error) {
            console.error("Google Sign-In Error Detail:", error);
            if (error.code === 'permission-denied') {
                setError("Database error: Missing permission to fetch your profile. Please contact support.");
            } else {
                setError(error.message.replace('Firebase: ', ''));
            }
        } finally {

            setLoading(false);
        }
    };

    const [showResend, setShowResend] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShowResend(false);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setError("Please verify your email before login.");
                setShowResend(true);
                await auth.signOut();
                setLoading(false);
                return;
            }


            // Check if user has profile in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                localStorage.setItem('user_session', JSON.stringify(user));
                navigate("/home");
            } else {
                // If profile missing, they need to complete location details
                setIsLogin(false);
                setStep(2);
                // We'll use the displayName if available
                setFormData(prev => ({ ...prev, name: user.displayName || prev.name }));
            }

        } catch (error) {
            console.error("Login Error:", error);
            setError(error.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (!formData.email || !formData.password) {
            setError("Please enter your email and password to resend the link.");
            return;
        }
        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            await sendEmailVerification(userCredential.user);
            await auth.signOut();
            setError("New verification link sent! Please check your email.");
            setShowResend(false);
        } catch (err) {
            setError("Could not resend link. " + err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterStep1 = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {


            setError("Please fill all details");
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log("Starting Registration Step 1 for:", formData.email);
            // 1. Create User
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            console.log("User created successfully:", user.uid);

            // 2. Set Display Name (helps identifying user later)
            await updateProfile(user, { displayName: formData.name });
            console.log("Profile updated with name:", formData.name);

            // 3. Send Verification
            console.log("Attempting to send verification email...");
            await sendEmailVerification(user);
            console.log("Verification email call completed.");

            // 4. Critically: We don't write to Firestore yet to avoid permission errors
            // And we sign out so they must login after verification
            await auth.signOut();
            console.log("User signed out after sending verification.");

            alert("Verification email has been triggered successfully! Please check your inbox (and spam).");
            setVerificationSent(true);
        } catch (error) {
            console.error("Registration Step 1 Error:", error);
            setError(error.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSubmit = async (e) => {
        e.preventDefault();
        if (!formData.state || !formData.district || !formData.mandal) {
            setError("Please select your location details");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No authenticated user found");

            // Store complete details in Firestore (Now they are verified and signed in)
            await setDoc(doc(db, "users", user.uid), {
                name: formData.name || user.displayName,
                email: user.email,
                phone: formData.phone,
                state: formData.state,
                district: formData.district,
                mandal: formData.mandal,
                createdAt: new Date().toISOString(),
                registrationCompleted: true
            });

            localStorage.setItem('user_session', JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: formData.name || user.displayName
            }));
            navigate("/home");

        } catch (error) {
            console.error("Profile Completion Error:", error);
            setError(error.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    if (verificationSent) {
        return (
            <div className="flex min-h-screen bg-[#f8fafc] font-sans items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        We've sent a verification link to <span className="font-bold text-gray-900">{formData.email}</span>. Please verify your email to complete registration.
                        <br /><br />
                        <span className="text-sm italic text-amber-600 font-medium">Tip: If you don't see it, please check your <b>Spam/Junk</b> folder.</span>
                    </p>
                    <button
                        onClick={() => {
                            setVerificationSent(false);
                            setIsLogin(true);
                        }}
                        className="w-full bg-[#1b5e20] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#154d1a] transition-all"
                    >
                        Back to Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-sans items-center justify-center p-4 md:p-8">
            <div className="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[650px] transition-all duration-500">

                {/* Left Side: Form Content */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative overflow-hidden">

                    {/* Background decoration for mobile */}
                    <div className="md:hidden absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>

                    <div className="mb-8 flex items-center justify-between z-10">
                        {(!isLogin && step === 2) && (
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-1 text-sm font-bold text-[#1b5e20] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AgroTech AI</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full z-10 transition-all duration-300">




                        <header className="mb-8">
                            <h1 className="text-4xl font-extrabold text-[#111827]">
                                {isLogin ? 'Log In' : (step === 1 ? 'Sign Up' : 'Location')}
                            </h1>
                            <p className="text-gray-500 font-medium mt-2">
                                {isLogin
                                    ? 'Welcome back! Please enter your details.'
                                    : (step === 1 ? 'Start your journey with us.' : 'Help us localize your advice.')}
                            </p>
                        </header>

                        {isLogin ? (
                            <div className="space-y-6">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                                >
                                    <Chrome className="w-5 h-5 text-blue-600" />
                                    Sign in with Google
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="px-4 bg-white text-gray-400">or use email</span></div>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-[#1b5e20] focus:bg-white outline-none transition-all"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password"
                                                required
                                                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-[#1b5e20] focus:bg-white outline-none transition-all"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3.5 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                <p className="font-medium">{error}</p>
                                            </div>
                                            {showResend && (
                                                <button
                                                    type="button"
                                                    onClick={handleResendEmail}
                                                    className="text-xs font-bold text-[#1b5e20] hover:underline ml-1"
                                                >
                                                    Didn't get the email? Resend Link
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#1b5e20] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/10 mt-2 hover:bg-[#154d1a] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Log In'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {step === 1 ? (
                                    <form onSubmit={handleRegisterStep1} className="space-y-4">

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    placeholder="Enter email"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    placeholder="Phone number"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create password"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3.5 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                <p className="font-medium">{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#1b5e20] text-white font-bold py-4 rounded-xl shadow-lg mt-4 hover:bg-[#154d1a] transition-all flex items-center justify-center gap-2 group"
                                        >
                                            {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                                                <>
                                                    Continue
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>

                                    </form>
                                ) : (
                                    <form onSubmit={handleLocationSubmit} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    placeholder="Enter phone number"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">State</label>
                                            <select
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all appearance-none"
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value, district: '', mandal: '' })}
                                            >
                                                <option value="">Select State</option>
                                                {availableStates.map(state => (
                                                    <option key={state.name} value={state.name}>{state.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">District</label>
                                            <select
                                                required
                                                disabled={!formData.state}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all appearance-none disabled:opacity-50"
                                                value={formData.district}
                                                onChange={e => setFormData({ ...formData, district: e.target.value, mandal: '' })}
                                            >
                                                <option value="">Select District</option>
                                                {availableDistricts.map(district => (
                                                    <option key={district.name} value={district.name}>{district.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Mandal / Tehsil</label>
                                            <select
                                                required
                                                disabled={!formData.district}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all appearance-none disabled:opacity-50"
                                                value={formData.mandal}
                                                onChange={e => setFormData({ ...formData, mandal: e.target.value })}
                                            >
                                                <option value="">Select Mandal</option>
                                                {availableMandals.map(mandal => (
                                                    <option key={mandal.name} value={mandal.name}>{mandal.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3.5 rounded-xl text-sm border border-red-100">
                                                <AlertTriangle className="w-4 h-4" />
                                                <p className="font-medium">{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#1b5e20] text-white font-bold py-4 rounded-xl shadow-lg mt-4 hover:bg-[#154d1a] transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Complete Registration'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setStep(1); setError(''); }}
                                className="text-[#1b5e20] font-bold hover:underline underline-offset-4"
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Right Side: Illustration */}
                <div className="hidden md:flex w-1/2 bg-[#1b5e20] relative p-12 flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-700/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-700/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>

                    <div className="relative z-10 self-end text-right">
                        <div className="flex items-center gap-2 justify-end text-white mb-1">
                            <span className="text-2xl font-black tracking-tight">AgroTech AI</span>
                        </div>
                        <p className="text-white/60 text-xs font-medium tracking-widest uppercase">( PRO VERSION )</p>
                    </div>

                    <div className="relative z-10 flex-1 flex items-center justify-center py-12">
                        <div className="relative w-full max-w-md">
                            <img
                                src={AuthIllustration}
                                alt="Farmers Illustration"
                                className="w-full h-auto drop-shadow-2xl animate-float"
                            />
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/20 blur-2xl rounded-full"></div>
                        </div>
                    </div>

                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            {isLogin ? "Get the best premium advice" : "Empowering Smarter Farming"}
                        </h2>
                        <p className="text-green-100/70 text-sm leading-relaxed max-w-sm mx-auto">
                            {isLogin
                                ? "You can get the best farming insights and market predictions with our professional AI Assistant."
                                : "Join thousands of farmers using AI to increase their yield and secure their future."}
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}} />
        </div >
    );
}

