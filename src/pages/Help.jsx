import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Bot, BookOpen, Send, Mic, Volume2, ChevronRight, Sprout, Droplets, Bug, Thermometer } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function Help() {
    const [view, setView] = useState('selection'); // 'selection', 'ai', 'practices'
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! I am your AI Agriculture Assistant. How can I help you today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSendMessage = async (text = inputText) => {
        if (!text.trim()) return;

        const newMessages = [...messages, { role: 'user', text }];
        setMessages(newMessages);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await geminiService.getPrediction(text);
            setMessages([...newMessages, { role: 'ai', text: response }]);
        } catch (error) {
            console.error("DEBUG - Full Chat Error Object:", error);
            const errorMsg = error.message || "I'm sorry, I'm having trouble connecting right now.";
            setMessages([...newMessages, { role: 'ai', text: errorMsg }]);
        } finally {
            setIsTyping(false);
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
            handleSendMessage(transcript);
        };

        recognition.start();
    };

    const speakText = (text) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />

            {/* Header */}
            <div className="bg-[#2E7D32] text-white py-16 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10"><Sprout size={100} /></div>
                    <div className="absolute bottom-10 right-10"><Droplets size={100} /></div>
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold mb-4 tracking-tight">How can we help you?</h1>
                    <p className="text-green-100 text-xl max-w-2xl mx-auto px-4 font-medium">
                        Explore our AI assistant for instant answers or browse through sustainable farming best practices.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12">
                {view === 'selection' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <button
                            onClick={() => setView('ai')}
                            className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-500 flex flex-col items-center text-center transform hover:-translate-y-2"
                        >
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Bot size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">AI Assistance</h2>
                            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                                Get instant expert advice on crops, soil, pests, and more using our advanced AI chatbot.
                            </p>
                            <div className="flex items-center text-green-600 font-bold group-hover:gap-2 transition-all">
                                Open Chat <ChevronRight size={20} />
                            </div>
                        </button>

                        <button
                            onClick={() => setView('practices')}
                            className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-500 flex flex-col items-center text-center transform hover:-translate-y-2"
                        >
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Best Practices</h2>
                            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                                Detailed guides on sustainable farming techniques, water management, and pest control.
                            </p>
                            <div className="flex items-center text-green-600 font-bold group-hover:gap-2 transition-all">
                                View Guides <ChevronRight size={20} />
                            </div>
                        </button>
                    </div>
                )}

                {view === 'ai' && (
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => setView('selection')}
                            className="mb-6 flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition"
                        >
                            <ChevronRight className="rotate-180" size={20} /> Back to Selection
                        </button>

                        <div className="bg-[#E8F5E9] rounded-3xl shadow-2xl flex flex-col h-[650px] border border-green-200 overflow-hidden">
                            {/* Chat Header */}
                            <div className="bg-white p-5 border-b border-green-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white ring-4 ring-green-100">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">AgriTech AI Assistant</h3>
                                    <p className="text-xs text-green-600 font-medium">Online • Expert Knowledge Hub</p>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group ${msg.role === 'user'
                                            ? 'bg-green-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none border border-green-100'
                                            }`}>
                                            <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-green'}`}>
                                                <ReactMarkdown components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                                                    li: ({ children }) => <li className="text-sm">{children}</li>
                                                }}>
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                            {msg.role === 'ai' && (
                                                <button
                                                    onClick={() => speakText(msg.text)}
                                                    className={`mt-4 flex items-center gap-1.5 text-xs font-bold border px-3 py-1.5 rounded-full transition-all shadow-sm ${isSpeaking
                                                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700'
                                                        : 'bg-green-50/50 border-green-200 text-green-600 hover:bg-green-100 hover:text-green-700'
                                                        }`}
                                                >
                                                    {isSpeaking ? (
                                                        <>
                                                            <Volume2 size={14} className="animate-pulse" /> Stop Reading
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Volume2 size={14} /> Read Answer
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-400 rounded-2xl p-4 rounded-bl-none border border-green-100 flex gap-1">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-5 bg-white border-t border-green-100">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2 pl-4 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask about crops, soil, weather..."
                                        className="flex-1 bg-transparent outline-none text-gray-700 py-2"
                                    />
                                    <button
                                        onClick={startListening}
                                        className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:bg-green-50 hover:text-green-600'}`}
                                        title="Voice Input"
                                    >
                                        <Mic size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage()}
                                        className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition shadow-md shadow-green-200 active:scale-95"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'practices' && (
                    <BestPractices onBack={() => setView('selection')} />
                )}
            </div>
        </div>
    );
}

