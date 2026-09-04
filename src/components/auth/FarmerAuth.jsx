import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Wheat, Phone, ShieldCheck, User, Lock, ArrowRight, ArrowLeft, CheckCircle2, Globe, AlertCircle } from 'lucide-react';
import { sanitizeMobile, isValidMobile, sanitizePersonName, isValidPersonName, sanitizeAadhaarLast4, isValidAadhaarLast4 } from '../../lib/validation';

export const FarmerAuth = ({ onBack }) => {
  const { loginWithRole, lang, setLang, t } = useDemo();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [mobile, setMobile] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Sonipat, Haryana');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Mobile Number Validation
    if (!isValidMobile(mobile)) {
      setErrorMsg(lang === 'hi' ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें (शुरुआत 6-9 से)।' : 'Please enter a valid 10-digit mobile number (starting with 6-9).');
      return;
    }

    // 2. Full Name Validation (when registering)
    if (isRegisterMode && !isValidPersonName(fullName)) {
      setErrorMsg(lang === 'hi' ? 'कृपया केवल अक्षरों में सही नाम दर्ज करें (2 से 60 अक्षर)।' : 'Please enter a valid person name containing only letters and spaces.');
      return;
    }

    // 3. Aadhaar Last 4 Digits Validation
    if (aadhaarLast4 && !isValidAadhaarLast4(aadhaarLast4)) {
      setErrorMsg(lang === 'hi' ? 'कृपया आधार के अंतिम 4 अंक सही दर्ज करें।' : 'Please enter valid 4 digits of Aadhaar.');
      return;
    }

    const userEmail = mobile ? `${mobile}@kisansetu.gov.in` : 'farmer@kisansetu.gov.in';
    const data = isRegisterMode ? {
      fullName: fullName.trim() || 'Farmer',
      mobile: mobile.trim(),
      aadhaarLast4: aadhaarLast4.trim() || '4092',
      district: district.trim()
    } : {
      mobile: mobile.trim(),
      aadhaarLast4: aadhaarLast4.trim() || '4092',
      district: district.trim()
    };
    loginWithRole('farmer', userEmail, data);
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] flex flex-col justify-between font-sans selection:bg-agri-gold/30">
      
      {/* Header */}
      <header className="bg-agri-green text-white py-4 px-4 sm:px-8 border-b border-agri-green-dark shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-agri-green-dark hover:bg-agri-green-dark/80 text-white transition-colors mr-1"
                title="Back to Portal Selection"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold">
              <Wheat className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                KisanSetu • {lang === 'hi' ? 'किसान पोर्टल' : 'Farmer Portal'}
              </span>
              <span className="text-[10px] text-agri-ivory/80">
                Department of Consumer Affairs • Direct Procurement
              </span>
            </div>
          </div>

          {/* Bilingual Switcher */}
          <div className="flex items-center bg-agri-green-dark p-1 rounded-xl border border-agri-gold/30">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'en' ? 'bg-agri-gold text-agri-green-dark shadow-sm' : 'text-agri-ivory hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === 'hi' ? 'bg-agri-gold text-agri-green-dark shadow-sm' : 'text-agri-ivory hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-8 flex-1 w-full flex flex-col justify-center space-y-6 animate-in fade-in duration-300">
        
        {/* Portal Title Banner */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-sm border border-emerald-200">
            <Wheat className="w-8 h-8 text-emerald-700" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-agri-text">
            {isRegisterMode 
              ? (lang === 'hi' ? 'नया किसान पंजीकरण' : 'Farmer Registration')
              : (lang === 'hi' ? 'किसान खाता प्रवेश' : 'Farmer Portal Login')}
          </h1>
          <p className="text-xs text-agri-text-muted">
            {lang === 'hi'
              ? 'फसल स्लॉट बुक करें, टोकन ट्रैक करें व एमएसपी बैंक भुगतान प्राप्त करें'
              : 'Book Mandi slots, track token queue, & manage MSP bank payouts'}
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-xl space-y-5 relative">
          
          {/* Mode Switcher Pills */}
          <div className="flex bg-agri-ivory p-1 rounded-xl border border-agri-ivory-muted text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsRegisterMode(false)}
              className={`flex-1 py-2 rounded-lg transition-all text-center ${
                !isRegisterMode ? 'bg-emerald-700 text-white shadow-sm' : 'text-agri-text-muted hover:text-agri-text'
              }`}
            >
              {lang === 'hi' ? 'साइन इन करें' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterMode(true)}
              className={`flex-1 py-2 rounded-lg transition-all text-center ${
                isRegisterMode ? 'bg-emerald-700 text-white shadow-sm' : 'text-agri-text-muted hover:text-agri-text'
              }`}
            >
              {lang === 'hi' ? 'नया पंजीकरण' : 'Register'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}
            
            {/* Full Name (Only on Registration) */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  {lang === 'hi' ? 'पूरा नाम (केवल अक्षर)' : 'Full Name (Letters only)'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={fullName}
                    onChange={(e) => {
                      setFullName(sanitizePersonName(e.target.value));
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Ramesh Singh"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर (10 अंक)' : 'Mobile Number (10 digits)'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(sanitizeMobile(e.target.value));
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                />
              </div>
            </div>

            {/* Aadhaar Last 4 Digits */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                {lang === 'hi' ? 'आधार कार्ड अंतिम 4 अंक' : 'Aadhaar Last 4 Digits'}
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  value={aadhaarLast4}
                  onChange={(e) => {
                    setAadhaarLast4(sanitizeAadhaarLast4(e.target.value));
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="4092"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                />
              </div>
            </div>

            {/* District / State */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1">
                  {lang === 'hi' ? 'जिला व राज्य' : 'District & State'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Sonipat, Haryana"
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                {lang === 'hi' ? 'पासवर्ड / सुरक्षा पिन' : 'Password / Security PIN'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
            >
              <span>
                {isRegisterMode
                  ? (lang === 'hi' ? 'पंजीकरण पूर्ण करें व प्रवेश करें' : 'Complete Registration & Sign In')
                  : (lang === 'hi' ? 'किसान पोर्टल में प्रवेश करें' : 'Sign In to Farmer Portal')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Notice */}
          <div className="pt-2 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={() => loginWithRole('farmer')}
              className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center space-x-1"
            >
              <span>⚡ {lang === 'hi' ? 'त्वरित डेमो किसान प्रवेश (Ramesh Singh)' : 'Quick Demo Access (Ramesh Singh)'}</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-agri-text-muted py-4">
        © 2026 Department of Consumer Affairs • Direct Farmer Procurement
      </footer>

    </div>
  );
};

export default FarmerAuth;
