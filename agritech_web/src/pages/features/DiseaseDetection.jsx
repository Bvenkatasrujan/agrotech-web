import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { diseaseService } from '../../services/diseaseService';
import { Bug, Loader, Upload, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function DiseaseDetection() {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setImageFile(file);
            setResult(null); // Clear previous results
            setError(null);
        }
    };

    const analyzeImage = async () => {
        if (!imageFile) return;
        setLoading(true);
        setError(null);

        try {
            const data = await diseaseService.detectDisease(imageFile);

            // Parse response - v3 health_assessment structure
            // data.result.is_healthy.binary
            // data.result.disease.suggestions[0]

            if (data && data.result) {
                const isHealthy = data.result.is_healthy.binary;
                const diseases = data.result.disease.suggestions;

                // Get top suggestion
                const topDisease = diseases && diseases.length > 0 ? diseases[0] : null;

                setResult({
                    isHealthy: isHealthy,
                    diseaseName: topDisease ? topDisease.name : "Unknown",
                    probability: topDisease ? (topDisease.probability * 100).toFixed(1) : 0,
                    details: topDisease ? topDisease.details : null
                });
            } else {
                throw new Error("Invalid response from server");
            }

        } catch (err) {
            console.error(err);
            setError("Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="bg-red-700 text-white py-12 text-center">
                <h1 className="text-4xl font-bold mb-2">Crop Disease Detection</h1>
                <p className="text-red-100 text-lg">Early Detection for Healthier Crops</p>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left: Upload Tool */}
                <div>
                    <div className="bg-white rounded-xl shadow-lg p-8 mt-8 flex flex-col items-center sticky top-8">
                        <h3 className="text-xl font-bold text-gray-700 mb-6">Upload Image</h3>
                        <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mb-6 relative overflow-hidden">
                            {image ? (
                                <img src={image} alt="Upload" className="h-full object-contain" />
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center hover:bg-gray-100 transition">
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                    <span className="text-gray-500">Click to upload leaf image</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>

                        <div className="w-full flex gap-4">
                            <button
                                onClick={() => { setImage(null); setImageFile(null); setResult(null); setError(null); }}
                                disabled={!image}
                                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Clear
                            </button>
                            <button
                                onClick={analyzeImage}
                                disabled={loading || !image}
                                className="flex-[2] bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" /> : <Bug />}
                                {loading ? 'Scanning...' : 'Detect Disease'}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                                <AlertTriangle size={20} />
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="mt-8 w-full p-6 bg-white rounded-xl shadow-md border border-gray-100 animate-fade-in">
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${result.isHealthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {result.isHealthy ? 'Healthy Plant' : 'Disease Detected'}
                                </div>

                                {!result.isHealthy && (
                                    <>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{result.diseaseName}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-500 rounded-full"
                                                    style={{ width: `${result.probability}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">{result.probability}%</span>
                                        </div>

                                        <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-red-800 text-sm">
                                            <strong>Note:</strong> This is an AI-generated diagnosis. Please consult an agricultural expert for confirmation and treatment planning.
                                        </div>
                                    </>
                                )}

                                {result.isHealthy && (
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-green-800 text-sm">
                                        Your plant appears to be healthy! Keep up the good work with regular monitoring and care.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Info Content */}
                <div className="space-y-12">
                    <section className="bg-white p-8 rounded-xl shadow-md border-l-4 border-red-500">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Crop Disease Detection Model</h2>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            {/* Use a placeholder if local image is missing, or keep the original src if valid */}
                            <img src="https://images.unsplash.com/photo-1518133524584-39908354c25f?auto=format&fit=crop&q=80&w=400" alt="Disease Detection" className="w-32 h-32 object-cover rounded-lg shadow-sm" />
                            <div>
                                <p className="text-gray-600 leading-relaxed">
                                    The Crop Disease Detection System uses image processing and artificial intelligence to identify plant diseases at an early stage.
                                    By analyzing images of crop leaves, stems, or fruits, the system detects visible disease symptoms such as spots, discoloration, and texture changes.
                                    Early identification helps farmers take timely corrective measures, preventing large-scale crop losses and improving overall yield.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">🤔 How it Works!</h2>
                        <div className="bg-red-50 p-6 rounded-xl space-y-4">
                            <div className="flex items-center gap-3"><span className="text-2xl">📸</span><span className="text-gray-700 font-medium">Capture or upload an image of the affected crop part.</span></div>
                            <div className="flex items-center gap-3"><span className="text-2xl">🌍</span><span className="text-gray-700 font-medium">Analyze visual features such as color, texture, and patterns.</span></div>
                            <div className="flex items-center gap-3"><span className="text-2xl">📊</span><span className="text-gray-700 font-medium">Identify the disease using trained AI models.</span></div>
                            <div className="flex items-center gap-3"><span className="text-2xl">🌾</span><span className="text-gray-700 font-medium">Provide disease name and treatment recommendations.</span></div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