function BestPractices({ onBack }) {
    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <button
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-green-800 font-bold hover:text-green-900 transition bg-white px-4 py-2 rounded-full shadow-md"
            >
                <ChevronRight className="rotate-180" size={20} /> Back to Selection
            </button>

            <div className="bg-[#E8F5E9] rounded-[40px] p-8 md:p-12 shadow-2xl border border-white">
                <header className="text-center mb-16 relative">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <Sprout className="text-green-600" size={40} />
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] tracking-tight">Best Practices in Sustainable Farming</h2>
                        <Sprout className="text-green-600" size={40} />
                    </div>
                    <p className="text-green-800 text-lg max-w-4xl mx-auto leading-relaxed font-medium">
                        Sustainable agriculture practices are essential for ensuring long-term productivity while conserving natural resources.
                        These best practices for cropping, fertilizing, pest control, and water management will help farmers achieve optimal yields while protecting the environment.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Cropping */}
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-green-50 group hover:shadow-2xl transition-shadow">
                        <div className="h-64 relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"
                                alt="Best Practices for Cropping"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                        <div className="p-10">
                            <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Best Practices for Cropping
                            </h3>
                            <p className="text-gray-700 mb-8 leading-relaxed">
                                Proper cropping techniques ensure sustainable and productive farming. Implement diverse strategies like crop rotation, intercropping, and selecting the right crop varieties to maximize yield and protect the soil.
                            </p>
                            <div className="space-y-6">
                                <PracticeItem
                                    num="1"
                                    title="Crop Rotation"
                                    desc="Rotate crops to break pest and disease cycles, improve soil structure, and boost nutrient content. For example, rotating legumes with cereals can replenish nitrogen in the soil."
                                />
                                <PracticeItem
                                    num="2"
                                    title="Intercropping"
                                    desc="Grow multiple crops in proximity to optimize space, reduce weeds, and create a habitat for beneficial organisms. Intercropping corn with beans is a common example."
                                />
                                <PracticeItem
                                    num="3"
                                    title="Cover Cropping"
                                    desc="Plant cover crops, such as clover or rye, during off-seasons to improve soil health, prevent erosion, and suppress weeds, enhancing the next season's productivity."
                                />
                                <PracticeItem
                                    num="4"
                                    title="Selecting Crop Varieties"
                                    desc="Choose disease-resistant and climate-appropriate varieties to minimize losses. Consider local climate, soil conditions, and pest threats when selecting crops."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fertilizing */}
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-green-50 group hover:shadow-2xl transition-shadow">
                        <div className="h-64 relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1000"
                                alt="Fertilizing Techniques"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                        <div className="p-10">
                            <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Fertilizing Techniques
                            </h3>
                            <p className="text-gray-700 mb-8 leading-relaxed">
                                Efficient fertilization strategies can significantly impact crop health. Understand your soil needs through testing, and use a balanced mix of organic and inorganic fertilizers to provide optimal nutrients without harming the environment.
                            </p>
                            <div className="space-y-6">
                                <PracticeItem
                                    num="1"
                                    title="Soil Testing and Analysis"
                                    desc="Conduct regular soil tests to determine nutrient deficiencies. Tailor fertilizer application based on the results, ensuring that crops receive the right amounts of nitrogen, phosphorus, and potassium."
                                />
                                <PracticeItem
                                    num="2"
                                    title="Organic vs. Inorganic Fertilizers"
                                    desc="Use a balanced mix of organic (e.g., compost, manure) and inorganic fertilizers to maintain soil health and productivity. Organic fertilizers improve soil structure, while inorganic ones offer rapid nutrient delivery."
                                />
                                <PracticeItem
                                    num="3"
                                    title="Micro and Macro Nutrients"
                                    desc="In addition to nitrogen (N), phosphorus (P), and potassium (K), crops need micro-nutrients such as zinc, copper, and manganese. Ensure micronutrient deficiencies are addressed through targeted fertilizer applications."
                                />
                                <PracticeItem
                                    num="4"
                                    title="Application Techniques"
                                    desc="Apply fertilizers using efficient techniques like drip fertilization or band placement to reduce waste and ensure even nutrient distribution. Avoid over-application, which can lead to runoff and environmental pollution."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pest Control */}
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-green-50 group hover:shadow-2xl transition-shadow">
                        <div className="h-64 relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=1000"
                                alt="Pest Control Strategies"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                        <div className="p-10">
                            <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Pest Control Strategies
                            </h3>
                            <p className="text-gray-700 mb-8 leading-relaxed">
                                Effective pest control strategies are essential for maintaining healthy crops. Utilize integrated pest management (IPM), natural predators, and environmentally friendly pest control methods to keep pest populations in check.
                            </p>
                            <div className="space-y-6">
                                <PracticeItem
                                    num="1"
                                    title="Integrated Pest Management (IPM)"
                                    desc="IPM combines biological, cultural, physical, and chemical tools to manage pests sustainably. This method reduces reliance on pesticides, lowering the risk of resistance and environmental damage."
                                />
                                <PracticeItem
                                    num="2"
                                    title="Biological Control"
                                    desc="Encourage natural predators such as ladybugs, lacewings, and parasitic wasps to control harmful pest populations. Use habitat enhancement or companion planting to attract these beneficial insects."
                                />
                                <PracticeItem
                                    num="3"
                                    title="Cultural Practices"
                                    desc="Alter farming practices, such as timing of planting, crop selection, and sanitation, to reduce pest infestations. For example, early planting can sometimes help avoid peak pest populations."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Water Management */}
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-green-50 group hover:shadow-2xl transition-shadow">
                        <div className="h-64 relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=1000"
                                alt="Water Management"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                        <div className="p-10">
                            <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Water Management
                            </h3>
                            <p className="text-gray-700 mb-8 leading-relaxed">
                                Water is a critical resource in farming. Implement smart irrigation systems, rainwater harvesting, and moisture management techniques to ensure crops get adequate water without waste.
                            </p>
                            <div className="space-y-6">
                                <PracticeItem
                                    num="1"
                                    title="Smart Irrigation Systems"
                                    desc="Use drip or sprinkler irrigation systems controlled by soil moisture sensors and weather forecasts to provide precise amounts of water directly to plant roots, reducing water waste and enhancing crop yield."
                                />
                                <PracticeItem
                                    num="2"
                                    title="Rainwater Harvesting"
                                    desc="Install rainwater harvesting systems to capture and store rainwater for later use in irrigation. This reduces dependence on groundwater and conserves valuable water resources."
                                />
                                <PracticeItem
                                    num="3"
                                    title="Soil Moisture Monitoring"
                                    desc="Use soil moisture sensors to monitor water levels and ensure crops receive sufficient hydration without over-watering. This improves water-use efficiency and minimizes runoff."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PracticeItem({ num, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                {num}
            </div>
            <div>
                <h4 className="font-bold text-green-800 mb-1">{title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
