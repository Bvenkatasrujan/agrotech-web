import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, HelpCircle, Bot } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { dataService } from '../services/dataService';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/logo.svg';
import { auth } from '../services/firebaseConfig';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const featuresRef = useRef(null);

    useEffect(() => {
        const currentUser = dataService.getCurrentUser();
        setUser(currentUser);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (featuresRef.current && !featuresRef.current.contains(event.target)) {
                setShowFeatures(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            dataService.logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const featureLinks = [
        { name: 'Crop Prediction', to: '/crop-recommendation' },
        { name: 'Soil Analysis', to: '/soil-quality' },
        { name: 'Market Trends', to: '/price-prediction' },
        { name: 'Fertilizer Recommendation', to: '/fertilizer-recommendation' },
        { name: 'Forecast', to: '/forecast' },
        { name: 'Disease Detection', to: '/disease-detection' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-[#2E7D32] text-white shadow-md sticky top-0 z-50 border-b border-green-700/30">
            {/* Hidden Google Translate element for functionality - Must be in DOM but invisible */}
            <div id="google_translate_element" className="absolute opacity-0 pointer-events-none -z-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Section */}
                    <Link to="/home" className="flex items-center gap-3 font-bold text-xl select-none hover:opacity-95 transition-opacity group">
                        <div className="w-10 h-10 bg-white rounded-full p-0.5 shadow-inner border border-green-100/20 overflow-hidden transform group-hover:scale-105 transition-transform">
                            <img src={logo} alt="AgroTech AI Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="tracking-wide text-white font-extrabold uppercase text-lg hidden sm:block">AGROTECH AI</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        <Link
                            to="/home"
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/home') ? 'bg-green-700 text-white' : 'hover:bg-green-700/50 text-green-50'}`}
                        >
                            Home
                        </Link>

                        {/* Features Dropdown */}
                        <div className="relative" ref={featuresRef}>
                            <button
                                onClick={() => setShowFeatures(!showFeatures)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showFeatures ? 'bg-green-700 text-white' : 'hover:bg-green-700/50 text-green-50'}`}
                            >
                                Features <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFeatures ? 'rotate-180' : ''}`} />
                            </button>

                            {showFeatures && (
                                <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-[#1B5E20] border border-green-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-2">
                                        <p className="px-4 py-2 text-[10px] uppercase font-bold text-green-400 tracking-widest border-b border-green-700 mb-1">Our Solutions</p>
                                        {featureLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                to={link.to}
                                                className={`block px-4 py-3 text-sm transition-colors hover:bg-green-700 ${isActive(link.to) ? 'bg-green-700 font-bold' : 'text-green-50'}`}
                                                onClick={() => setShowFeatures(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {user && (
                            <Link
                                to="/dashboard"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-green-700 text-white' : 'hover:bg-green-700/50 text-green-50'}`}
                            >
                                Dashboard
                            </Link>
                        )}

                        <Link
                            to="/help"
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/help') ? 'bg-green-700 text-white' : 'hover:bg-green-700/50 text-green-50'}`}
                        >
                            Help
                        </Link>

                        <div className="mx-2 flex items-center gap-4">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-900/30 rounded-full border border-green-700/50">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                                <span className="text-[10px] font-bold text-green-400 uppercase tracking-tighter">AI Online</span>
                            </div>
                            <LanguageSwitcher />
                        </div>

                        <div className="pl-4 border-l border-green-600/50">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleLogout}
                                        className="text-green-200 hover:text-white p-2 rounded-full hover:bg-green-700 transition"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-white text-[#2E7D32] px-6 py-2 rounded-full font-bold hover:bg-green-50 transition-all shadow-sm active:scale-95"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-green-700 rounded-lg transition-colors">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-[#1B5E20] border-t border-green-800 animate-in slide-in-from-top duration-300">
                    <div className="px-4 py-6 space-y-4">
                        {user && (
                            <div className="bg-green-800/50 p-4 rounded-2xl flex items-center justify-between border border-green-700">
                                <Link to="/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-none">{user.name || 'Farmer'}</p>
                                        <p className="text-xs text-green-400 mt-1">{user.city || 'Farmer Dashboard'}</p>
                                    </div>
                                </Link>
                                <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"><LogOut size={20} /></button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-1">
                            <Link
                                to="/home"
                                className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>

                            {user && (
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4 opacity-70" /> Dashboard
                                </Link>
                            )}

                            <div className="pt-2 pb-1">
                                <p className="px-4 py-2 text-[10px] uppercase font-bold text-green-400 tracking-widest">Our Solutions</p>
                                {featureLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.to}
                                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <Link
                                to="/help"
                                className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <HelpCircle className="w-4 h-4 opacity-70" /> Help
                            </Link>
                        </div>

                        <div className="pt-4 border-t border-green-800">
                            <p className="text-[10px] uppercase font-bold text-green-400 mb-3 ml-4 tracking-widest">Select Language</p>
                            <div className="px-4">
                                <LanguageSwitcher />
                            </div>
                        </div>

                        {!user && (
                            <Link
                                to="/login"
                                className="block bg-white text-[#2E7D32] px-4 py-4 rounded-2xl font-bold text-center mt-6 shadow-xl active:scale-95 transition-transform"
                                onClick={() => setIsOpen(false)}
                            >
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
