import React, { useState, useRef, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import farmerHeroBg from '../../assets/farmer-field.jpg';
import {
  Wheat,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Wrench,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Phone,
  BarChart3,
  Scale,
  Sparkles,
  AlertCircle,
  Truck,
  Building2,
  CalendarCheck,
  Coins,
  FileText,
  BadgePercent,
  TrendingDown,
  Navigation,
  RefreshCw,
  QrCode,
  Check,
  ArrowDown
} from 'lucide-react';

// Custom SVG: Traditional Indian Desi Hal (हल) / Agricultural Ploughing Tool
const HalPloughIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Main diagonal wooden beam / shaft (Harish) */}
    <path d="M4 6l10 9" />
    {/* Upright handle grip (Muthia) */}
    <path d="M14 15V4" />
    <path d="M12.5 4h3" />
    {/* Pointed iron ploughshare / triangular wedge blade (Faal) */}
    <path d="M14 15l7 4-6 1z" fill="currentColor" fillOpacity="0.25" />
    {/* Furrow soil guide line */}
    <path d="M2 20h20" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

// Custom SVG: Mandi Operator Workstation / Computer Terminal
const OperatorTerminalIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="13" rx="2" />
    <path d="M8 20h8" />
    <path d="M12 16v4" />
    <path d="M7 7h4" />
    <path d="M7 10h10" />
    <path d="M15 7h2" />
  </svg>
);

