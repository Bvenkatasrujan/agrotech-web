import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
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


function App() {
  const isAuthenticated = localStorage.getItem('user_session') !== null;

  return (
    <>

      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* Feature Pages (Accessible to all for prototype, or protect if needed) */}
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/fertilizer-recommendation" element={<FertilizerRecommendation />} />
          <Route path="/soil-quality" element={<SoilQuality />} />
          <Route path="/price-prediction" element={<PricePrediction />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/why-ai" element={<WhyAi />} />
          <Route path="/help" element={<Help />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
