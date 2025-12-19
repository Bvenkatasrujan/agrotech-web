import { Link, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, User, LogOut, Sprout, ChevronLeft } from 'lucide-react';
import { dataService } from '../services/dataService';

export default function SideMenu({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        dataService.logout();
        window.location.href = '/login';
    };

    return (
        <div className="w-64 bg-agri-green h-screen flex flex-col text-white fixed left-0 top-0">
            <div className="p-6 flex items-center gap-3 border-b border-green-700">
                <Link to="/" className="p-1 hover:bg-green-700 rounded-full transition" title="Back to Home">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <Sprout className="w-8 h-8" />
                <span className="font-bold text-xl">Agritech AI</span>
            </div>

            <div className="p-6 border-b border-green-700 bg-green-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white text-agri-green flex items-center justify-center font-bold text-xl">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-green-200">{user?.preferredMandi}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <NavItem to="/dashboard" icon={<Home />} label="Dashboard" active />
                <NavItem to="#" icon={<TrendingUp />} label="Mandi Trends" />
                <NavItem to="#" icon={<User />} label="Profile" />
            </nav>

            <div className="p-4 border-t border-green-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-100 hover:text-white hover:bg-red-600/20 w-full p-3 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

function NavItem({ to, icon, label, active }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-green-100'}`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
