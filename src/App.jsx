import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';

import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import LandingPage from './pages/LandingPage';
import CropRecommendation from './pages/features/CropRecommendation';
import FertilizerRecommendation from './pages/features/FertilizerRecommendation';
import SoilQuality from './pages/features/SoilQuality';
import PricePrediction from './pages/features/PricePrediction';
import DiseaseDetection from './pages/features/DiseaseDetection';
import Forecast from './pages/features/Forecast';
import AboutUs from './pages/AboutUs';
import WhyAi from './pages/WhyAi';
import Help from './pages/Help';


import { useState, useEffect } from 'react';

import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('user_session') !== null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Sync with localStorage if needed by other components
        localStorage.setItem('user_session', JSON.stringify(user));
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('user_session');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>

      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
          <Route
            path="/home"
            element={isAuthenticated ? <LandingPage /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />


          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />

          {/* Feature Pages (Protected) */}
          <Route path="/crop-recommendation" element={isAuthenticated ? <CropRecommendation /> : <Navigate to="/login" />} />
          <Route path="/fertilizer-recommendation" element={isAuthenticated ? <FertilizerRecommendation /> : <Navigate to="/login" />} />
          <Route path="/soil-quality" element={isAuthenticated ? <SoilQuality /> : <Navigate to="/login" />} />
          <Route path="/price-prediction" element={isAuthenticated ? <PricePrediction /> : <Navigate to="/login" />} />
          <Route path="/forecast" element={isAuthenticated ? <Forecast /> : <Navigate to="/login" />} />
          <Route path="/disease-detection" element={isAuthenticated ? <DiseaseDetection /> : <Navigate to="/login" />} />
          <Route path="/about" element={isAuthenticated ? <AboutUs /> : <Navigate to="/login" />} />
          <Route path="/why-ai" element={isAuthenticated ? <WhyAi /> : <Navigate to="/login" />} />
          <Route path="/help" element={isAuthenticated ? <Help /> : <Navigate to="/login" />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
