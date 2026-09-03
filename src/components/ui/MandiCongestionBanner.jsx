import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { AlertTriangle, ArrowRight } from 'lucide-react';

/**
 * Compact, non-intrusive Mandi Congestion Advisory Banner
 * Used across secondary farmer pages (Token Pass, Payments & History)
 */
export const MandiCongestionBanner = () => {
  const { demoCondition, centres, setFarmerTab, lang } = useDemo();

  const isCongestionActive = demoCondition === 'CONGESTED_SONIPAT';
  const congestedCentre = isCongestionActive ? (centres.find(c => c.id === 'cnt-sonipat') || centres[0]) : null;

  if (!isCongestionActive || !congestedCentre) return null;

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 sm:p-3.5 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center space-x-2.5">
        <div className="p-1.5 bg-amber-200/80 rounded-xl shrink-0 text-amber-800">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-extrabold mr-1">
            {lang === 'hi' ? 'मंडी में भारी भीड़ की चेतावनी:' : 'Mandi Congestion Detected:'}
          </span>
          <span className="text-amber-900">
            {lang === 'hi'
              ? `${congestedCentre.name.split(' ')[0]} में इंतजार समय बढ़कर ~${congestedCentre.estWaitMinutes} मिनट हो गया है।`
              : `${congestedCentre.name.split(' ')[0]} wait time increased to ~${congestedCentre.estWaitMinutes} min.`}
          </span>
        </div>
      </div>

      <button
        onClick={() => setFarmerTab('centres')}
        className="text-xs font-extrabold text-agri-green-dark hover:text-agri-green inline-flex items-center space-x-1 shrink-0 self-start sm:self-auto py-1 px-2.5 rounded-lg hover:bg-amber-100 transition-colors"
      >
        <span>{lang === 'hi' ? 'मंडी विकल्प देखें' : 'View Mandi Options'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
