import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { FarmerAuth } from '../auth/FarmerAuth';
import { OperatorAuth } from '../auth/OperatorAuth';
import { AdminAuth } from '../auth/AdminAuth';
import { Wheat, UserCheck, Wrench, ShieldCheck, ArrowRight, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';

export const LoginGate = () => {
  const { loginWithRole, lang, setLang } = useDemo();
  const [portalView, setPortalView] = useState(null); // null | 'farmer-auth' | 'operator-auth' | 'admin-auth'

  if (portalView === 'farmer-auth') {
    return <FarmerAuth onBack={() => setPortalView(null)} />;
  }

  if (portalView === 'operator-auth') {
    return <OperatorAuth onBack={() => setPortalView(null)} />;
  }

  if (portalView === 'admin-auth') {
    return <AdminAuth onBack={() => setPortalView(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7EE] flex flex-col justify-between selection:bg-agri-gold/30 font-sans">
      
      {/* Top Bar */}
      <header className="bg-agri-green text-white py-4 px-4 sm:px-8 border-b border-agri-green-dark shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold shadow-sm">
              <Wheat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl font-bold tracking-tight text-white">
                  KisanSetu
                </span>
                <span className="text-[10px] font-bold bg-agri-green-dark text-agri-gold px-2 py-0.5 rounded border border-agri-gold/30 font-mono">
                  DoCA Mandi
                </span>
              </div>
              <p className="text-xs text-agri-ivory/80">
                Department of Consumer Affairs • Direct Crop Procurement Portal
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-agri-green-dark/70 p-1 rounded-xl border border-agri-gold/30">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'en' ? 'bg-agri-gold text-agri-green-dark shadow-sm' : 'text-agri-ivory/80 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'hi' ? 'bg-agri-gold text-agri-green-dark shadow-sm' : 'text-agri-ivory/80 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Portal Selection Gateway */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8 animate-in fade-in duration-300">
        
        {/* Banner Hero */}
        <div className="bg-[#17432A] text-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-agri-gold relative overflow-hidden space-y-4">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase bg-agri-gold/20 text-agri-gold px-3 py-1 rounded-full border border-agri-gold/40 font-mono inline-block">
              🏛️ {lang === 'hi' ? 'भारत सरकार • डायरेक्ट फसल खरीद' : 'Govt. of India • Direct Crop Procurement'}
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {lang === 'hi' 
                ? 'किसानसेतु में आपका स्वागत है: पारदर्शी मंडी स्लॉट व एमएसपी भुगतान' 
                : 'Welcome to KisanSetu: Transparent Mandi Slot Booking & Guaranteed MSP Payouts'}
            </h1>
            <p className="text-xs sm:text-sm text-agri-ivory/90 leading-relaxed">
              {lang === 'hi'
                ? 'मंडी में भीड़ से बचें, 30-मिनट का गारंटीकृत आगमन समय बुक करें, लाइव कतार ट्रैक करें और सीधे अपने बैंक खाते में एमएसपी भुगतान पाएं।'
                : 'Avoid Mandi queue congestion, book guaranteed 30-minute arrival slots, track live tokens in real time, and receive direct MSP bank transfers.'}
            </p>
          </div>

          {/* Key Value Props Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-sans">
            <div className="bg-[#123621] p-3 rounded-xl border border-agri-gold/20 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-agri-gold shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{lang === 'hi' ? '30-मिनट स्लॉट' : '30-Min Slots'}</p>
                <p className="text-[10px] text-agri-ivory/70">{lang === 'hi' ? 'गारंटीकृत समय' : 'Guaranteed window'}</p>
              </div>
            </div>

            <div className="bg-[#123621] p-3 rounded-xl border border-agri-gold/20 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-agri-gold shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{lang === 'hi' ? 'स्मार्ट रिरीउटिंग' : 'Smart Reroute'}</p>
                <p className="text-[10px] text-agri-ivory/70">{lang === 'hi' ? 'भीड़ से बचाव' : 'Avoid heavy backlog'}</p>
              </div>
            </div>

            <div className="bg-[#123621] p-3 rounded-xl border border-agri-gold/20 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-agri-gold shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{lang === 'hi' ? '24-48h DBT' : '24-48h DBT'}</p>
                <p className="text-[10px] text-agri-ivory/70">{lang === 'hi' ? 'सीधा बैंक अंतरण' : 'Direct bank credit'}</p>
              </div>
            </div>

            <div className="bg-[#123621] p-3 rounded-xl border border-agri-gold/20 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-agri-gold shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{lang === 'hi' ? 'एआई सहायक' : 'Groq AI Sahayak'}</p>
                <p className="text-[10px] text-agri-ivory/70">{lang === 'hi' ? 'द्विभाषी गाइड' : 'Bilingual assistant'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* DEDICATED PORTAL SELECTION CARDS */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-agri-text">
              {lang === 'hi' ? 'प्रवेश के लिए अपना समर्पित पोर्टल चुनें' : 'Choose Your Dedicated Auth Portal'}
            </h2>
            <p className="text-xs text-agri-text-muted">
              {lang === 'hi' ? 'किसान, मंडी ऑपरेटर, या विभाग प्रशासक के रूप में साइन इन या पंजीकरण करें' : 'Select Farmer (/farmer-auth), Mandi Operator (/operator-auth), or DoCA Admin (/admin-auth)'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. FARMER PORTAL CARD */}
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-lg hover:shadow-xl hover:border-emerald-600 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200 font-mono">
                    /farmer-auth
                  </span>
                  <h3 className="font-heading text-lg font-bold text-agri-text mt-1">
                    {lang === 'hi' ? 'किसान पोर्टल (Farmer Portal)' : 'Farmer Auth Portal'}
                  </h3>
                  <p className="text-xs text-agri-text-muted leading-relaxed mt-1">
                    {lang === 'hi'
                      ? 'मोबाइल नंबर व आधार द्वारा साइन इन या नया पंजीकरण करें। फसल स्लॉट बुक करें व एमएसपी भुगतान पाएं।'
                      : 'Sign in or register with mobile & Aadhaar. Book crop slots and monitor MSP bank payouts.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPortalView('farmer-auth')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
              >
                <span>{lang === 'hi' ? 'किसान पोर्टल खोलें' : 'Open Farmer Auth Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2. OPERATOR PORTAL CARD */}
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-500/40 shadow-lg hover:shadow-xl hover:border-blue-600 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200 font-mono">
                    /operator-auth
                  </span>
                  <h3 className="font-heading text-lg font-bold text-agri-text mt-1">
                    {lang === 'hi' ? 'मंडी ऑपरेटर (Operator Portal)' : 'Mandi Operator Auth Portal'}
                  </h3>
                  <p className="text-xs text-agri-text-muted leading-relaxed mt-1">
                    {lang === 'hi'
                      ? 'ऑपरेटर आईडी, आवंटित मंडी चयन व गेट पिन द्वारा साइन इन करें। तौल व जांच दर्ज करें।'
                      : 'Log in with Operator Staff ID, assigned Mandi Centre selection, and security Gate PIN.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPortalView('operator-auth')}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
              >
                <span>{lang === 'hi' ? 'ऑपरेटर पोर्टल खोलें' : 'Open Operator Auth Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3. ADMIN PORTAL CARD */}
            <div className="bg-white rounded-2xl p-6 border-2 border-amber-500/40 shadow-lg hover:shadow-xl hover:border-amber-600 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded border border-amber-200 font-mono">
                    /admin-auth
                  </span>
                  <h3 className="font-heading text-lg font-bold text-agri-text mt-1">
                    {lang === 'hi' ? 'विभाग एडमिन (Admin Portal)' : 'DoCA Executive Admin Portal'}
                  </h3>
                  <p className="text-xs text-agri-text-muted leading-relaxed mt-1">
                    {lang === 'hi'
                      ? 'आधिकारिक विभाग साख व पासकोड द्वारा साइन इन करें। राज्यव्यापी मंडी क्षमता व एमएसपी डीबीटी प्रेषण नियंत्रित करें।'
                      : 'Executive login with official department email and passcode for state-wide procurement analytics.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPortalView('admin-auth')}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
              >
                <span>{lang === 'hi' ? 'एडमिन पोर्टल खोलें' : 'Open Admin Auth Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-agri-green-dark text-agri-ivory/80 text-xs py-4 px-4 border-t border-agri-green-light/20 text-center">
        <p className="max-w-7xl mx-auto font-medium">
          © 2026 Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
        </p>
      </footer>

    </div>
  );
};
