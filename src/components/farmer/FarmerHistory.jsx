import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Download, Calculator, Building } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { supabase } from '../../lib/supabaseClient';

export const FarmerHistory = () => {
  const { pastHistory, lang, speakText } = useDemo();
  const [expandedId, setExpandedId] = React.useState(null);
  const [showFormulaHelp, setShowFormulaHelp] = React.useState(false);

  const latestPayment = pastHistory[0] || {
    crop: 'Wheat',
    centre: 'Sonipat Main Procurement Centre',
    totalAmount: 118300,
    bankAccount: 'State Bank of India (****4092)'
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300 font-sans">

      {/* 1. TOP SUMMARY CARD: YOUR PAYMENTS */}
      <div className="bg-[#17432A] text-white rounded-2xl p-5 sm:p-6 shadow-agri-md space-y-4 border-2 border-agri-gold">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              💰 {lang === 'hi' ? 'आपकी भुगतान राशि' : 'Your Payments'}
            </h1>
            <p className="text-xs text-agri-ivory/80 mt-0.5">
              {lang === 'hi' ? 'सीधे आपके बैंक खाते में भेजा गया पैसा' : 'Direct payment credited to your Aadhaar-linked bank account.'}
            </p>
          </div>

          <span className="bg-emerald-900/90 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
            ✅ {lang === 'hi' ? 'भुगतान मिल गया' : 'Payment received'}
          </span>
        </div>

        {/* PROMINENT AMOUNT DISPLAY */}
        <div className="bg-[#102e1c] p-4 sm:p-5 rounded-xl border border-agri-gold/30 text-center space-y-1">
          <span className="text-xs text-agri-ivory/70 block">
            {lang === 'hi' ? 'प्राप्त कुल राशि' : 'Total Amount Received'}
          </span>
          <div className="font-heading font-extrabold text-4xl sm:text-5xl text-agri-gold font-mono tracking-tight py-1">
            ₹{latestPayment.totalAmount.toLocaleString()}
          </div>
          <p className="text-xs font-bold text-white">
            🌾 {latestPayment.crop} • 📍 {latestPayment.centre}
          </p>
        </div>

        {/* Bank Account Callout */}
        <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/15 text-xs text-agri-ivory">
          <div className="flex items-center space-x-2">
            <span className="text-base">🏦</span>
            <div>
              <span className="block font-bold text-white">
                {lang === 'hi' ? 'बैंक खाते में ट्रांसफर' : 'Paid to bank account'}
              </span>
              <span className="text-[11px] text-agri-ivory/70">
                {latestPayment.bankAccount || 'State Bank of India (****4092)'}
              </span>
            </div>
          </div>

          <span className="text-[11px] font-bold text-agri-gold bg-agri-gold/20 px-2.5 py-1 rounded-lg border border-agri-gold/30">
            Aadhaar DBT
          </span>
        </div>
      </div>

      {/* 2. HOW PAYMENT WAS CALCULATED (COLLAPSIBLE HELP) */}
      <div className="bg-white rounded-xl p-3.5 border border-agri-ivory-muted shadow-sm">
        <button
          onClick={() => setShowFormulaHelp(!showFormulaHelp)}
          className="text-xs font-bold text-agri-green hover:text-agri-green-dark flex items-center justify-between w-full touch-target min-h-[36px]"
        >
          <span className="flex items-center space-x-1.5">
            <span>❓</span>
            <span>{lang === 'hi' ? 'भुगतान कैसे तय हुआ?' : 'How was your payment calculated?'}</span>
          </span>
          <span>{showFormulaHelp ? '▲' : '▾'}</span>
        </button>

        {showFormulaHelp && (
          <div className="mt-2.5 p-3 rounded-lg bg-agri-ivory/80 text-xs text-agri-text space-y-1.5 animate-in fade-in duration-200">
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'आपकी भुगतान राशि का हिसाब धर्मकांटे पर तौले गए वास्तविक वजन और सरकार द्वारा तय न्यूनतम समर्थन मूल्य (MSP) के आधार पर बिना किसी बिचौलिया कटौती के सीधा किया जाता है।'
                : 'Your payment is calculated using the verified weighbridge crop weight and government Minimum Support Price (MSP) rate with zero middleman deductions.'}
            </p>
          </div>
        )}
      </div>

      {/* 3. SIMPLIFIED PAYMENT HISTORY RECORDS */}
      <div className="space-y-3">
        <h3 className="font-heading text-base font-bold text-agri-text">
          📜 {lang === 'hi' ? 'भुगतान इतिहास' : 'Payment History'}
        </h3>

        {pastHistory.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-agri-ivory-muted shadow-sm space-y-3 hover:border-agri-green-border transition-all"
            >
              {/* Collapsed State Header */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-heading text-base font-bold text-agri-text">
                      🌾 {item.crop}
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🟢 {lang === 'hi' ? 'भुगतान मिल गया' : 'Payment received'}
                    </span>
                  </div>

                  <p className="text-xs text-agri-text-muted mt-0.5">
                    📍 {item.centre} • 📅 {item.date}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-heading font-extrabold text-lg text-agri-green font-mono block">
                    ₹{item.totalAmount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setExpandedId(isExpanded ? null : item.id);
                      if (!isExpanded) speakText('भुगतान विवरण खोला जा रहा है', 'Opening payment details');
                    }}
                    className="text-xs font-bold text-agri-green hover:underline touch-target min-h-[32px] inline-flex items-center"
                  >
                    <span>{isExpanded ? (lang === 'hi' ? 'छिपाएं ▲' : 'Hide details ▲') : (lang === 'hi' ? 'विवरण देखें ▾' : 'View details ▾')}</span>
                  </button>
                </div>
              </div>

              {/* Expanded Payment Details */}
              {isExpanded && (
                <div className="pt-3 border-t border-agri-ivory-muted space-y-2 text-xs text-agri-text animate-in fade-in duration-200">
                  <h5 className="font-heading font-bold text-xs text-agri-green-dark">
                    📋 {lang === 'hi' ? 'भुगतान की जानकारी' : 'Payment Details'}
                  </h5>

                  <div className="grid grid-cols-2 gap-2 bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
                    <div>
                      <span className="text-[11px] text-agri-text-muted block">{lang === 'hi' ? 'कुल वजन' : 'Quantity'}</span>
                      <strong className="font-bold text-sm font-mono">{item.actualQty} Quintals</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-agri-text-muted block">{lang === 'hi' ? 'एमएसपी दर (MSP)' : 'MSP Rate'}</span>
                      <strong className="font-bold text-sm font-mono">₹{item.ratePerQuintal.toLocaleString()}/Qtl</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-agri-text-muted block">{lang === 'hi' ? 'गुणवत्ता / नमी' : 'Quality & Moisture'}</span>
                      <strong className="font-bold text-xs">{item.qualityGrade || 'Grade A'} ({item.moisturePercent || 12.4}% Moisture)</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-agri-text-muted block">{lang === 'hi' ? 'बैंक खाता' : 'Bank Account'}</span>
                      <strong className="font-bold text-xs">{item.bankAccount || 'SBI (****4092)'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-agri-text-muted pt-1">
                    <span>{lang === 'hi' ? 'भुगतान संदर्भ (DBT Ref):' : 'Payment Reference:'}</span>
                    <span className="font-mono text-agri-text font-bold">{item.dbtReference || 'DBT-UTIB000984210'}</span>
                  </div>

                  <button
                    onClick={() => alert(`Downloading Procurement Receipt ${item.id}`)}
                    className="w-full mt-2 bg-agri-ivory hover:bg-agri-ivory-muted text-agri-green-dark font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-agri-ivory-muted touch-target min-h-[40px]"
                  >
                    <Download className="w-3.5 h-3.5 text-agri-green" />
                    <span>📥 {lang === 'hi' ? 'रसीद डाउनलोड करें (PDF)' : 'Download Receipt (PDF)'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

