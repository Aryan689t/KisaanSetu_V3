import React from 'react';
import { Wheat, MapPin, Clock, CheckCircle2, Navigation, ArrowRight, User, Sparkles, QrCode, ShieldCheck, Zap } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useDemo } from '../../context/DemoContext';

export const TokenDisplay = ({ booking, onLiveQueueClick }) => {
  const { centres, lang, queueItems } = useDemo();
  const [showDetails, setShowDetails] = React.useState(false);

  if (!booking) return null;

  const currentCentre = centres.find(c => c.id === booking.centreId) || centres.find(c => c.name === booking.centreName) || centres[0];
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentCentre.lat || 28.9931},${currentCentre.lng || 77.0151}`;

  const youTokenIndex = queueItems ? queueItems.findIndex(q => q.token === booking.token) : -1;
  const farmersAhead = youTokenIndex >= 0 ? Math.max(0, youTokenIndex) : 3;
  const isAdvanceBooking = booking.bookingType !== 'WALK_IN';

  return (
    <div className="bg-gradient-to-b from-[#113822] via-[#0e2f1c] to-[#0a2315] text-white rounded-3xl border-2 border-agri-gold/50 p-5 sm:p-6 shadow-xl space-y-4 font-sans relative overflow-hidden">
      
      {/* Decorative Green Channel VIP Background Glow */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-agri-gold/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Pass Header: Green Channel Badge */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-black text-xs shadow-md font-mono border border-agri-gold-light/40">
            VIP
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-black tracking-widest text-agri-gold uppercase font-mono bg-agri-gold/20 px-2 py-0.5 rounded border border-agri-gold/30 inline-flex items-center space-x-1">
                <Zap className="w-3 h-3 text-agri-gold fill-agri-gold" />
                <span>EXPRESS PASS • GREEN CHANNEL</span>
              </span>
            </div>
            <p className="text-xs text-agri-ivory font-bold mt-0.5">
              {booking.farmerName?.replace(' (YOU)', '') || 'Farmer Ramesh Singh'}
            </p>
          </div>
        </div>
        <StatusBadge status={booking.status} type="queue" />
      </div>

      {/* Express Pass Body: Large Token + QR Code */}
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-agri-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Token Number & Details */}
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block font-mono">
            {lang === 'hi' ? 'प्राथमिकता टोकन संख्या' : 'PRIORITY ADVANCE TOKEN'}
          </span>
          <div className="font-heading font-black text-4xl sm:text-5xl text-agri-gold font-mono tracking-tight">
            {booking.token}
          </div>
          <p className="text-xs text-agri-ivory/80 font-medium">
            {booking.centreName || currentCentre.name} • <span className="font-mono text-agri-gold">{booking.slotTime || '11:00 AM – 11:30 AM'}</span>
          </p>
          <span className="inline-block text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-mono">
            Gate 1 Priority Fast-Lane Access
          </span>
        </div>

        {/* QR Code Placeholder Graphic */}
        <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border-2 border-agri-gold/50 shadow-inner shrink-0">
          {/* Custom SVG QR Code Placeholder */}
          <svg className="w-24 h-24 text-agri-green-dark" viewBox="0 0 100 100" fill="currentColor">
            {/* Top-Left Finder */}
            <rect x="10" y="10" width="28" height="28" rx="4" />
            <rect x="16" y="16" width="16" height="16" fill="white" />
            <rect x="20" y="20" width="8" height="8" />
            
            {/* Top-Right Finder */}
            <rect x="62" y="10" width="28" height="28" rx="4" />
            <rect x="68" y="16" width="16" height="16" fill="white" />
            <rect x="72" y="20" width="8" height="8" />
            
            {/* Bottom-Left Finder */}
            <rect x="10" y="62" width="28" height="28" rx="4" />
            <rect x="16" y="68" width="16" height="16" fill="white" />
            <rect x="20" y="72" width="8" height="8" />
            
            {/* Center Data Modules */}
            <rect x="44" y="12" width="10" height="6" />
            <rect x="44" y="24" width="6" height="14" />
            <rect x="12" y="44" width="8" height="8" />
            <rect x="26" y="44" width="12" height="6" />
            <rect x="44" y="44" width="12" height="12" fill="#D97706" />
            <rect x="62" y="44" width="14" height="8" />
            <rect x="80" y="44" width="8" height="12" />
            <rect x="44" y="62" width="8" height="14" />
            <rect x="58" y="62" width="12" height="6" />
            <rect x="76" y="62" width="12" height="12" />
            <rect x="44" y="82" width="14" height="6" />
            <rect x="64" y="78" width="8" height="10" />
          </svg>
          <span className="text-[9px] font-black font-mono text-agri-green-dark tracking-wider uppercase mt-1">
            SCAN AT GATE 1
          </span>
        </div>

      </div>

      {/* Primary Queue Stats */}
      <div className="grid grid-cols-2 gap-3 text-center relative z-10">
        <div className="bg-[#123621] p-3 rounded-2xl border border-white/10">
          <span className="text-[11px] text-agri-ivory/80 block">{lang === 'hi' ? 'आगे किसान' : 'Farmers Ahead'}</span>
          <p className="font-heading text-xl font-black text-white font-mono mt-0.5">
            {booking.status === 'COMPLETED' ? '0' : (lang === 'hi' ? `${farmersAhead} किसान` : `${farmersAhead} farmers`)}
          </p>
        </div>
        <div className="bg-[#123621] p-3 rounded-2xl border border-white/10">
          <span className="text-[11px] text-agri-ivory/80 block">{lang === 'hi' ? 'अनुमानित समय' : 'Estimated Wait'}</span>
          <p className="font-heading text-xl font-black text-agri-gold font-mono mt-0.5">
            {booking.status === 'COMPLETED' ? '0 min' : `~${currentCentre.estWaitMinutes || 24} min`}
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 relative z-10">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-1.5 transition-colors touch-target min-h-[44px]"
        >
          <Navigation className="w-4 h-4 text-agri-gold" />
          <span>📍 {lang === 'hi' ? 'रास्ता देखें' : 'Get Directions'}</span>
        </a>

        {onLiveQueueClick ? (
          <button
            onClick={onLiveQueueClick}
            className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-black px-4 py-3 rounded-xl text-xs transition-all shadow-md inline-flex items-center justify-center space-x-1.5 touch-target min-h-[44px] cursor-pointer"
          >
            <Clock className="w-4 h-4 text-agri-green-dark" />
            <span>⏱ {lang === 'hi' ? 'अपनी बारी देखें' : 'Track Express Queue'}</span>
          </button>
        ) : (
          <div className="bg-emerald-900/60 text-emerald-200 text-xs font-bold px-3 py-3 rounded-xl border border-emerald-500/40 text-center flex items-center justify-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'hi' ? 'ग्रीन चैनल पास सक्रिय है' : 'Green Channel Active'}</span>
          </div>
        )}
      </div>

      {/* Secondary Booking Details Toggle */}
      <div className="border-t border-white/10 pt-2.5 relative z-10">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-agri-gold hover:text-agri-gold-light flex items-center justify-between w-full touch-target min-h-[36px]"
        >
          <span>{lang === 'hi' ? 'बुकिंग व वाहन विवरण देखें' : 'View pass specifications & slot details'}</span>
          <span>{showDetails ? '▲' : '▾'}</span>
        </button>

        {showDetails && (
          <div className="mt-2.5 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-2 text-agri-ivory animate-in fade-in duration-200">
            <div className="flex justify-between">
              <span className="text-agri-ivory/70">{lang === 'hi' ? 'फसल' : 'Crop'}:</span>
              <strong className="font-bold text-white">{booking.crop || 'Paddy (Grade A)'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-agri-ivory/70">{lang === 'hi' ? 'अनुमानित वजन' : 'Expected Tonnage'}:</span>
              <strong className="font-bold text-white font-mono">{booking.expectedQty || 40} Quintals</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-agri-ivory/70">{lang === 'hi' ? 'काउंटर' : 'Assigned Station'}:</span>
              <strong className="font-bold font-mono text-agri-gold">{booking.counter || 'Counter 2 (Main Scale)'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-agri-ivory/70">{lang === 'hi' ? 'बुकिंग आईडी' : 'Booking ID'}:</span>
              <strong className="font-mono text-[11px] text-emerald-300">{booking.bookingId || 'BK-2026-8812'}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/10">
              <span className="text-agri-ivory/70">{lang === 'hi' ? 'मंडी का पता' : 'Address'}:</span>
              <span className="text-right text-[11px] text-white font-medium">{currentCentre.address}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
