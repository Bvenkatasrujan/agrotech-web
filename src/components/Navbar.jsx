import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, User, LogOut, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = dataService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        dataService.logout();
        setUser(null);
        navigate('/');
    };

    const navLinks = [
        { name: 'Crop Recommendation', to: '/crop-recommendation' },
        { name: 'Fertilizer Recommendation', to: '/fertilizer-recommendation' },
        { name: 'Soil Quality', to: '/soil-quality' },
        { name: 'Price Prediction', to: '/price-prediction' },
        { name: 'Forecast', to: '/forecast' },
        { name: 'Disease', to: '/disease-detection' },
    ];

    return (
        <nav className="bg-[#2E7D32] text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-green-200 transition">
                        <Sprout className="w-7 h-7" />
                        <span className="tracking-wide">AgroTech AI</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="flex items-center bg-green-800/50 rounded-lg px-2 py-1 ml-2 border border-green-600/30">
                            <span className="text-[10px] uppercase font-bold text-green-200 mr-2 hidden lg:block">Lang:</span>
                            <div id="google_translate_element"></div>
                        </div>

                        <div className="ml-4 pl-4 border-l border-green-600">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/dashboard" className="flex items-center gap-2 hover:bg-green-700 px-3 py-2 rounded-lg transition">
                                        <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center border border-green-400">
                                            <User size={18} />
                                        </div>
                                        <div className="text-left leading-none">
                                            <span className="block text-xs text-green-200">Hello,</span>
                                            <span className="block text-sm font-bold">{user.name.split(' ')[0]}</span>
                                        </div>
                                    </Link>
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
                                    className="bg-white text-agri-green px-6 py-2 rounded-full font-bold hover:bg-green-50 transition-colors shadow-sm"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-green-700 rounded-lg">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-[#1b5e20] pb-4 px-4 shadow-inner">
                    <div className="flex flex-col space-y-2 mt-2">
                        {user && (
                            <div className="bg-green-800 p-4 rounded-lg mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{user.name}</p>
                                        <p className="text-xs text-green-300">{user.city}</p>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="text-red-300 hover:text-red-200"><LogOut /></button>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="block py-3 px-4 rounded-lg text-sm hover:bg-green-700 font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {!user && (
                            <Link
                                to="/login"
                                className="block bg-white text-agri-green px-4 py-3 rounded-xl font-bold text-center mt-4 shadow-lg"
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
