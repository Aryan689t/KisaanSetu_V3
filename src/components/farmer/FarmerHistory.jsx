import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Download } from 'lucide-react';
import { MandiCongestionBanner } from '../ui/MandiCongestionBanner';

export const FarmerHistory = () => {
  const { pastHistory = [], lang } = useDemo();
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300 font-sans">

      {/* COMPACT CONGESTION ADVISORY BANNER (Visible only during active congestion) */}
      <MandiCongestionBanner />

      {/* PAGE HEADER */}
      <div className="pb-2 border-b border-agri-ivory-muted">
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-agri-text">
          {lang === 'hi' ? 'भुगतान और इतिहास' : 'Payments & History'}
        </h1>
        <p className="text-xs sm:text-sm text-agri-text-muted mt-0.5">
          {lang === 'hi'
            ? 'अपनी पूर्ण सरकारी खरीद का भुगतान और डीबीटी लेनदेन देखें।'
            : 'View your completed procurement payments and DBT transactions.'}
        </p>
      </div>

      {/* PAYMENT HISTORY RECORDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-agri-text">
            {lang === 'hi' ? 'भुगतान इतिहास' : 'Payment History'}
          </h2>
          <span className="text-xs font-mono font-medium text-agri-text-muted">
            {pastHistory.length} {lang === 'hi' ? 'लेनदेन' : 'records'}
          </span>
        </div>

        {pastHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-agri-ivory-muted shadow-sm text-center space-y-2">
            <p className="text-sm font-semibold text-agri-text">
              {lang === 'hi' ? 'कोई पिछला भुगतान रिकॉर्ड नहीं मिला' : 'No payment records found'}
            </p>
            <p className="text-xs text-agri-text-muted">
              {lang === 'hi'
                ? 'सरकारी खरीद पूरी होने के बाद आपके डीबीटी भुगतान का विवरण यहाँ दिखाई देगा।'
                : 'Completed procurement payouts and DBT receipts will appear here.'}
            </p>
          </div>
        ) : (
          pastHistory.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-agri-ivory-muted shadow-sm space-y-3 hover:border-agri-green-border transition-all"
              >
                {/* Transaction Header / Summary */}
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="font-heading text-base font-bold text-agri-text">
                        {item.crop}
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {lang === 'hi' ? 'भुगतान मिल गया' : 'Payment received'}
                      </span>
                    </div>

                    <p className="text-xs text-agri-text-muted">
                      {item.centre} • {item.date}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-agri-green font-mono block">
                      ₹{Number(item.totalAmount).toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        setExpandedId(isExpanded ? null : item.id);
                      }}
                      className="text-xs font-bold text-agri-green hover:underline touch-target min-h-[32px] inline-flex items-center"
                    >
                      <span>
                        {isExpanded 
                          ? (lang === 'hi' ? 'छिपाएं ▲' : 'Hide details ▲') 
                          : (lang === 'hi' ? 'विवरण देखें ▾' : 'View details ▾')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expanded Payment Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-agri-ivory-muted space-y-2 text-xs text-agri-text animate-in fade-in duration-200">
                    <h4 className="font-heading font-bold text-xs text-agri-green-dark">
                      {lang === 'hi' ? 'भुगतान की जानकारी' : 'Payment Details'}
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
                      <div>
                        <span className="text-[11px] text-agri-text-muted block">{lang === 'hi' ? 'कुल वजन' : 'Quantity'}</span>
                        <strong className="font-bold text-sm font-mono">{item.actualQty} Quintals</strong>
                      </div>

                      <div>
                        <span className="text-[11px] text-agri-text-muted block">{lang === 'hi' ? 'एमएसपी दर (MSP)' : 'MSP Rate'}</span>
                        <strong className="font-bold text-sm font-mono">₹{Number(item.ratePerQuintal).toLocaleString()}/Qtl</strong>
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

                    <div className="flex items-center justify-between text-[11px] text-agri-text-muted pt-1 flex-wrap gap-1">
                      <span>{lang === 'hi' ? 'भुगतान संदर्भ (DBT Ref):' : 'Payment Reference:'}</span>
                      <span className="font-mono text-agri-text font-bold">{item.dbtReference || 'DBT-UTIB000984210'}</span>
                    </div>

                    <button
                      onClick={() => alert(`Downloading Procurement Receipt ${item.id}`)}
                      className="w-full mt-2 bg-agri-ivory hover:bg-agri-ivory-muted text-agri-green-dark font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-agri-ivory-muted touch-target min-h-[40px] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-agri-green" />
                      <span>{lang === 'hi' ? 'रसीद डाउनलोड करें (PDF)' : 'Download Receipt (PDF)'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