export const LandingPage = ({ onSelectPortal }) => {
  const { lang, setLang } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isHindi = lang === 'hi';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setLoginDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-agri-text selection:bg-agri-gold/30 font-sans flex flex-col justify-between">
      
      {/* ========================================================================= */}
      {/* 1. PUBLIC HEADER                                                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#17432A]/95 backdrop-blur-md text-white border-b border-agri-green-dark shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Brand Logo & Tagline */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold shadow-md ring-2 ring-agri-gold/30">
                <Wheat className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-white">
                    KisanSetu
                  </span>
                  <span className="text-[10px] font-extrabold bg-agri-green-dark text-agri-gold px-2 py-0.5 rounded-full border border-agri-gold/40 font-mono tracking-wider">
                    PS 26032
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-agri-ivory/80 font-medium leading-none mt-0.5">
                  {isHindi ? 'स्मार्ट फसल खरीद एवं मंडी कतार प्रबंधन' : 'Smart Crop Procurement & Mandi Queue Management'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-agri-ivory/90">
              <button onClick={() => scrollToSection('problem')} className="hover:text-agri-gold transition-colors">
                {isHindi ? 'समस्या' : 'The Problem'}
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-agri-gold transition-colors">
                {isHindi ? 'कार्यप्रणाली' : 'How It Works'}
              </button>
              <button onClick={() => scrollToSection('farmer-journey')} className="hover:text-agri-gold transition-colors">
                {isHindi ? 'किसानों के लिए' : 'For Farmers'}
              </button>
              <button onClick={() => scrollToSection('operator-journey')} className="hover:text-agri-gold transition-colors">
                {isHindi ? 'मंडियों के लिए' : 'For Mandis'}
              </button>
              <button onClick={() => scrollToSection('smart-recommendation')} className="hover:text-agri-gold transition-colors">
                {isHindi ? 'स्मार्ट मंडी' : 'Smart Mandi'}
              </button>
              <button onClick={() => scrollToSection('benefits')} className="hover:text-agri-gold transition-colors">
                {isHindi ? 'लाभ' : 'Benefits'}
              </button>
            </nav>

            {/* Right Action Controls */}
            <div className="hidden sm:flex items-center space-x-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-[#123621] p-1 rounded-xl border border-agri-gold/30 text-xs">
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    lang === 'en' ? 'bg-agri-gold text-agri-green-dark shadow-sm' : 'text-agri-ivory/70 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    lang === 'hi' ? 'bg-agri-gold text-agri-green-dark shadow-sm' : 'text-agri-ivory/70 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Login Dropdown / Popover */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-agri-ivory bg-[#1c5334] hover:bg-[#236640] border border-agri-gold/30 transition-all shadow-sm flex items-center space-x-1.5"
                  aria-expanded={loginDropdownOpen}
                >
                  <span>{isHindi ? 'लॉगिन' : 'Sign In'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180 text-agri-gold' : ''}`} />
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#17432A] rounded-2xl p-2 border-2 border-agri-gold/40 shadow-2xl space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2.5 py-1 border-b border-agri-green-light/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-agri-ivory/70 font-mono">
                        {isHindi ? 'समर्पित लॉगिन चुनें' : 'Select Login Portal'}
                      </span>
                    </div>

                    {/* Farmer Option */}
                    <button
                      onClick={() => {
                        setLoginDropdownOpen(false);
                        onSelectPortal('farmer-auth');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#123621] transition-all flex items-center space-x-3 group border border-transparent hover:border-agri-gold/30"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-agri-gold border border-agri-gold/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <HalPloughIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white group-hover:text-agri-gold transition-colors">
                          {isHindi ? 'किसान लॉगिन' : 'Farmer Login'}
                        </p>
                        <p className="text-[10px] text-agri-ivory/70 truncate">
                          {isHindi ? 'स्लॉट बुक करें व टोकन देखें' : 'Book slots & track your token'}
                        </p>
                      </div>
                    </button>

                    {/* Operator Option */}
                    <button
                      onClick={() => {
                        setLoginDropdownOpen(false);
                        onSelectPortal('operator-auth');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#123621] transition-all flex items-center space-x-3 group border border-transparent hover:border-blue-400/30"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <OperatorTerminalIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                          {isHindi ? 'ऑपरेटर लॉगिन' : 'Operator Login'}
                        </p>
                        <p className="text-[10px] text-agri-ivory/70 truncate">
                          {isHindi ? 'कतार व खरीद प्रबंधन' : 'Manage queues & procurement'}
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Get Started CTA */}
              <button
                onClick={() => onSelectPortal('farmer-auth')}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark transition-all shadow-md flex items-center space-x-1.5"
              >
                <span>{isHindi ? 'शुरू करें' : 'Get Started'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center space-x-2 sm:hidden">
              <div className="flex items-center bg-[#123621] p-0.5 rounded-lg border border-agri-gold/30 text-[11px]">
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 rounded font-bold ${lang === 'en' ? 'bg-agri-gold text-agri-green-dark' : 'text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`px-2 py-0.5 rounded font-bold ${lang === 'hi' ? 'bg-agri-gold text-agri-green-dark' : 'text-white'}`}
                >
                  HI
                </button>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-agri-green-dark text-white hover:bg-agri-green transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#17432A] border-b border-agri-gold/20 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-agri-ivory">
              <button onClick={() => scrollToSection('problem')} className="p-2.5 rounded-lg bg-[#123621] text-left">
                {isHindi ? 'समस्या' : 'The Problem'}
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="p-2.5 rounded-lg bg-[#123621] text-left">
                {isHindi ? 'कार्यप्रणाली' : 'How It Works'}
              </button>
              <button onClick={() => scrollToSection('farmer-journey')} className="p-2.5 rounded-lg bg-[#123621] text-left">
                {isHindi ? 'किसान यात्रा' : 'Farmer Journey'}
              </button>
              <button onClick={() => scrollToSection('operator-journey')} className="p-2.5 rounded-lg bg-[#123621] text-left">
                {isHindi ? 'मंडी संचालन' : 'Mandi System'}
              </button>
              <button onClick={() => scrollToSection('smart-recommendation')} className="p-2.5 rounded-lg bg-[#123621] text-left">
                {isHindi ? 'स्मार्ट मंडी' : 'Smart Mandi'}
              </button>
              <button onClick={() => scrollToSection('benefits')} className="p-2.5 rounded-lg bg-[#123621] text-left">
                {isHindi ? 'मुख्य लाभ' : 'Key Benefits'}
              </button>
            </div>

            <div className="pt-2 border-t border-agri-green-light/20 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSelectPortal('farmer-auth');
                }}
                className="w-full py-2.5 px-2 rounded-xl text-xs font-bold bg-white text-agri-green-dark text-center flex items-center justify-center space-x-1.5"
              >
                <HalPloughIcon className="w-4 h-4 text-agri-green-dark" />
                <span>{isHindi ? 'किसान लॉगिन' : 'Farmer Login'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSelectPortal('operator-auth');
                }}
                className="w-full py-2.5 px-2 rounded-xl text-xs font-bold bg-[#123621] border border-blue-400/40 text-blue-200 text-center flex items-center justify-center space-x-1.5"
              >
                <OperatorTerminalIcon className="w-4 h-4 text-blue-300" />
                <span>{isHindi ? 'ऑपरेटर लॉगिन' : 'Operator Login'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0a2013] pt-8 pb-12 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b-2 border-[#123621]">
        
        {/* Authentic Indian Farmer & Field Photographic Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center sm:bg-[center_top_15%] bg-no-repeat pointer-events-none opacity-85 brightness-[1.03] contrast-[1.05] saturate-[1.12]"
          style={{ backgroundImage: `url(${farmerHeroBg})` }}
        />

        {/* Tailored Dark Agricultural Green Gradient Overlays for High Legibility while Keeping Farmer & Crops Visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07180e]/92 via-[#07180e]/45 to-[#07180e]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2013] via-transparent to-[#0a2013]/50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-white text-center lg:text-left">
              
              {/* National Initiative Badge */}
              <div className="inline-flex items-center bg-agri-gold/20 border border-agri-gold/50 rounded-full px-4 py-1.5 backdrop-blur-md shadow-sm">
                <span className="text-xs font-bold text-agri-gold tracking-wide font-mono">
                  {isHindi ? '🏛️ उपभोक्ता मामले विभाग • स्मार्ट इंडिया हैकथॉन PS 26032' : '🏛️ Dept. of Consumer Affairs (DoCA) • Smart India Hackathon PS 26032'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
                {isHindi ? (
                  <>
                    कम इंतजार। बेहतर योजना। <br />
                    पारदर्शी मंडी खरीद।
                  </>
                ) : (
                  <>
                    Less waiting. Better planning. <br />
                    Smarter crop procurement.
                  </>
                )}
              </h1>

              {/* Supporting Subtext */}
              <p className="text-sm sm:text-base lg:text-lg text-agri-ivory/95 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow-sm">
                {isHindi
                  ? 'मंडी में अपनी बारी तय करें, डिजिटल टोकन पाएं, लाइव कतार ट्रैक करें और सीधे अपने बैंक खाते में गारंटीकृत एमएसपी भुगतान पाएं।'
                  : 'Book your mandi visit, get a digital token, track your queue position from home, and receive your MSP payout directly in your bank account.'}
              </p>

              {/* Two Prominent Horizontal Login Cards: Farmer & Mandi Operator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-2xl mx-auto lg:mx-0">
                
                {/* Farmer Login Card */}
                <button
                  onClick={() => onSelectPortal('farmer-auth')}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0e2c1a]/95 hover:bg-[#143d24] border-2 border-agri-gold/40 hover:border-agri-gold text-left transition-all shadow-xl backdrop-blur-md flex items-center space-x-3.5 group touch-target transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-950/90 text-agri-gold border border-agri-gold/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    <HalPloughIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm sm:text-base font-extrabold text-white group-hover:text-agri-gold transition-colors">
                        {isHindi ? 'किसान लॉगिन' : 'Farmer Login'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-agri-gold opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-agri-ivory/80 truncate mt-0.5 font-normal">
                      {isHindi ? 'स्लॉट बुक करें व टोकन ट्रैक करें' : 'Book slots & track your token'}
                    </p>
                  </div>
                </button>

                {/* Mandi Operator Login Card */}
                <button
                  onClick={() => onSelectPortal('operator-auth')}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0e2c1a]/95 hover:bg-[#143d24] border-2 border-blue-400/40 hover:border-blue-400 text-left transition-all shadow-xl backdrop-blur-md flex items-center space-x-3.5 group touch-target transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-950/90 text-blue-300 border border-blue-400/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    <OperatorTerminalIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm sm:text-base font-extrabold text-white group-hover:text-blue-300 transition-colors">
                        {isHindi ? 'ऑपरेटर लॉगिन' : 'Operator Login'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-blue-300 opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-agri-ivory/80 truncate mt-0.5 font-normal">
                      {isHindi ? 'कतार व खरीद प्रबंधन' : 'Manage queues & procurement'}
                    </p>
                  </div>
                </button>

              </div>

            </div>

            {/* Right Column: Visual Diagram of KisanSetu Flow */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-agri-gold/40 relative">
                
                {/* Header Tag (Clean, No Ping Dot) */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-agri-ivory-muted">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-agri-green uppercase tracking-wider font-mono">
                      {isHindi ? 'लाइव प्रक्रिया प्रवाह' : 'KisanSetu Flow Preview'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-agri-gold/20 text-agri-green-dark font-extrabold px-2 py-0.5 rounded border border-agri-gold/30">
                    {isHindi ? 'पारदर्शी व डिजिटल' : '100% Digital'}
                  </span>
                </div>

                {/* Vertical Process Stream with Custom Badges */}
                <div className="space-y-2.5">
                  
                  {/* Step A */}
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-agri-ivory/50 border border-agri-ivory-muted hover:border-agri-green/30 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-agri-text truncate">
                        {isHindi ? 'किसान फसल व 30-मिनट स्लॉट चुनते हैं' : 'Farmer Books Slot & Crop'}
                      </p>
                      <p className="text-[10px] text-agri-text-muted truncate">
                        {isHindi ? 'धान (ग्रेड ए) • 40 क्विंटल • 11:00 AM' : 'Paddy (Grade A) • 40 Quintals • 11:00 AM'}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>

                  {/* Step B */}
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                    <div className="w-8 h-8 rounded-lg bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-agri-text">
                          {isHindi ? 'डिजिटल टोकन जारी' : 'Digital Token Issued'}
                        </p>
                        <span className="text-[10px] font-mono font-black bg-white text-agri-green px-1.5 py-0.2 rounded border border-agri-gold">
                          SNP-014
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-900 font-medium truncate">
                        {isHindi ? 'आगे 3 किसान • अनुमानित 24 मिनट' : '3 farmers ahead • ~24 min wait'}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {isHindi ? 'सक्रिय' : 'Live'}
                    </span>
                  </div>

                  {/* Step C */}
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-agri-ivory/50 border border-agri-ivory-muted">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-agri-text truncate">
                        {isHindi ? 'मंडी गेट पर समय पर आगमन' : 'Arrive at Mandi on Time'}
                      </p>
                      <p className="text-[10px] text-agri-text-muted truncate">
                        {isHindi ? 'गेट 2 • कोई कतार में धक्का-मुक्की नहीं' : 'Gate 2 Entry • No yard blocking'}
                      </p>
                    </div>
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>

                  {/* Step D */}
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-agri-ivory/50 border border-agri-ivory-muted">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-agri-text truncate">
                        {isHindi ? 'डिजिटल तौल व गुणवत्ता जांच' : 'Weighbridge & Quality QC'}
                      </p>
                      <p className="text-[10px] text-agri-text-muted truncate">
                        {isHindi ? '38.5 क्विंटल शुद्ध भार • नमी 12.4%' : '38.5 Qtl Net • 12.4% Moisture (Pass)'}
                      </p>
                    </div>
                    <Scale className="w-4 h-4 text-purple-600 shrink-0" />
                  </div>

                  {/* Step E */}
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      5
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-900 truncate">
                        {isHindi ? 'सीधा बैंक में एमएसपी भुगतान' : 'Direct DBT Bank Transfer'}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-mono font-bold truncate">
                        ₹84,700 {isHindi ? 'आधार लिंक एसबीआई खाते में' : 'Credited to SBI A/C ****4092'}
                      </p>
                    </div>
                    <Coins className="w-4 h-4 text-emerald-700 shrink-0" />
                  </div>

                </div>

                {/* Footer Micro Tagline */}
                <div className="mt-4 pt-3 border-t border-agri-ivory-muted text-center">
                  <p className="text-[11px] text-agri-text-muted font-medium">
                    {isHindi
                      ? '✅ किसानों को घंटों लाइन में खड़े रहने की आवश्यकता नहीं है।'
                      : '✅ Zero unnecessary waiting. 100% transparent procurement.'}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE PROBLEM SECTION                                                    */}
      {/* ========================================================================= */}
      <section id="problem" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-red-100 text-red-800 px-3 py-1 rounded-full border border-red-200 font-mono inline-block">
              {isHindi ? 'मौजूदा व्यवस्था की चुनौतियां' : 'Current Mandi Challenges'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'मंडी में फसल बेचने में इतना समय क्यों लगता है?' : 'Why does selling at the mandi take so long?'}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'पारंपरिक व्यवस्था में किसानों को बिना किसी पूर्व सूचना के सीधे मंडी पहुंचना पड़ता है, जिससे भारी जाम और अनिश्चितता पैदा होती है।'
                : 'Without pre-scheduled slots and real-time visibility, hundreds of farmers arrive simultaneously, creating severe yard bottlenecks and stress.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Problem 1: Long Waiting */}
            <div className="bg-white rounded-2xl p-6 border border-agri-ivory-muted shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-agri-text">
                {isHindi ? 'लंबा व अनिश्चित इंतजार' : 'Long & Exhausting Waiting'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'किसान अक्सर 6 से 12 घंटे तक ट्रैक्टर-ट्रॉली की लाइन में खड़े रहते हैं, बिना यह जाने कि उनकी तौल की बारी कब आएगी।'
                  : 'Farmers spend hours or even days waiting in long queues outside crowded mandis without knowing when their weighment will happen.'}
              </p>
            </div>

            {/* Problem 2: Uncertain Arrival */}
            <div className="bg-white rounded-2xl p-6 border border-agri-ivory-muted shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-agri-text">
                {isHindi ? 'अनिश्चित आगमन समय' : 'Uncoordinated Arrival Times'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'किसानों को यह पता नहीं होता कि किस समय मंडी पहुंचना सबसे अच्छा रहेगा, जिससे वे अत्यधिक जल्दी या पीक समय पर पहुंचते हैं।'
                  : "Farmers don't know the optimal arrival window, leading to fuel wastage, spoiled crops, and lost working days."}
              </p>
            </div>

            {/* Problem 3: Congestion & Choke */}
            <div className="bg-white rounded-2xl p-6 border border-agri-ivory-muted shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-agri-text">
                {isHindi ? 'मंडी गेट पर भीषण जाम' : 'Yard & Gate Congestion'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'सैकड़ों वाहन एक साथ आने से गेट और तौल कांटे जाम हो जाते हैं, जबकि पास की अन्य उप-मंडियां खाली रह जाती हैं।'
                  : 'Too many farmers arriving at the same hour creates extreme yard bottlenecks, while adjacent procurement yards remain underutilized.'}
              </p>
            </div>

            {/* Problem 4: Payment Anxiety */}
            <div className="bg-white rounded-2xl p-6 border border-agri-ivory-muted shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-agri-text">
                {isHindi ? 'कागजी पर्चियां व भुगतान अनिश्चितता' : 'Payment Status Uncertainty'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'कागजी पर्चियों और अपारदर्शी प्रक्रियाओं के कारण किसान को वजन अनुमोदन और बैंक खाते में एमएसपी राशि आने की स्पष्ट जानकारी नहीं मिलती।'
                  : 'Farmers need absolute, transparent visibility into their exact weighment slips, quality grade, and real-time DBT bank credit status.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW KISANSETU WORKS SECTION                                            */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-agri-green-soft text-agri-green-dark px-3 py-1 rounded-full border border-agri-green-border font-mono inline-block">
              {isHindi ? 'सरल व पारदर्शी समाधान' : 'The KisanSetu Solution'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'खेत से बैंक खाते तक — आसान चरणों में' : 'From your farm to payment — in a few simple steps'}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'किसानसेतु पूरी खरीद प्रक्रिया को सुव्यवस्थित करता है ताकि किसान अपनी सुविधानुसार समय चुन सकें और पारदर्शी भुगतान प्राप्त कर सकें।'
                : 'A structured, transparent procurement pipeline designed to eliminate physical queue fatigue and empower farmers.'}
            </p>
          </div>

          {/* 8-Step Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-3 relative group hover:border-agri-green/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-agri-green text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  01
                </span>
                <Wheat className="w-5 h-5 text-agri-green" />
              </div>
              <h3 className="font-heading font-bold text-sm text-agri-text">
                {isHindi ? '1. फसल व मात्रा चुनें' : '1. Choose Your Crop'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi ? 'धान, गेहूं, सरसों आदि फसल और अनुमानित वजन का चयन करें।' : 'Select crop variety (e.g. Paddy Grade A) and expected quantity.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-3 relative group hover:border-agri-green/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-agri-green text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  02
                </span>
                <MapPin className="w-5 h-5 text-agri-green" />
              </div>
              <h3 className="font-heading font-bold text-sm text-agri-text">
                {isHindi ? '2. खरीद मंडी चुनें' : '2. Find Nearby Mandi'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi ? 'अपने जिले के अधिकृत सरकारी खरीद केंद्र व दूरी देखें।' : 'View authorized government procurement yards with distance & active gates.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-3 relative group hover:border-agri-green/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-agri-green text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  03
                </span>
                <BarChart3 className="w-5 h-5 text-agri-green" />
              </div>
              <h3 className="font-heading font-bold text-sm text-agri-text">
                {isHindi ? '3. लाइव भीड़ व इंतजार देखें' : '3. Check Waiting Time'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi ? 'मंडी में कितने किसान पहले से हैं और कितना समय लगेगा, यह देखें।' : 'Check live queue volume, yard capacity percentage, and estimated wait minutes.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-3 relative group hover:border-agri-green/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-agri-green text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  04
                </span>
                <Clock className="w-5 h-5 text-agri-green" />
              </div>
              <h3 className="font-heading font-bold text-sm text-agri-text">
                {isHindi ? '4. 30-मिनट का स्लॉट बुक करें' : '4. Book a 30-Min Slot'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi ? 'अपनी सुविधानुसार निश्चित 30 मिनट का समय स्लॉट चुनें।' : 'Reserve a guaranteed 30-minute arrival window that fits your harvest schedule.'}
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-3 relative group hover:border-agri-green/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-agri-gold text-agri-green-dark font-extrabold text-xs flex items-center justify-center font-mono">
                  05
                </span>
                <QrCode className="w-5 h-5 text-agri-gold-dark" />
              </div>
              <h3 className="font-heading font-bold text-sm text-agri-text">
                {isHindi ? '5. डिजिटल टोकन प्राप्त करें' : '5. Receive Digital Token'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi ? 'अपने फोन पर टोकन नंबर (जैसे SNP-014) और गेट पास प्राप्त करें।' : 'Get your official token pass with real-time queue position on your mobile.'}
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-3 relative group hover:border-agri-green/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-agri-green text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  06
                </span>
                <Truck className="w-5 h-5 text-agri-green" />
              </div>
              <h3 className="font-heading font-bold text-sm text-agri-text">
                {isHindi ? '6. बारी आने पर ही पहुंचें' : '6. Reach When Turn is Near'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi ? 'घर से लाइव कतार देखें और तभी निकलें जब आपकी बारी करीब हो।' : 'Track token progress from home and arrive smoothly without gate crowding.'}
              </p>
            </div>

            {/* Step 7 */}
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-3 relative group hover:border-agri-green/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-agri-green text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  07
                </span>
                <Scale className="w-5 h-5 text-agri-green" />
              </div>
              <h3 className="font-heading font-bold text-sm text-agri-text">
                {isHindi ? '7. पारदर्शी तौल व जांच' : '7. Complete Procurement'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi ? 'डिजिटल कांटे पर तौल और 17% मानक नमी जांच तुरंत पूरी कराएं।' : 'Fast weighbridge entry and moisture assay with transparent digital weight slip.'}
              </p>
            </div>

            {/* Step 8 */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 relative group hover:border-emerald-500 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  08
                </span>
                <Coins className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-heading font-bold text-sm text-emerald-900">
                {isHindi ? '8. सीधा DBT बैंक भुगतान' : '8. Direct DBT Payment'}
              </h3>
              <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                {isHindi ? 'सरकारी एमएसपी राशि 24-48 घंटों में सीधे बैंक खाते में जमा।' : 'Guaranteed government MSP credited directly to your Aadhaar-linked bank account.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FARMER JOURNEY SECTION                                                 */}
      {/* ========================================================================= */}
      <section id="farmer-journey" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 font-mono inline-block">
              {isHindi ? 'किसान अनुभव' : 'Farmer Experience'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'किसान के लिए यह कैसे काम करता है' : 'How it works for a farmer'}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'किसानसेतु का उपयोग करना उतना ही आसान है जितना फोन पर एक संदेश देखना।'
                : 'A step-by-step visual walkthrough showing how simple and stress-free selling crops becomes.'}
            </p>
          </div>

          {/* Visual Timeline of 5 Simple Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            {/* Step 1: Book */}
            <div className="bg-white rounded-2xl p-5 border border-agri-ivory-muted shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                  {isHindi ? 'कदम 1 • बुकिंग' : 'Step 1 • Book'}
                </span>
                <h3 className="font-heading text-base font-bold text-agri-text">
                  {isHindi ? 'स्लॉट बुक करें' : 'Select Slot'}
                </h3>
                <p className="text-xs text-agri-text-muted leading-relaxed">
                  {isHindi
                    ? 'अपनी फसल, मात्रा और पसंदीदा मंडी चुनकर 30-मिनट का समय तय करें।'
                    : 'Choose your crop and preferred mandi from your phone or nearby CSC.'}
                </p>
              </div>
            </div>

            {/* Step 2: Token */}
            <div className="bg-white rounded-2xl p-5 border-2 border-agri-gold/50 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-agri-gold-dark" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-mono">
                  {isHindi ? 'कदम 2 • टोकन' : 'Step 2 • Token'}
                </span>
                <h3 className="font-heading text-base font-bold text-agri-text">
                  {isHindi ? 'डिजिटल पास प्राप्त करें' : 'Get Digital Token'}
                </h3>
                <p className="text-xs text-agri-text-muted leading-relaxed">
                  {isHindi
                    ? 'आपको अपना निश्चित टोकन नंबर (जैसे SNP-014) और आगमन समय मिलता है।'
                    : 'Get your official token number, assigned gate, and arrival window.'}
                </p>
              </div>
            </div>

            {/* Step 3: Arrive */}
            <div className="bg-white rounded-2xl p-5 border border-agri-ivory-muted shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-blue-900 bg-blue-100 px-2 py-0.5 rounded font-mono">
                  {isHindi ? 'कदम 3 • आगमन' : 'Step 3 • Arrive'}
                </span>
                <h3 className="font-heading text-base font-bold text-agri-text">
                  {isHindi ? 'समय पर मंडी पहुंचें' : 'Arrive at Mandi'}
                </h3>
                <p className="text-xs text-agri-text-muted leading-relaxed">
                  {isHindi
                    ? 'जब आपकी बारी पास हो, तभी मंडी आएं। गेट पर टोकन दिखाकर सीधा प्रवेश पाएं।'
                    : 'Come to the mandi when your turn is near. No standing in roadside lines.'}
                </p>
              </div>
            </div>

            {/* Step 4: Weighing */}
            <div className="bg-white rounded-2xl p-5 border border-agri-ivory-muted shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-purple-900 bg-purple-100 px-2 py-0.5 rounded font-mono">
                  {isHindi ? 'कदम 4 • तौल' : 'Step 4 • Weighing'}
                </span>
                <h3 className="font-heading text-base font-bold text-agri-text">
                  {isHindi ? 'तौल व खरीद पूर्ण' : 'Weighment & QC'}
                </h3>
                <p className="text-xs text-agri-text-muted leading-relaxed">
                  {isHindi
                    ? 'कांटे पर सटीक तौल और गुणवत्ता जांच के साथ तुरंत डिजिटल रसीद प्राप्त करें।'
                    : 'Complete weighing and crop inspection with verified digital slip.'}
                </p>
              </div>
            </div>

            {/* Step 5: Payment */}
            <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-400/50 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Coins className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded font-mono">
                  {isHindi ? 'कदम 5 • भुगतान' : 'Step 5 • Payout'}
                </span>
                <h3 className="font-heading text-base font-bold text-emerald-950">
                  {isHindi ? 'सीधा बैंक खाता' : 'Direct MSP Payment'}
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  {isHindi
                    ? '24 से 48 घंटों के भीतर एमएसपी राशि सीधे आधार लिंक बैंक खाते में।'
                    : 'Track your MSP payment transfer directly to your bank account.'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MANDI OPERATOR JOURNEY SECTION                                         */}
      {/* ========================================================================= */}
      <section id="operator-journey" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200 font-mono inline-block">
              {isHindi ? 'मंडी प्रशासन एवं ऑपरेटर दृश्य' : 'Mandi Operations & Management'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'किसानों का समय बचता है, मंडियां बेहतर काम करती हैं' : 'While farmers wait less, mandis work smarter'}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'किसानसेतु केवल किसानों के लिए ही नहीं, बल्कि मंडी ऑपरेटरों और खरीद एजेंसियों को भी सुगम प्रबंधन की पूरी शक्ति देता है।'
                : 'Mandi operators get real-time operational visibility over scheduled arrivals, weighbridge counter queues, and procurement metrics.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Operator Value Pillars */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="bg-[#FAF7EE] p-5 rounded-2xl border border-agri-ivory-muted space-y-2">
                <div className="flex items-center space-x-2">
                  <CalendarCheck className="w-5 h-5 text-blue-700" />
                  <h3 className="font-heading text-sm font-bold text-agri-text">
                    {isHindi ? '1. दिनभर के आगमन का सटीक पूर्वानुमान' : '1. Advance Arrival Forecasting'}
                  </h3>
                </div>
                <p className="text-xs text-agri-text-muted leading-relaxed">
                  {isHindi
                    ? 'ऑपरेटर को पहले से पता होता है कि प्रत्येक 30-मिनट स्लॉट में कितने किसान और कितनी मात्रा में फसल आने वाली है।'
                    : 'Operators see total booked slots per 30-minute interval, eliminating surprise morning stampedes.'}
                </p>
              </div>

              <div className="bg-[#FAF7EE] p-5 rounded-2xl border border-agri-ivory-muted space-y-2">
                <div className="flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-blue-700" />
                  <h3 className="font-heading text-sm font-bold text-agri-text">
                    {isHindi ? '2. कांटों व काउंटरों का कुशल वितरण' : '2. Counter Load Balancing'}
                  </h3>
                </div>
                <p className="text-xs text-agri-text-muted leading-relaxed">
                  {isHindi
                    ? 'ट्रकों को खाली काउंटरों पर तुरंत निर्देशित किया जाता है ताकि किसी एक कांटे पर अनावश्यक कतार न लगे।'
                    : 'Balance truck traffic evenly across weighbridges and quality inspection counters.'}
                </p>
              </div>

              <div className="bg-[#FAF7EE] p-5 rounded-2xl border border-agri-ivory-muted space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <h3 className="font-heading text-sm font-bold text-agri-text">
                    {isHindi ? '3. 1-क्लिक डिजिटल तौल व रसीद' : '3. 1-Click Digital Inspection Recording'}
                  </h3>
                </div>
                <p className="text-xs text-agri-text-muted leading-relaxed">
                  {isHindi
                    ? 'शुद्ध भार और नमी प्रतिशत दर्ज करते ही स्वचालित खरीद पर्ची तैयार होती है और भुगतान के लिए प्रेषित हो जाती है।'
                    : 'Record net weighment and moisture with instant digital slip generation directly linked to admin DBT disbursal.'}
                </p>
              </div>

            </div>

            {/* Right: Operator Console Mockup Diagram */}
            <div className="lg:col-span-6">
              <div className="bg-[#17432A] text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-agri-gold/40 space-y-4">
                
                {/* Console Header */}
                <div className="flex items-center justify-between pb-3 border-b border-agri-green-light/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      🏢
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isHindi ? 'सोनीपत मुख्य खरीद केंद्र — ऑपरेटर डैशबोर्ड' : 'Sonipat Main Mandi — Operator Console'}
                      </p>
                      <p className="text-[10px] text-agri-ivory/70">
                        {isHindi ? 'लाइव गेट व काउंटर नियंत्रण' : 'Live Gate & Counter Telemetry'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    ● Live Yard Active
                  </span>
                </div>

                {/* Yard Metrics Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#123621] p-2.5 rounded-xl border border-agri-gold/20">
                    <span className="text-[10px] text-agri-ivory/70 block">{isHindi ? 'आज के स्लॉट' : 'Booked Slots'}</span>
                    <span className="font-heading text-lg font-black text-white font-mono">48</span>
                  </div>
                  <div className="bg-[#123621] p-2.5 rounded-xl border border-agri-gold/20">
                    <span className="text-[10px] text-agri-ivory/70 block">{isHindi ? 'वर्तमान कतार' : 'In Yard Queue'}</span>
                    <span className="font-heading text-lg font-black text-amber-400 font-mono">14 Trucks</span>
                  </div>
                  <div className="bg-[#123621] p-2.5 rounded-xl border border-agri-gold/20">
                    <span className="text-[10px] text-agri-ivory/70 block">{isHindi ? 'खरीद पूर्ण' : 'Completed'}</span>
                    <span className="font-heading text-lg font-black text-emerald-400 font-mono">34</span>
                  </div>
                </div>

                {/* Counter Distribution Status */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-agri-ivory uppercase tracking-wider font-mono">
                    {isHindi ? 'काउंटर स्थिति एवं लोड वितरण' : 'Active Counter Status'}
                  </p>
                  
                  <div className="bg-[#123621] p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-bold text-white">{isHindi ? 'काउंटर 1 (तौल कांटा A)' : 'Counter 1 (Weighbridge A)'}</span>
                    </div>
                    <span className="text-[11px] font-mono text-agri-gold font-bold">
                      {isHindi ? 'प्रोसेसिंग: SNP-014' : 'Processing: SNP-014'}
                    </span>
                  </div>

                  <div className="bg-[#123621] p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-bold text-white">{isHindi ? 'काउंटर 2 (गुणवत्ता व नमी जांच)' : 'Counter 2 (Moisture QC)'}</span>
                    </div>
                    <span className="text-[11px] font-mono text-agri-ivory/80">
                      {isHindi ? 'अगला: SNP-015' : 'Next: SNP-015'}
                    </span>
                  </div>
                </div>

                {/* Operator Prompt */}
                <div className="p-2.5 rounded-xl bg-agri-gold/10 border border-agri-gold/30 text-center">
                  <p className="text-[11px] text-agri-gold font-medium">
                    {isHindi
                      ? '💡 ऑपरेटर टोकन कॉल करते हैं, जिससे भीड़ कांटा कक्ष के अंदर नहीं आती।'
                      : '💡 Tokens are called systematically, preventing chaotic crowd buildup.'}
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SMART MANDI RECOMMENDATION SECTION                                     */}
      {/* ========================================================================= */}
      <section id="smart-recommendation" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-agri-gold/20 text-agri-green-dark px-3 py-1 rounded-full border border-agri-gold/40 font-mono inline-block">
              {isHindi ? 'बुद्धिमान लोड बैलेंसिंग' : 'Smart Load Balancing'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'सिर्फ मंडी मत खोजिए। बेहतर मंडी चुनिए।' : "Don't just find a mandi. Find the better mandi."}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'किसानसेतु लाइव कतार, इंतजार समय और मंडी क्षमता का विश्लेषण कर किसान को समय बचाने वाले नजदीकी केंद्र का सुझाव देता है।'
                : 'KisanSetu analyzes live queue telemetry to suggest alternative nearby yards when they offer significantly lower waiting times.'}
            </p>
          </div>

          {/* Interactive Side-by-Side Comparison */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Congested Mandi Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-red-200 shadow-md space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                    ⚠️ {isHindi ? 'भारी भीड़ (Congested)' : 'Heavy Congestion'}
                  </span>
                  <span className="text-[11px] text-agri-text-muted font-mono">14.2 km</span>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-agri-text">
                    {isHindi ? 'सोनीपत मुख्य यार्ड' : 'Sonipat Main Procurement Yard'}
                  </h3>
                  <p className="text-xs text-agri-text-muted">
                    {isHindi ? 'ट्रकों की भारी आवक के कारण लाइन' : 'High truck influx creating scale backlog'}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-agri-ivory-muted">
                    <span className="text-agri-text-muted">{isHindi ? 'अनुमानित इंतजार समय' : 'Est. Wait Time'}</span>
                    <span className="font-bold text-red-600 font-mono">~67 min</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-agri-ivory-muted">
                    <span className="text-agri-text-muted">{isHindi ? 'यार्ड क्षमता उपयोग' : 'Yard Capacity'}</span>
                    <span className="font-bold text-red-600 font-mono">94% Capacity</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-agri-text-muted">{isHindi ? 'उपलब्ध स्लॉट' : 'Available Slots'}</span>
                    <span className="font-bold text-agri-text font-mono">2 Slots Remaining</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 text-red-800 text-[11px] font-medium text-center">
                {isHindi ? 'समय अधिक लग सकता है' : 'Long wait likely during peak morning hours'}
              </div>
            </div>

            {/* Recommended Mandi Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-xl space-y-4 relative flex flex-col justify-between ring-4 ring-emerald-500/10">
              
              {/* Recommended Badge */}
              <div className="absolute -top-3.5 right-6 bg-emerald-700 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider flex items-center space-x-1 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-agri-gold" />
                <span>{isHindi ? 'किसानसेतु अनुशंसित' : 'KisanSetu Recommended'}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    🟢 {isHindi ? 'सामान्य भार (Normal Load)' : 'Normal Load (Fast Pass)'}
                  </span>
                  <span className="text-[11px] text-agri-text-muted font-mono">22.8 km</span>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-agri-green">
                    {isHindi ? 'पानीपत उप-मंडी केंद्र' : 'Panipat Sub-Mandi Centre'}
                  </h3>
                  <p className="text-xs text-agri-text-muted">
                    {isHindi ? 'सुगम तौल और खाली कांटा उपलब्ध' : 'Optimal counter clearance & active scales'}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-agri-ivory-muted">
                    <span className="text-agri-text-muted">{isHindi ? 'अनुमानित इंतजार समय' : 'Est. Wait Time'}</span>
                    <span className="font-black text-emerald-700 font-mono text-sm">~31 min (Save 36 min!)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-agri-ivory-muted">
                    <span className="text-agri-text-muted">{isHindi ? 'यार्ड क्षमता उपयोग' : 'Yard Capacity'}</span>
                    <span className="font-bold text-emerald-700 font-mono">62% Capacity</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-agri-text-muted">{isHindi ? 'उपलब्ध स्लॉट' : 'Available Slots'}</span>
                    <span className="font-bold text-emerald-700 font-mono">11 Slots Open</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-[11px] font-bold text-center border border-emerald-200">
                {isHindi
                  ? '✨ 36 मिनट की बचत — सुचारू तौल'
                  : '✨ Saves ~36 mins with fast weighbridge turnaround'}
              </div>
            </div>

          </div>

          {/* Farmer Autonomy Guarantee Note */}
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#FFFDF7] border border-agri-gold/40 text-center shadow-sm">
            <p className="text-xs text-agri-text leading-relaxed font-medium">
              <span className="font-bold text-agri-green">
                {isHindi ? '⚠️ किसान का अधिकार सर्वोपरि: ' : '🔒 Farmer Control Guarantee: '}
              </span>
              {isHindi
                ? 'किसानसेतु केवल कम भीड़ वाले केंद्र का सुझाव देता है। मंडी बदलने या न बदलने का अंतिम निर्णय पूरी तरह किसान के हाथ में रहता है।'
                : 'KisanSetu never forces a centre change. Alternative mandis are suggested only to save time; the final choice always remains 100% with the farmer.'}
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. LIVE TOKEN / QUEUE EXPLANATION SECTION                                 */}
      {/* ========================================================================= */}
      <section id="live-token" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200 font-mono inline-block">
              {isHindi ? 'डिजिटल टोकन व कतार' : 'Live Token Transparency'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'घर से निकलने से पहले जानें अपनी बारी' : 'Know your turn before you even start your tractor'}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'धूप में घंटों लाइन में खड़े रहने के बजाय अपने फोन पर वास्तविक समय में अपनी कतार संख्या और अनुमानित समय देखें।'
                : 'Instead of standing in a long unorganized queue under the sun, see your exact position and estimated waiting minutes from anywhere.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            
            {/* Left: Realistic Live Digital Token Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border-2 border-agri-green p-6 shadow-xl space-y-4">
                
                {/* Token Pass Header */}
                <div className="flex items-center justify-between pb-3 border-b border-agri-ivory-muted">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-agri-gold text-agri-green-dark flex items-center justify-center font-extrabold text-xs font-mono">
                      DoCA
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xs text-agri-green">
                        {isHindi ? 'डिजिटल मंडी टोकन पास' : 'Digital Mandi Token Pass'}
                      </h4>
                      <p className="text-[10px] text-agri-text-muted">
                        {isHindi ? 'रमेश सिंह (सोनीपत)' : 'Ramesh Singh (Sonipat)'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {isHindi ? 'कतार में' : 'In Queue'}
                  </span>
                </div>

                {/* Big Token Number */}
                <div className="text-center bg-[#FAF7EE] rounded-2xl p-5 border border-agri-gold/40 space-y-1">
                  <span className="text-[11px] font-bold text-agri-text-muted uppercase tracking-wider">
                    {isHindi ? 'आपका आधिकारिक टोकन नंबर' : 'Your Official Token'}
                  </span>
                  <div className="font-heading font-black text-4xl sm:text-5xl text-agri-green font-mono py-1">
                    SNP-014
                  </div>
                  <p className="text-xs text-agri-text-muted font-medium">
                    {isHindi ? 'सोनीपत मुख्य मंडी • स्लॉट 11:00 AM – 11:30 AM' : 'Sonipat Main Mandi • Slot 11:00 AM – 11:30 AM'}
                  </p>
                </div>

                {/* Queue Stats Row */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
                    <span className="text-[11px] text-agri-text-muted block">{isHindi ? 'आगे कितने किसान' : 'Farmers Ahead'}</span>
                    <p className="font-heading text-lg font-extrabold text-agri-text font-mono mt-0.5">
                      {isHindi ? '3 किसान' : '3 Farmers'}
                    </p>
                  </div>
                  <div className="bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
                    <span className="text-[11px] text-agri-text-muted block">{isHindi ? 'अनुमानित प्रतीक्षा' : 'Est. Wait Time'}</span>
                    <p className="font-heading text-lg font-extrabold text-agri-green font-mono mt-0.5">
                      ~24 mins
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-agri-green-soft text-agri-green-dark text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-agri-green" />
                  <span className="text-[11px] font-medium">
                    {isHindi
                      ? 'बारी आने पर एसएमएस और व्हाट्सएप पर सूचना भेजी जाती है।'
                      : 'Automatic SMS alert sent when 2 farmers remain ahead of you.'}
                  </span>
                </div>

              </div>
            </div>

            {/* Right: Live Queue Timeline Flow */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-agri-text">
                  {isHindi ? 'लाइव कतार कैसे आगे बढ़ती है' : 'How the Live Queue Moves'}
                </h3>
                <p className="text-xs text-agri-text-muted">
                  {isHindi
                    ? 'हर किसान को पारदर्शी क्रम संख्या दी जाती है जिससे कोई बीच में लाइन नहीं तोड़ सकता।'
                    : 'Tokens progress sequentially through gate verification, weighbridge, and moisture inspection.'}
                </p>
              </div>

              {/* Queue Sequence Items */}
              <div className="space-y-2 font-mono text-xs">
                
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold">SNP-012</span>
                    <span className="text-[11px] font-sans text-emerald-800">
                      {isHindi ? 'तौल पूर्ण • भुगतान प्रेषित' : 'Weighment Completed'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded font-bold">Done</span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-blue-900">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-blue-700" />
                    <span className="font-bold">SNP-013</span>
                    <span className="text-[11px] font-sans text-blue-800">
                      {isHindi ? 'काउंटर 1 पर तौल जारी' : 'At Weighbridge Counter 1'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-blue-200 px-2 py-0.5 rounded font-bold">Active</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border-2 border-agri-gold flex items-center justify-between text-amber-950 font-bold shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-sm">SNP-014</span>
                    <span className="text-[11px] font-sans text-amber-900">
                      {isHindi ? '👉 आपका टोकन (गेट की ओर बढ़ें)' : '👉 YOUR TOKEN (Approach Gate 2)'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-agri-gold text-agri-green-dark px-2 py-0.5 rounded font-black">
                    Your Turn
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7EE] border border-agri-ivory-muted flex items-center justify-between text-agri-text-muted">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>SNP-015</span>
                    <span className="text-[11px] font-sans">
                      {isHindi ? 'अगला किसान (प्रतीक्षा में)' : 'Next Farmer (Waiting)'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-agri-ivory px-2 py-0.5 rounded">Queued</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. MSP & DIRECT PAYMENT EXPLANATION                                       */}
      {/* ========================================================================= */}
      <section id="msp-payment" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200 font-mono inline-block">
              {isHindi ? 'गारंटीकृत सरकारी एमएसपी' : 'Transparent MSP & DBT Payout'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'पारदर्शी तौल, निश्चित एमएसपी, सीधा बैंक खाता' : 'Accurate weighment, guaranteed MSP, direct bank credit'}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'कोई बिचौलिया नहीं, कोई अनुचित कटौती नहीं। तौल पूरा होते ही पारदर्शी फार्मूले से गणना और सीधा आधार बैंक अंतरण।'
                : 'No middlemen, no arbitrary deductions. Automatic formula calculation and direct DBT release within 24 to 48 hours.'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-agri-ivory-muted shadow-lg space-y-6">
            
            {/* Payment Sequence */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-agri-ivory/50 border border-agri-ivory-muted space-y-1">
                <Scale className="w-5 h-5 text-agri-green mx-auto" />
                <p className="text-xs font-bold text-agri-text">{isHindi ? '1. डिजिटल वजन' : '1. Weighment'}</p>
                <p className="text-[10px] text-agri-text-muted">{isHindi ? 'कांटे पर शुद्ध तौल' : 'Calibrated scales'}</p>
              </div>

              <div className="p-3 rounded-xl bg-agri-ivory/50 border border-agri-ivory-muted space-y-1">
                <CheckCircle2 className="w-5 h-5 text-agri-green mx-auto" />
                <p className="text-xs font-bold text-agri-text">{isHindi ? '2. नमी जांच' : '2. Quality Check'}</p>
                <p className="text-[10px] text-agri-text-muted">{isHindi ? 'मानक नमी (≤17%)' : 'Moisture ≤ 17%'}</p>
              </div>

              <div className="p-3 rounded-xl bg-agri-ivory/50 border border-agri-ivory-muted space-y-1">
                <FileText className="w-5 h-5 text-agri-green mx-auto" />
                <p className="text-xs font-bold text-agri-text">{isHindi ? '3. डिजिटल जे-फॉर्म' : '3. Digital Receipt'}</p>
                <p className="text-[10px] text-agri-text-muted">{isHindi ? 'तुरंत मोबाइल पर रसीद' : 'Instant weight slip'}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <Coins className="w-5 h-5 text-emerald-700 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">{isHindi ? '4. 24–48h DBT' : '4. Direct Credit'}</p>
                <p className="text-[10px] text-emerald-700 font-medium">{isHindi ? 'सीधे बैंक खाते में' : 'Aadhaar bank link'}</p>
              </div>
            </div>

            {/* Transparent Formula Box */}
            <div className="bg-[#17432A] text-white rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-agri-gold uppercase tracking-wider">
                  {isHindi ? 'पारदर्शी एमएसपी गणना उदाहरण' : 'Transparent MSP Calculation Breakdown'}
                </span>
                <span className="text-[10px] bg-white/10 text-agri-ivory px-2 py-0.5 rounded font-mono">
                  Kharif 2026 MSP
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-agri-green-light/20 text-center sm:text-left">
                <div>
                  <span className="text-[10px] text-agri-ivory/70 block">{isHindi ? 'फसल व किस्म' : 'Crop & Variety'}</span>
                  <p className="font-heading font-bold text-sm text-white">{isHindi ? 'धान (ग्रेड ए)' : 'Paddy (Grade A)'}</p>
                  <p className="text-[10px] text-agri-gold font-mono">₹2,200 / Quintal MSP</p>
                </div>

                <div>
                  <span className="text-[10px] text-agri-ivory/70 block">{isHindi ? 'स्वीकृत शुद्ध वजन' : 'Approved Net Weight'}</span>
                  <p className="font-heading font-bold text-sm text-white font-mono">38.50 Quintals</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Moisture: 12.4% (Passed)</p>
                </div>

                <div className="bg-[#123621] p-3 rounded-xl border border-agri-gold/30 text-center">
                  <span className="text-[10px] text-agri-ivory/70 block">{isHindi ? 'कुल देय राशि' : 'Total Direct Payout'}</span>
                  <p className="font-heading font-black text-xl text-agri-gold font-mono">₹84,700</p>
                  <span className="text-[9px] text-emerald-300 font-mono block">Direct Bank Transfer</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. KEY BENEFITS SECTION                                                  */}
      {/* ========================================================================= */}
      <section id="benefits" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-agri-green-soft text-agri-green-dark px-3 py-1 rounded-full border border-agri-green-border font-mono inline-block">
              {isHindi ? 'प्रमुख विशेषताएं' : 'Core Advantages'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'किसानसेतु से किसान व मंडी को होने वाले लाभ' : 'Why KisanSetu changes mandi procurement'}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'समय की बचत, सुगम आवागमन और पारदर्शी भुगतान का आधुनिक डिजिटल प्लेटफॉर्म।'
                : 'A modern, accessible government-backed digital service designed for real agricultural impact.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-agri-green text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-agri-text">
                {isHindi ? '1. शून्य व्यर्थ इंतजार' : '1. Zero Unnecessary Waiting'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'किसान केवल अपनी बारी पर मंडी आते हैं, जिससे घंटों का डीजल और कार्य समय बचता है।'
                  : 'Farmers arrive precisely during their assigned window, saving time and fuel.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-agri-text">
                {isHindi ? '2. निश्चित 30-मिनट आगमन स्लॉट' : '2. Guaranteed 30-Min Windows'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'अपनी सुविधानुसार समय स्लॉट बुक करें और बिना किसी लाइन में धक्का-मुक्की के प्रवेश पाएं।'
                  : 'Pre-book arrival windows to avoid sudden morning gate bottlenecks.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-agri-text">
                {isHindi ? '3. पारदर्शी डिजिटल टोकन पास' : '3. Live Digital Token Tracking'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'फोन पर लाइव देखें कि आपके आगे कितने किसान हैं और आपकी बारी कब आएगी।'
                  : 'Real-time queue tracking from home via SMS and digital pass.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-agri-text">
                {isHindi ? '4. कम भीड़ वाली मंडी का स्मार्ट सुझाव' : '4. Smart Congestion Rerouting'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'यदि मुख्य मंडी में भारी भीड़ हो तो पास की कम व्यस्त मंडी में जाने का 1-क्लिक विकल्प।'
                  : 'Suggestions to nearby low-wait yards when main mandis exceed 85% capacity.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-agri-text">
                {isHindi ? '5. पारदर्शी तौल व गुणवत्ता रसीद' : '5. Tamper-Proof Weighment'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'कांटे पर तौल होते ही फोन पर इलेक्ट्रॉनिक वजन पर्ची प्राप्त होती है।'
                  : 'Calibrated electronic weighbridge records with instant digital receipts.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-agri-ivory-muted space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-agri-text">
                {isHindi ? '6. सीधा बैंक खाते में एमएसपी (DBT)' : '6. Direct 24–48h Bank DBT'}
              </h3>
              <p className="text-xs text-agri-text-muted leading-relaxed">
                {isHindi
                  ? 'सरकारी एमएसपी राशि 24-48 घंटों के भीतर सीधे आधार लिंक बैंक खाते में पहुंचती है।'
                  : 'Direct Benefit Transfer straight to the farmer’s Aadhaar-linked bank account.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. DEDICATED PORTAL SELECTION / AUTH INTEGRATION                         */}
      {/* ========================================================================= */}
      <section id="portals" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7EE] border-b border-agri-ivory-muted">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase bg-agri-green-dark text-agri-gold px-3 py-1 rounded-full border border-agri-gold/40 font-mono inline-block">
              {isHindi ? 'समर्पित पहुंच पोर्टल' : 'Dedicated Access Portals'}
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-agri-text">
              {isHindi ? 'प्रवेश के लिए अपना अधिकृत पोर्टल चुनें' : 'Choose Your Dedicated Auth Portal'}
            </h2>
            <p className="text-xs sm:text-sm text-agri-text-muted leading-relaxed">
              {isHindi
                ? 'किसान, मंडी ऑपरेटर, या विभाग प्रशासक के रूप में सुरक्षित रूप से साइन इन करें।'
                : 'Select your role below to log in or register through the existing authentication gateway.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* 1. FARMER PORTAL */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-lg hover:shadow-xl hover:border-emerald-600 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200 font-mono">
                    /farmer-auth
                  </span>
                  <h3 className="font-heading text-lg font-bold text-agri-text mt-1.5">
                    {isHindi ? 'किसान पोर्टल (Farmer Portal)' : 'Farmer Auth Portal'}
                  </h3>
                  <p className="text-xs text-agri-text-muted leading-relaxed mt-1">
                    {isHindi
                      ? 'मोबाइल नंबर व आधार द्वारा साइन इन या नया पंजीकरण करें। फसल स्लॉट बुक करें व एमएसपी भुगतान ट्रैक करें।'
                      : 'Sign in or register with mobile & Aadhaar. Book crop slots, monitor live queue tokens, and view MSP payouts.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectPortal('farmer-auth')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
              >
                <span>{isHindi ? 'किसान पोर्टल खोलें' : 'Open Farmer Auth Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2. OPERATOR PORTAL */}
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-500/40 shadow-lg hover:shadow-xl hover:border-blue-600 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200 font-mono">
                    /operator-auth
                  </span>
                  <h3 className="font-heading text-lg font-bold text-agri-text mt-1.5">
                    {isHindi ? 'मंडी ऑपरेटर (Operator Portal)' : 'Mandi Operator Auth Portal'}
                  </h3>
                  <p className="text-xs text-agri-text-muted leading-relaxed mt-1">
                    {isHindi
                      ? 'ऑपरेटर स्टाफ आईडी, आवंटित मंडी चयन व गेट पिन द्वारा साइन इन करें। तौल व जांच दर्ज करें।'
                      : 'Log in with Operator Staff ID, assigned Mandi Centre selection, and security Gate PIN for weighbridge processing.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectPortal('operator-auth')}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
              >
                <span>{isHindi ? 'ऑपरेटर पोर्टल खोलें' : 'Open Operator Auth Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3. ADMIN PORTAL */}
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/40 shadow-lg hover:shadow-xl hover:border-amber-600 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded border border-amber-200 font-mono">
                    /admin-auth
                  </span>
                  <h3 className="font-heading text-lg font-bold text-agri-text mt-1.5">
                    {isHindi ? 'विभाग एडमिन (Admin Portal)' : 'DoCA Executive Admin Portal'}
                  </h3>
                  <p className="text-xs text-agri-text-muted leading-relaxed mt-1">
                    {isHindi
                      ? 'आधिकारिक विभाग साख द्वारा साइन इन करें। राज्यव्यापी मंडी क्षमता व एमएसपी डीबीटी प्रेषण नियंत्रित करें।'
                      : 'Executive login with official department email and passcode for state-wide procurement analytics and DBT clearance.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectPortal('admin-auth')}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
              >
                <span>{isHindi ? 'एडमिन पोर्टल खोलें' : 'Open Admin Auth Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FINAL CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#17432A] to-[#245C3A] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-agri-gold text-agri-green-dark flex items-center justify-center mx-auto shadow-lg">
            <Wheat className="w-8 h-8 stroke-[2.2]" />
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {isHindi
              ? 'मंडी में बिना कतार के अपनी फसल बेचने के लिए तैयार हैं?'
              : 'Ready to spend less time waiting at the mandi?'}
          </h2>

          <p className="text-sm sm:text-base text-agri-ivory/90 max-w-xl mx-auto leading-relaxed">
            {isHindi
              ? 'आज ही अपना 30-मिनट का समय स्लॉट बुक करें और पारदर्शी सरकारी खरीद का लाभ उठाएं।'
              : 'Book your procurement slot, get your digital token, and know exactly when it’s time to go.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSelectPortal('farmer-auth')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-sm transition-all shadow-xl flex items-center justify-center space-x-2 touch-target"
            >
              <span>{isHindi ? 'किसान स्लॉट बुक करें' : 'Get Started as Farmer'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scrollToSection('portals')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center space-x-2 touch-target"
            >
              <span>{isHindi ? 'अन्य पोर्टल लॉगिन' : 'Operator / Admin Portals'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. GOVERNMENT COMPLIANT FOOTER                                           */}
      {/* ========================================================================= */}
      <footer className="bg-[#123621] text-agri-ivory/80 text-xs py-10 px-4 sm:px-6 lg:px-8 border-t border-agri-green-light/20">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
            
            {/* Col 1: Brand & Ministry */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold">
                  <Wheat className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="font-heading text-lg font-black text-white">KisanSetu</span>
              </div>
              <p className="text-xs text-agri-ivory/70 leading-relaxed max-w-md">
                Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
              </p>
              <div className="inline-block bg-[#17432A] border border-agri-gold/30 rounded-lg px-3 py-1 text-[11px] text-agri-gold font-mono">
                Smart India Hackathon 2026 • Problem Statement 26032
              </div>
            </div>

            {/* Col 2: National Kisan Helpline */}
            <div className="md:col-span-3 space-y-2">
              <p className="font-heading font-bold text-white text-xs uppercase tracking-wider">
                {isHindi ? 'राष्ट्रीय किसान हेल्पलाइन' : 'Kisan Support & Helpline'}
              </p>
              <p className="text-xs text-agri-ivory/70">
                {isHindi ? 'टोल-फ्री किसान कॉल सेंटर:' : 'National Toll-Free Kisan Call Centre:'}
              </p>
              <div className="flex items-center space-x-2 text-agri-gold font-mono font-bold text-sm">
                <Phone className="w-4 h-4" />
                <span>1800-180-1551</span>
              </div>
              <p className="text-[10px] text-agri-ivory/50">
                {isHindi ? 'प्रातः 6:00 बजे से रात्रि 10:00 बजे तक' : 'Operating 6:00 AM – 10:00 PM (All 7 Days)'}
              </p>
            </div>

            {/* Col 3: Quick Navigation */}
            <div className="md:col-span-3 space-y-2">
              <p className="font-heading font-bold text-white text-xs uppercase tracking-wider">
                {isHindi ? 'त्वरित लिंक' : 'Quick Navigation'}
              </p>
              <ul className="space-y-1.5 text-xs text-agri-ivory/70">
                <li><button onClick={() => scrollToSection('problem')} className="hover:text-white">{isHindi ? 'समस्या' : 'The Problem'}</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white">{isHindi ? 'कार्यप्रणाली' : 'How It Works'}</button></li>
                <li><button onClick={() => scrollToSection('farmer-journey')} className="hover:text-white">{isHindi ? 'किसान यात्रा' : 'Farmer Journey'}</button></li>
                <li><button onClick={() => scrollToSection('smart-recommendation')} className="hover:text-white">{isHindi ? 'स्मार्ट मंडी सुझाव' : 'Smart Recommendation'}</button></li>
                <li><button onClick={() => scrollToSection('portals')} className="hover:text-white">{isHindi ? 'समर्पित पोर्टल लॉगिन' : 'Auth Portals'}</button></li>
              </ul>
            </div>

          </div>

          {/* Copyright & Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-agri-ivory/60 gap-3">
            <p>
              © 2026 Department of Consumer Affairs (DoCA), Govt. of India. All rights reserved.
            </p>
            <p className="font-mono text-[10px]">
              KisanSetu V3.0 • SIH PS 26032
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};
