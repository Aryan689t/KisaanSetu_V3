import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Volume2, CheckCircle2, UserCheck, Cpu, ShieldCheck, ArrowRight, X } from 'lucide-react';

export const OnboardingModal = () => {
  const { lang, setLang, isAudioActive, setIsAudioActive, setActiveRole, isOnboardingOpen, setIsOnboardingOpen, speakText } = useDemo();
  const [step, setStep] = useState(1);

  if (!isOnboardingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] text-agri-text w-full max-w-md rounded-2xl border-2 border-agri-gold shadow-2xl p-6 relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOnboardingOpen(false)}
          className="absolute top-4 right-4 p-2 text-agri-text-muted hover:text-agri-text rounded-full hover:bg-agri-ivory"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center space-x-2 text-xs font-bold text-agri-green">
          <span className="w-6 h-6 rounded-full bg-agri-green text-white flex items-center justify-center font-mono">
            {step}
          </span>
          <span>{step === 1 ? 'Step 1: Language / भाषा चुनें' : 'Step 2: Account Role / खाता चुनें'}</span>
        </div>

        {/* STEP 1: CHOOSE LANGUAGE */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="font-heading text-2xl font-bold text-agri-green">
                Namaste! Welcome to KisanSetu
              </h2>
              <p className="text-sm text-agri-text-muted">
                अपनी भाषा का चयन करें / Choose your preferred language
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setLang('hi');
                  speakText('हिंदी भाषा चुनी गई है।', 'Hindi language selected.');
                }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  lang === 'hi'
                    ? 'border-agri-green bg-agri-green-soft text-agri-green-dark font-extrabold shadow-sm'
                    : 'border-agri-ivory-muted bg-white text-agri-text hover:border-agri-gold'
                }`}
              >
                <span className="text-2xl block mb-1">🇮🇳</span>
                <span className="text-base font-bold">हिंदी</span>
                <span className="text-[11px] block text-agri-text-muted mt-0.5">Hindi</span>
              </button>

              <button
                onClick={() => {
                  setLang('en');
                  speakText('English language selected.', 'English language selected.');
                }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  lang === 'en'
                    ? 'border-agri-green bg-agri-green-soft text-agri-green-dark font-extrabold shadow-sm'
                    : 'border-agri-ivory-muted bg-white text-agri-text hover:border-agri-gold'
                }`}
              >
                <span className="text-2xl block mb-1">🌐</span>
                <span className="text-base font-bold">English</span>
                <span className="text-[11px] block text-agri-text-muted mt-0.5">अंग्रेज़ी</span>
              </button>
            </div>

            {/* Audio Assistance Toggle */}
            <div className="p-3.5 rounded-xl bg-agri-ivory border border-agri-gold/40 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <Volume2 className="w-5 h-5 text-agri-gold-dark shrink-0" />
                <div className="text-xs">
                  <strong className="font-bold block text-agri-text">
                    {lang === 'hi' ? 'बोलकर सहायता (Audio Assistance)' : 'Voice Audio Assistance'}
                  </strong>
                  <span className="text-agri-text-muted text-[11px]">
                    {lang === 'hi' ? 'ज़रूरी निर्देश बोलकर सुनाए जाएंगे' : 'Read important prompts out loud'}
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={isAudioActive}
                onChange={(e) => {
                  setIsAudioActive(e.target.checked);
                  if (e.target.checked) speakText('आवाज से सहायता चालू की गई है', 'Voice audio guidance activated');
                }}
                className="w-5 h-5 accent-agri-green rounded"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md touch-target min-h-[48px]"
            >
              <span>{lang === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: CHOOSE ROLE */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="font-heading text-xl font-bold text-agri-green">
                {lang === 'hi' ? 'खाता प्रकार चुनें' : 'Select Account Type'}
              </h2>
              <p className="text-xs text-agri-text-muted">
                {lang === 'hi' ? 'किसान सुविधा मुख्य अनुभव है' : 'Farmer is the primary service experience'}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setActiveRole('farmer');
                  setIsOnboardingOpen(false);
                }}
                className="w-full p-3.5 rounded-xl border-2 border-agri-green bg-agri-green-soft text-left flex items-center justify-between hover:bg-agri-green/10 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-agri-green text-white flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="font-bold text-agri-green-dark text-sm block">
                      👨‍🌾 {lang === 'hi' ? 'किसान (Farmer)' : 'Farmer'}
                    </strong>
                    <span className="text-xs text-agri-text-muted">
                      {lang === 'hi' ? 'टोकन, लाइव कतार और भुगतान' : 'Token, queue status, payments'}
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-agri-green shrink-0" />
              </button>

              <button
                onClick={() => {
                  setActiveRole('operator');
                  setIsOnboardingOpen(false);
                }}
                className="w-full p-3.5 rounded-xl border border-agri-ivory-muted bg-white text-left flex items-center justify-between hover:border-agri-gold transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-agri-ivory text-agri-green flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="font-bold text-agri-text text-sm block">
                      🏢 {lang === 'hi' ? 'मंडी ऑपरेटर (Operator)' : 'Mandi Operator'}
                    </strong>
                    <span className="text-xs text-agri-text-muted">Gate entry & weighment desk</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveRole('admin');
                  setIsOnboardingOpen(false);
                }}
                className="w-full p-3.5 rounded-xl border border-agri-ivory-muted bg-white text-left flex items-center justify-between hover:border-agri-gold transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-agri-ivory text-agri-green flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="font-bold text-agri-text text-sm block">
                      📊 {lang === 'hi' ? 'राज्य प्रशासन (Admin)' : 'State Supervisor'}
                    </strong>
                    <span className="text-xs text-agri-text-muted">DoCA telemetry dashboard</span>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                setActiveRole('farmer');
                setIsOnboardingOpen(false);
              }}
              className="w-full bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold py-3.5 rounded-xl transition-all shadow-sm touch-target min-h-[48px]"
            >
              {lang === 'hi' ? 'किसान ऐप शुरू करें' : 'Start Farmer App'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
