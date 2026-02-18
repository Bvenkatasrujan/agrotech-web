import React, { useState, useEffect, useRef } from 'react';
import { Globe, Search, ChevronDown, Check } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ml', name: 'Malayalam (മലയാളം)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'ur', name: 'Urdu (اردو)' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const dropdownRef = useRef(null);

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        // Read initial language from cookie if exists
        const cookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
        if (cookie) {
            const lang = cookie.split('/')[2];
            if (lang) setSelectedLanguage(lang);
        }

        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        setSelectedLanguage(langCode);
        setIsOpen(false);

        // 1. Set the Google Translate cookie
        document.cookie = `googtrans=/en/${langCode}; path=/`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;

        // 2. Trigger the change on the hidden dropdown
        const googleTranslateDropdown = document.querySelector('.goog-te-combo');
        if (googleTranslateDropdown) {
            googleTranslateDropdown.value = langCode;
            googleTranslateDropdown.dispatchEvent(new Event('change'));
        }

        // 3. Force reload to ensure translation is applied (most reliable)
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    const currentLangName = languages.find(l => l.code === selectedLanguage)?.name || 'English';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 border border-white/20 transition-all text-sm font-medium"
            >
                <Globe size={16} className="text-green-200" />
                <span className="hidden lg:block">{currentLangName}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-[#1B5E20] border border-green-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                    <div className="p-3 border-b border-green-700">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                            <input
                                type="text"
                                placeholder="Search language..."
                                className="w-full bg-green-900/50 border border-green-700 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto custom-scrollbar py-2">
                        {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors hover:bg-green-700 ${selectedLanguage === lang.code ? 'bg-green-700 text-white font-bold' : 'text-green-50'}`}
                                >
                                    {lang.name}
                                    {selectedLanguage === lang.code && <Check size={14} className="text-green-400" />}
                                </button>
                            ))
                        ) : (
                            <p className="px-4 py-6 text-center text-xs text-green-400 italic">No results found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
