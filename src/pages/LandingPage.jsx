import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Sprout, CloudRain, TrendingUp, FlaskConical, Bug, Leaf, Github, Twitter, Linkedin, Smartphone, BarChart3, Monitor, LayoutGrid, Package, Star, ArrowRight, X, Droplets, RotateCw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import heroFarmer from '../assets/hero_farmer.png';
import cropRecImg from '../assets/products/crop_recommendation.png';
import cropRotImg from '../assets/products/crop_rotation.png';
import pricePredImg from '../assets/products/price_prediction.png';
import fertPredImg from '../assets/products/fertilizer_prediction.png';
import soilQualImg from '../assets/products/soil_quality.png';
import irrSysImg from '../assets/products/irrigation_system.png';
import { useState, useRef, useEffect } from 'react';

export default function LandingPage() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productsRef = useRef(null);
    const navigate = useNavigate();

    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const products = [
        {
            id: 1,
            title: "Crop Recommendation",
            desc: "Find the best crops based on soil and environmental data.",
            details: [
                "Nitrogen, Phosphorus, Potassium (NPK) levels.",
                "Soil pH and moisture levels.",
                "Temperature and rainfall data.",
                "Crop adaptability and resistance to local pests."
            ],
            icon: <Sprout className="w-12 h-12 text-white" />,
            color: "bg-green-600",
            to: "/crop-recommendation",
            image: cropRecImg
        },
        {
            id: 2,
            title: "Crop Rotation Recommendation",
            desc: "Learn about optimal crop rotation to improve soil quality.",
            details: [
                "Preserve soil nutrients and fertility.",
                "Disrupt pest and disease cycles.",
                "Improve soil structure and reduce erosion.",
                "Maximize crop yield over seasons."
            ],
            icon: <RotateCw className="w-12 h-12 text-white" />,
            color: "bg-emerald-600",
            to: "/crop-recommendation", // Assuming part of crop recommendation or new structure
            image: cropRotImg
        },
        {
            id: 3,
            title: "Crop Price Prediction",
            desc: "Predict future prices for crops based on market trends.",
            details: [
                "Historical price data analysis.",
                "Market demand and supply trends.",
                "Weather impact on crop availability.",
                "Regional price variations."
            ],
            icon: <TrendingUp className="w-12 h-12 text-white" />,
            color: "bg-green-700",
            to: "/price-prediction",
            image: pricePredImg
        },
        {
            id: 4,
            title: "Fertilizer Prediction",
            desc: "Get recommendations for the best fertilizers for your crops.",
            details: [
                "Soil nutrient deficiency analysis.",
                "Crop-specific nutrient requirements.",
                "Recommended fertilizer types and quantity.",
                "Sustainability and soil health focus."
            ],
            icon: <FlaskConical className="w-12 h-12 text-white" />,
            color: "bg-teal-600",
            to: "/fertilizer-recommendation",
            image: fertPredImg
        },
        {
            id: 5,
            title: "Soil Quality Prediction",
            desc: "Analyze the quality of your soil for better yields.",
            details: [
                "Soil texture and organic matter content.",
                "pH levels and salinity.",
                "Microbial activity indicators.",
                "Recommendations for soil amendments."
            ],
            icon: <Leaf className="w-12 h-12 text-white" />,
            color: "bg-lime-600",
            to: "/soil-quality",
            image: soilQualImg
        },
        {
            id: 6,
            title: "Irrigation System Prediction",
            desc: "Determine the most effective irrigation system for your farm.",
            details: [
                "Crop water requirements.",
                "Soil water holding capacity.",
                "Local water availability and climate.",
                "Efficiency comparison of drip vs. sprinkler systems."
            ],
            icon: <Droplets className="w-12 h-12 text-white" />,
            color: "bg-cyan-600",
            to: "/forecast", // Closest match
            image: irrSysImg
        }
    ];

    const handleTryNow = () => {
        if (selectedProduct) {
            navigate(selectedProduct.to);
        }
    };

    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const nextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(nextTestimonial, 5000);
        return () => clearInterval(interval);
    }, []);

    const [activeFAQ, setActiveFAQ] = useState(null);
    const [showAllFAQs, setShowAllFAQs] = useState(false);

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    const faqData = [
        {
            question: "What is AgroTech AI?",
            answer: "AgroTech AI is a platform that integrates advanced technologies like AI and machine learning into agriculture to help farmers optimize their crop yields, manage resources, and make data-driven decisions."
        },
        {
            question: "How can drones be used in farming?",
            answer: "Drones are used for real-time crop monitoring, precision spraying of fertilizers and pesticides, and assessing crop health through aerial imagery, significantly reducing labor and improving efficiency."
        },
        {
            question: "What kind of data is required for soil analysis?",
            answer: "We analyze parameters such as Nitrogen (N), Phosphorus (P), Potassium (K) levels, pH value, moisture content, and temperature to provide accurate soil health reports and recommendations."
        },
        {
            question: "Can AgroTech AI help with crop recommendation?",
            answer: "Yes, our AI algorithms analyze your soil data, local climate conditions, and historical trends to recommend the most suitable crops that will maximize your yield and profitability."
        },
        {
            question: "How does the equipment rental platform work?",
            answer: "Our rental platform connects farmers with equipment providers. You can browse available machinery like tractors and harvesters, check their availability, and rent them on an hourly or daily basis directly through the app."
        },
        {
            question: "Is there any training for using the technology?",
            answer: "Yes, we provide comprehensive guides, video tutorials, and on-ground workshops to help farmers understand and effectively use our AI tools and dashboard Features."
        },
        {
            question: "Can I access weather forecasts on AgroTech AI?",
            answer: "Absolutely. We provide real-time hyper-local weather updates and long-term forecasts to help you plan your farming activities like sowing, irrigation, and harvesting."
        },
        {
            question: "How is data security handled on AgroTech AI?",
            answer: "We prioritize your privacy. All your farm data is encrypted and stored securely. We do not share your personal information with third parties without your explicit consent."
        },
        {
            question: "What crops can I grow based on soil data?",
            answer: "Based on your soil's nutrient profile and local climate, our Recommendation Engine suggests a list of optimal crops (e.g., Rice, Wheat, Maize) that are best suited for your specific conditions."
        },
        {
            question: "How do I get started with using AgroTech AI?",
            answer: "Simply sign up on our website, create a profile, and start by inputting your farm data or soil test results. Our system will immediately generate insights and recommendations for you."
        }
    ];
    const testimonials = [
        {
            id: 1,
            name: "Arjun Sharma",
            role: "Data Analyst",
            location: "Bengaluru, India",
            rating: 5,
            review: "The AgroTech AI platform has completely transformed the way I approach agricultural data analysis. The AI-driven insights are accurate, user-friendly, and truly empowering for farmers. I’m thrilled to use this tool that’s making a real difference in sustainable agriculture!",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: 2,
            name: "Priya Desai",
            role: "Agronomist",
            location: "Mumbai, India",
            rating: 4,
            review: "Working with AgroTech AI has opened new possibilities for crop management. The platform’s predictive models help me recommend tailored solutions for farmers, which they find incredibly helpful. The entire experience has made my job easier and much more impactful!",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: 3,
            name: "Rohan Patel",
            role: "Farm Manager",
            location: "Ahmedabad, India",
            rating: 5,
            review: "AgroTech AI’s pest control recommendations have been a game-changer for our farm. We can now manage pests more effectively and sustainably. The platform’s easy-to-use tools are perfect for any farm size. It’s a must-have for anyone in agriculture!",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: 4,
            name: "Neha Iyer",
            role: "Environmental Scientist",
            location: "Chennai, India",
            rating: 4,
            review: "AgroTech AI is an invaluable resource for managing soil health. The insights on nutrient levels and soil quality have helped me guide farmers toward healthier crops and improved yields. It’s a must-use tool for anyone serious about sustainable farming!",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: 5,
            name: "Rahul Singh",
            role: "Agricultural Consultant",
            location: "Hyderabad, India",
            rating: 5,
            review: "The AgroTech AI platform has been an amazing resource for understanding climate impact on crops. I can now make informed decisions based on weather predictions and irrigation insights a noticeable difference in crop health and yield.",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: 6,
            name: "Kavita Nair",
            role: "Sustainable Farming Specialist",
            location: "Pune, India",
            rating: 5,
            review: "AgroTech AI has been an outstanding tool for improving our pest control strategies. With data-backed recommendations, we’ve reduced pesticide use and achieved better crop health. The platform is incredibly insightful!",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150"
        }
    ];



    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-green-300 rounded-full blur-3xl opacity-30"></div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-[#1B5E20] mb-6 leading-tight">
                    Welcome to AgroTech AI <br />
                    <span className="text-[#2E7D32]">Revolutionizing Agriculture</span>
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                    Explore AI-powered solutions tailored to enhance farming practices.
                    From crop prediction to soil analysis, discover tools designed to
                    optimize agricultural productivity.
                </p>

                <button
                    onClick={scrollToProducts}
                    className="bg-[#2E7D32] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#1B5E20] transition-transform hover:scale-105 shadow-lg"
                >
                    Explore Now
                </button>

                <div className="mt-16 relative z-10">
                    <img
                        src={heroFarmer}
                        alt="Modern Agriculture"
                        className="w-full max-w-4xl mx-auto drop-shadow-2xl object-contain"
                    />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-green-50/50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works ?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-green-100/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition text-center">
                            <h3 className="text-xl font-bold text-green-800 mb-2">Step 1: Data Collection</h3>
                            <p className="text-gray-600 font-medium">We gather real-time data on soil conditions, weather, and crop health using cutting-edge sensors and AI.</p>
                        </div>
                        <div className="bg-green-100/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition text-center">
                            <h3 className="text-xl font-bold text-green-800 mb-2">Step 2: Analysis</h3>
                            <p className="text-gray-600 font-medium">Our AI models analyze the data to provide actionable insights on crop growth and health.</p>
                        </div>
                        <div className="bg-green-100/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition text-center">
                            <h3 className="text-xl font-bold text-green-800 mb-2">Step 3: Optimization</h3>
                            <p className="text-gray-600 font-medium">Based on the analysis, we recommend the best practices to improve crop yield and sustainability.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-4 flex items-center justify-center gap-2">
                            What We Offer to Farmers <Package className="text-yellow-600 fill-yellow-100" />
                        </h2>
                        <p className="text-green-600 max-w-2xl mx-auto font-medium">
                            Explore our cutting-edge AI-driven solutions crafted to transform farming practices for the better.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Responsive Design - Green */}
                        <div className="bg-green-500 text-white p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 shadow-lg">
                            <div className="mb-6">
                                <Smartphone size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Responsive Design</h3>
                            <p className="text-green-50 text-sm leading-relaxed">
                                Our platform is designed to be fully responsive, ensuring a seamless experience on any device. Farmers can access our tools and resources on-the-go, whether on a smartphone, tablet, or desktop.
                            </p>
                        </div>

                        {/* Comprehensive Models - Blue */}
                        <div className="bg-blue-500 text-white p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 shadow-lg">
                            <div className="mb-6">
                                <BarChart3 size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Comprehensive Models</h3>
                            <p className="text-blue-50 text-sm leading-relaxed">
                                AgroTech AI platform offers various machine learning models for accurate predictions. These models help farmers to make informed decisions about crop management, soil health, and pest control.
                            </p>
                        </div>

                        {/* User-Friendly Interface - Purple */}
                        <div className="bg-purple-500 text-white p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 shadow-lg">
                            <div className="mb-6">
                                <Monitor size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">User-Friendly Interface</h3>
                            <p className="text-purple-50 text-sm leading-relaxed">
                                Our intuitive interface allows farmers to easily navigate throughout the platform and utilize the AI tools to solve their problems. The platform is designed to be accessible even for users with limited technical knowledge.
                            </p>
                        </div>

                        {/* Customizable Solutions - Red */}
                        <div className="bg-red-500 text-white p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 shadow-lg">
                            <div className="mb-6">
                                <LayoutGrid size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Customizable Solutions</h3>
                            <p className="text-red-50 text-sm leading-relaxed">
                                AgroTech AI provides customizable solutions tailored to the unique needs of each farm. Farmers can adjust parameters to get the most accurate and relevant predictions by using AI tools for their specific conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About AgroTech AI Section */}
            <section className="py-20 px-4 bg-green-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="bg-white p-4 rounded-3xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img
                            src={heroFarmer}
                            alt="AgroTech AI Mission"
                            className="bg-green-100 rounded-2xl w-full h-[400px] object-contain"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Sprout className="text-green-600 w-10 h-10" />
                            <h2 className="text-4xl font-extrabold text-green-800">About AgroTech AI</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-6 rounded-2xl text-white shadow-lg">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Star className="fill-yellow-300 text-yellow-300" /> Our Mission</h3>
                                <p className="text-green-50 text-sm leading-relaxed">
                                    We aim to empower farmers with innovative solutions that harness the power of AI, enabling them to achieve better yields, reduce waste, and promote sustainable farming practices.
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-2xl text-white shadow-lg">
                                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">🤔 How it Works!</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="bg-blue-500 p-1 rounded text-white mt-1">
                                            <span className="text-xs font-bold">✓</span>
                                        </div>
                                        <span className="text-sm font-medium">Access various machine learning models for crop prediction and soil analysis.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="bg-blue-500 p-1 rounded text-white mt-1">
                                            <span className="text-xs font-bold">✓</span>
                                        </div>
                                        <span className="text-sm font-medium">Use the platform to make informed decisions on crop management and pest control.</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={scrollToProducts}
                                className="bg-[#1B5E20] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-green-800 transition-colors w-48"
                            >
                                Explore Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Prediction Models Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-4 flex items-center justify-center gap-3">
                            🚀 Our Prediction Models 🚀
                        </h2>
                        <p className="text-green-600 font-medium">
                            Enhancing Accuracy with Data-Driven Insights
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-50 hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-bold text-[#1B5E20] mb-4">Accurate Predictions</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Utilize our state-of-the-art prediction models to get accurate insights on crop yield, soil health, and pest outbreaks. Make data-driven decisions to enhance your farming practices.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-50 hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-bold text-[#1B5E20] mb-4">Customizable Reports</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Generate and customize detailed reports based on your specific requirements. Share these reports with stakeholders to showcase farm performance and improvements.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-green-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                            <img
                                src={heroFarmer}
                                alt="Prediction Models Illustration"
                                className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why AI in Agriculture Section */}
            <section className="py-20 px-4 bg-green-50">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B5E20] flex items-center justify-center gap-2">
                        Why AI in Agriculture?
                    </h2>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    {/* Left Image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={heroFarmer}
                            alt="AI in Agriculture"
                            className="rounded-3xl shadow-2xl w-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Right Content */}
                    <div className="w-full md:w-1/2">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 relative overflow-hidden">
                            <div className="absolute top-4 right-4 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                            <h3 className="text-2xl font-bold text-[#1B5E20] mb-6">AI Solutions</h3>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl font-bold">•</span>
                                    <span className="text-green-700 font-medium">Predicting the best crop based on soil and climate data</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl font-bold">•</span>
                                    <span className="text-green-700 font-medium">Real-time crop monitoring using AI-powered sensors and drones</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl font-bold">•</span>
                                    <span className="text-green-700 font-medium">Precision farming for optimizing irrigation and pesticide usage</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl font-bold">•</span>
                                    <span className="text-green-700 font-medium">Detailed soil health analysis to enhance crop growth and productivity</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl font-bold">•</span>
                                    <span className="text-green-700 font-medium">Accurate weather forecasting to plan planting, irrigation, and harvesting</span>
                                </li>
                            </ul>

                            <Link
                                to="/why-ai"
                                className="inline-block bg-[#1B5E20] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition-colors"
                            >
                                Know More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Our Users Say Section */}
            <section className="py-20 px-4 bg-green-50 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-4 flex items-center justify-center gap-3">
                        <Star className="fill-yellow-400 text-yellow-400 w-8 h-8" />
                        What Our Users Say
                        <Star className="fill-yellow-400 text-yellow-400 w-8 h-8" />
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="flex justify-center items-center relative h-[400px]">
                        {testimonials.map((testimonial, index) => {
                            const isActive = index === activeTestimonial;
                            const isPrev = index === (activeTestimonial - 1 + testimonials.length) % testimonials.length;
                            const isNext = index === (activeTestimonial + 1) % testimonials.length;

                            let positionClass = "opacity-0 scale-75 z-0 translate-x-0 hidden";
                            if (isActive) positionClass = "opacity-100 scale-100 z-20 translate-x-0";
                            else if (isPrev) positionClass = "opacity-60 scale-90 z-10 -translate-x-full blur-[2px]";
                            else if (isNext) positionClass = "opacity-60 scale-90 z-10 translate-x-full blur-[2px]";

                            return (
                                <div
                                    key={testimonial.id}
                                    className={`absolute transition-all duration-700 ease-in-out transform w-full md:w-[500px] ${positionClass}`}
                                >
                                    <div className="bg-[#22c55e] p-8 rounded-2xl shadow-2xl text-white text-center relative mx-4">
                                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-20 h-20 rounded-lg border-4 border-white shadow-lg object-cover"
                                            />
                                        </div>
                                        <div className="mt-10">
                                            <div className="flex justify-center gap-1 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={`${i < testimonial.rating ? "fill-yellow-300 text-yellow-300" : "fill-gray-300 text-gray-300"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm md:text-base leading-relaxed mb-6 font-medium">
                                                "{testimonial.review}"
                                            </p>
                                            <h3 className="font-bold text-lg">{testimonial.name}</h3>
                                            <p className="text-green-100 text-xs uppercase tracking-wider font-semibold">{testimonial.role}</p>
                                            <p className="text-green-200 text-xs">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-12 text-[#1B5E20] hover:text-green-600 transition-colors"
                    >
                        <ChevronLeft size={48} strokeWidth={3} />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-12 text-[#1B5E20] hover:text-green-600 transition-colors"
                    >
                        <ChevronRight size={48} strokeWidth={3} />
                    </button>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? "bg-[#22c55e] scale-125" : "bg-gray-300"}`}
                            />
                        ))}
                    </div>
                </div>
            </section>



            {/* FAQ Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-12 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {faqData.slice(0, showAllFAQs ? faqData.length : 5).map((faq, index) => (
                            <div
                                key={index}
                                className="border border-green-200 rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className={`w-full text-left px-6 py-4 flex justify-between items-center transition-colors font-semibold text-lg ${activeFAQ === index ? "bg-[#22c55e] text-white" : "bg-[#22c55e] text-white hover:bg-green-600"}`}
                                >
                                    {faq.question}
                                    {activeFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    <div className="p-6 bg-white text-gray-700 leading-relaxed border-t border-green-100">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <button
                            onClick={() => setShowAllFAQs(!showAllFAQs)}
                            className="bg-[#22c55e] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                        >
                            {showAllFAQs ? "Show Less FAQs" : "Load More FAQs"}
                        </button>
                    </div>
                </div>
            </section>

            {/* Explore Our Products Section */}
            <section ref={productsRef} className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Explore Our Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 hover:-translate-y-2"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full z-20">
                                        <ArrowRight className="w-5 h-5 text-green-700" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-green-800 mb-3">{product.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{product.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1B5E20] text-white py-12">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 font-bold text-xl mb-4">
                            <Sprout />
                            <span>AgroTech AI</span>
                        </div>
                        <p className="text-green-200 text-sm">Empowering farmers with AI technology for a sustainable future.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-green-100">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Features</h4>
                        <ul className="space-y-2 text-sm text-green-100">
                            <li><a href="#" className="hover:text-white">Crop Prediction</a></li>
                            <li><a href="#" className="hover:text-white">Soil Analysis</a></li>
                            <li><a href="#" className="hover:text-white">Market Trends</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/venkata-srujan-bellamkonda-b009ba327/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-green-800 text-center text-sm text-green-300">
                    © 2025 AgroTech AI. All rights reserved.
                </div>
            </footer>

            {/* Product Modal */}
            {
                selectedProduct && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                        <div
                            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>

                            <div className="p-8">
                                <h3 className={`text-2xl font-bold mb-6 ${selectedProduct.color.replace('bg-', 'text-')}`}>
                                    {selectedProduct.title}
                                </h3>

                                <ul className="space-y-3 mb-8">
                                    {selectedProduct.details.map((detail, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-700">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                                            <span className="text-sm font-medium">{detail}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleTryNow}
                                        className="w-full bg-[#22C55E] text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-md active:scale-95 transform duration-150"
                                    >
                                        Try Now
                                    </button>
                                    <button
                                        onClick={() => setSelectedProduct(null)}
                                        className="w-full bg-[#EF4444] text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-md active:scale-95 transform duration-150"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

function FeatureCard({ icon, title, desc, to }) {
    return (
        <Link to={to} className="block group">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-green-50 h-full group-hover:-translate-y-1">
                <div className="mb-4 bg-green-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
        </Link>
    );
}
