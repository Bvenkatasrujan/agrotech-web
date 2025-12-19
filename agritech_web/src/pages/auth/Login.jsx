import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { Sprout } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ name: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = dataService.loginUser(formData.name, formData.password);
        if (result.success) {
            // Force reload to update auth state context if needed, or just navigate
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-agri-light flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-agri-green p-3 rounded-full mb-3">
                        <Sprout className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Agritech AI</h1>
                    <p className="text-gray-500">Welcome back, Farmer</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agri-green focus:border-agri-green"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agri-green focus:border-agri-green"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-agri-green text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        New here?{' '}
                        <Link to="/register" className="text-agri-green font-semibold hover:underline">
                            Register Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
