import Navbar from '../components/Navbar';
import { Sprout } from 'lucide-react';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Header */}
            <div className="bg-green-800 text-white py-20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <h1 className="text-5xl font-extrabold mb-4 relative z-10">About AgroTech AI</h1>
                <p className="text-green-100 text-xl max-w-2xl mx-auto relative z-10">Empowering Farmers with AI-Driven Solutions</p>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-20">

                {/* Mission Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-green-700 font-bold tracking-wider text-sm uppercase">
                            <Sprout /> Our Mission
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Revolutionizing Agriculture</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            We aim to empower farmers with innovative solutions that harness the power of AI,
                            enabling them to achieve better yields, reduce waste, and promote sustainable farming practices.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            At Agro Tech AI, our mission is to revolutionize agriculture through advanced artificial intelligence technologies.
                            We are dedicated to creating AI-driven solutions that empower farmers and agribusinesses to optimize productivity,
                            improve sustainability, and tackle the growing challenges of global food security.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            By leveraging the power of AI, we aim to create a future where agriculture is not only more efficient but also more resilient
                            to the challenges posed by climate change and global food insecurity. Through collaboration, innovation, and a deep commitment
                            to the farming community, Agro Tech AI is determined to build a more sustainable and prosperous agricultural future for all.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-200 rounded-3xl transform rotate-3 scale-95 opacity-50"></div>
                        <img src="/images/about_main.png" alt="Smart Farming" className="relative rounded-3xl shadow-xl w-full object-cover hover:scale-[1.01] transition-transform duration-500" />
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="bg-white p-10 rounded-2xl shadow-lg border border-green-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">🤔 How it Works!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-full text-green-700 font-bold text-xl">1</div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Access Machine Learning Models</h3>
                                <p className="text-gray-600">Access various machine learning models for crop prediction and soil analysis tailored to your specific region and conditions.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-full text-green-700 font-bold text-xl">2</div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Informed Decision Making</h3>
                                <p className="text-gray-600">Use the platform to make informed decisions on crop management, pest control, and resource allocation to maximize efficiency.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed About Us Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-yellow-100 rounded-3xl transform -rotate-2 scale-95 opacity-50"></div>
                        <img src="/images/about_team.png" alt="Collaboration" className="relative rounded-3xl shadow-xl w-full object-cover hover:scale-[1.01] transition-transform duration-500" />
                    </div>
                    <div className="space-y-6 order-1 md:order-2">
                        <h2 className="text-3xl font-bold text-gray-800">Who We Are</h2>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <span className="text-green-500 text-xl">✅</span>
                                <p className="text-gray-600">We empower farmers, agribusinesses, and stakeholders across the agricultural ecosystem by providing innovative, data-driven solutions that increase efficiency, reduce waste, and improve yields.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-green-500 text-xl">✅</span>
                                <p className="text-gray-600">We believe that technology should be accessible to all, which is why we collaborate closely with farmers, agronomists, and industry experts to develop practical solutions that cater to the unique needs of the agricultural sector.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-green-500 text-xl">✅</span>
                                <p className="text-gray-600">Whether it’s a small family farm or a large commercial operation, Agro Tech AI provides scalable, adaptable technology that helps businesses thrive in an ever-changing environment.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
