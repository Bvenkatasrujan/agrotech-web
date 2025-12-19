import Navbar from '../components/Navbar';
import { Sprout, Brain, Leaf, CloudRain, Truck, Bot, ShieldCheck, Database, Zap, Globe, TrendingUp } from 'lucide-react';

export default function WhyAi() {
    return (
        <div className="min-h-screen bg-green-50 font-sans">
            <Navbar />

            <div className="pt-20 pb-10 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 fade-in">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-6 flex items-center justify-center gap-3">
                            <Leaf className="fill-green-600 text-green-800 animate-bounce" size={40} />
                            Why AI in Agriculture?
                            <Leaf className="fill-green-600 text-green-800 animate-bounce" size={40} />
                        </h1>
                        <p className="text-lg md:text-xl text-green-800 max-w-4xl mx-auto leading-relaxed font-medium bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                            Artificial Intelligence (AI) is revolutionizing the agricultural sector, enabling farmers and agronomists to make data-driven
                            decisions that enhance productivity and sustainability. The integration of AI technologies is transforming traditional farming
                            methods into smart farming practices, ensuring food security while minimizing environmental impact.
                        </p>
                    </div>

                    {/* Key Benefits */}
                    <section className="mb-16 bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-green-100">
                        <h2 className="text-3xl font-bold text-[#1B5E20] mb-8 border-b-2 border-green-100 pb-4">Key Benefits of AI in Agriculture</h2>
                        <ul className="space-y-6">
                            <BenefitItem
                                title="Precision Agriculture"
                                desc="AI allows farmers to monitor crop health and soil conditions with greater accuracy. By analyzing data from sensors, drones, and satellite imagery, farmers can optimize inputs like water, fertilizers, and pesticides, leading to better yields."
                            />
                            <BenefitItem
                                title="Predictive Analytics"
                                desc="Using historical data and machine learning algorithms, AI can predict crop yields, pest outbreaks, and weather patterns. This helps farmers plan their planting and harvesting schedules more effectively."
                            />
                            <BenefitItem
                                title="Automated Farming"
                                desc="AI-powered machinery, such as autonomous tractors and drones, can carry out farming tasks with minimal human intervention, saving labor costs and improving operational efficiency."
                            />
                            <BenefitItem
                                title="Data-Driven Decision Making"
                                desc="AI helps analyze vast amounts of agricultural data to identify trends and insights, allowing farmers to make informed decisions based on real-time data."
                            />
                            <BenefitItem
                                title="Sustainable Practices"
                                desc="AI promotes resource conservation by optimizing water usage and minimizing chemical inputs, contributing to environmentally friendly agricultural practices."
                            />
                        </ul>
                    </section>

                    {/* AI Applications Grid */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-[#1B5E20] mb-10 text-center">AI Applications in Agriculture</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ApplicationCard
                                title="Crop Monitoring"
                                desc="AI technologies like computer vision and machine learning can detect diseases in crops at an early stage, allowing for timely intervention."
                                image="https://images.unsplash.com/photo-1530507629858-e49769f748f9?auto=format&fit=crop&q=80&w=800"
                                icon={<Sprout className="text-green-600" />}
                            />
                            <ApplicationCard
                                title="Soil Analysis"
                                desc="AI algorithms can analyze soil health and nutrient levels, providing tailored recommendations for fertilizer application."
                                image="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800"
                                icon={<Database className="text-amber-700" />}
                            />
                            <ApplicationCard
                                title="Supply Chain Optimization"
                                desc="AI enhances the agricultural supply chain by predicting demand and managing logistics, ensuring quick and efficient product delivery."
                                image="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                                icon={<Truck className="text-blue-600" />}
                            />
                            <ApplicationCard
                                title="Weather Forecasting"
                                desc="AI models analyze historical weather data and real-time satellite imagery to provide accurate weather forecasts, helping farmers make informed decisions about planting, harvesting, and irrigation."
                                image="https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800"
                                icon={<CloudRain className="text-cyan-600" />}
                            />
                            <ApplicationCard
                                title="Smart Irrigation Systems"
                                desc="AI-powered smart irrigation systems analyze soil moisture levels, weather forecasts, and crop water requirements to optimize irrigation schedules, conserving water resources and improving crop yield."
                                image="https://images.unsplash.com/photo-1563514227147-6d2ff63448fe?auto=format&fit=crop&q=80&w=800"
                                icon={<Zap className="text-yellow-600" />}
                            />
                            <ApplicationCard
                                title="Robotics and Automation"
                                desc="Robotic systems powered by AI can perform tasks such as planting and harvesting, improving precision and reducing labor costs."
                                image="https://images.unsplash.com/photo-1530266014522-683a4f66cf01?auto=format&fit=crop&q=80&w=800" // Robot arm in greenhouse
                                icon={<Bot className="text-gray-600" />}
                            />
                        </div>
                    </section>

                    {/* Challenges and Future Works */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Challenges */}
                        <section className="bg-white p-8 rounded-3xl shadow-lg border border-red-50">
                            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-green-600" /> Challenges and Considerations
                            </h2>
                            <p className="mb-4 text-gray-700 text-sm">While AI offers numerous benefits, there are challenges to its adoption in agriculture, including:</p>
                            <ul className="space-y-3">
                                <ListItem text="Cost of Technology: The initial investment for AI technologies can be high, posing a barrier for smallholder farmers." color="text-red-500" />
                                <ListItem text="Data Privacy and Security: Ensuring data security and privacy in AI applications is crucial." color="text-red-500" />
                                <ListItem text="Training and Education: Farmers need training to effectively utilize AI tools and interpret data for informed decision-making." color="text-red-500" />
                            </ul>
                        </section>

                        {/* Future Works */}
                        <section className="bg-white p-8 rounded-3xl shadow-lg border border-blue-50">
                            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                                <Globe className="text-blue-600" /> Future Works in AI and Agriculture
                            </h2>
                            <p className="mb-4 text-gray-700 text-sm">As technology continues to evolve, the future of AI in agriculture looks promising. Here are some anticipated developments:</p>
                            <ul className="space-y-3">
                                <ListItem text="Integration with IoT: The combination of AI with the Internet of Things (IoT) will enable real-time data collection from smart sensors in fields, leading to more accurate decision-making." color="text-blue-500" />
                                <ListItem text="Enhanced Machine Learning Algorithms: Future AI systems will leverage more advanced algorithms for better predictive analytics and adaptability to changing agricultural conditions." color="text-blue-500" />
                                <ListItem text="Personalized Farming Solutions: AI will offer tailored farming solutions based on specific farm conditions, enhancing crop management and yield." color="text-blue-500" />
                                <ListItem text="Blockchain for Transparency: Integrating AI with blockchain technology will provide transparency in the agricultural supply chain, ensuring product authenticity and traceability." color="text-blue-500" />
                                <ListItem text="Climate Resilient Strategies: AI can help develop strategies to make agriculture more resilient to climate change, such as optimizing crop choices based on changing climate patterns." color="text-blue-500" />
                            </ul>
                        </section>
                    </div>

                    {/* Conclusion */}
                    <section className="bg-[#1B5E20] text-white p-10 rounded-3xl shadow-2xl text-center">
                        <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
                        <p className="text-green-100 max-w-4xl mx-auto leading-relaxed text-lg">
                            AI is reshaping the future of agriculture, paving the way for smarter, more sustainable farming practices. As technology continues to advance,
                            the potential for AI to enhance productivity, reduce waste, and improve food security is limitless. Embracing AI in agriculture is not just a
                            trend; it's a necessary step towards a more sustainable and efficient food production system.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

function BenefitItem({ title, desc }) {
    return (
        <li className="flex gap-3">
            <div className="mt-1.5 min-w-[10px] h-2.5 w-2.5 rounded-full bg-green-500" />
            <div>
                <span className="font-bold text-green-700 block mb-1">{title}:</span>
                <span className="text-gray-600 text-sm leading-relaxed">{desc}</span>
            </div>
        </li>
    );
}

function ApplicationCard({ title, desc, image, icon }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100">
            <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    {icon}
                    <h3 className="font-bold text-lg text-green-800">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{desc}</p>
            </div>
        </div>
    );
}

function ListItem({ text, color }) {
    return (
        <li className="flex gap-3 text-sm text-gray-700">
            <span className={`font-bold ${color} text-lg leading-none`}>•</span>
            <span>{text}</span>
        </li>
    );
}
