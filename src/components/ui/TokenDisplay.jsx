import React from 'react';
import { Wheat, MapPin, Clock, CheckCircle2, Navigation, ArrowRight, User } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-2xl border-2 border-agri-green/40 p-4 sm:p-5 shadow-sm space-y-4 font-sans">
      
      {/* Pass Header */}
      <div className="flex items-center justify-between pb-3 border-b border-agri-ivory-muted">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-agri-gold text-agri-green-dark flex items-center justify-center font-extrabold text-xs shadow-sm font-mono">
            DoCA
          </div>
          <div>
            <h4 className="font-heading font-bold text-xs text-agri-green">
              🎫 {lang === 'hi' ? 'डिजिटल मंडी पास' : 'Digital Mandi Pass'}
            </h4>
            <p className="text-[11px] text-agri-text-muted font-sans">
              {booking.farmerName?.replace(' (YOU)', '') || 'Farmer'}
            </p>
          </div>
        </div>
        <StatusBadge status={booking.status} type="queue" />
      </div>

      {/* Large Token Hero */}
      <div className="text-center bg-[#FAF7EE] rounded-xl p-4 border border-agri-gold/40 space-y-1">
        <span className="text-[11px] font-bold text-agri-text-muted block">
          {lang === 'hi' ? 'आपका टोकन नंबर' : 'Your token number'}
        </span>
        <div className="font-heading font-extrabold text-4xl sm:text-5xl text-agri-green font-mono py-0.5">
          {booking.token}
        </div>
        <span className="text-xs text-agri-text-muted block font-medium">
          {booking.centreName || currentCentre.name} • Slot {booking.slotTime || '11:00 AM – 11:30 AM'}
        </span>
      </div>

      {/* Primary Queue Stats */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-agri-ivory/60 p-2.5 rounded-xl border border-agri-ivory-muted">
          <span className="text-[11px] text-agri-text-muted block">{lang === 'hi' ? 'आगे किसान' : 'Farmers ahead'}</span>
          <p className="font-heading text-lg font-extrabold text-agri-text font-mono mt-0.5">
            {booking.status === 'COMPLETED' ? '0' : (lang === 'hi' ? `${farmersAhead} किसान` : `${farmersAhead} farmers`)}
          </p>
        </div>
        <div className="bg-agri-ivory/60 p-2.5 rounded-xl border border-agri-ivory-muted">
          <span className="text-[11px] text-agri-text-muted block">{lang === 'hi' ? 'अनुमानित समय' : 'Estimated wait'}</span>
          <p className="font-heading text-lg font-extrabold text-agri-gold-dark font-mono mt-0.5">
            {booking.status === 'COMPLETED' ? '0 min' : `~${currentCentre.estWaitMinutes || 24} min`}
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-agri-ivory hover:bg-agri-ivory-muted text-agri-green-dark border border-agri-ivory-muted px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-1.5 transition-colors touch-target min-h-[44px]"
        >
          <Navigation className="w-4 h-4 text-agri-green" />
          <span>📍 {lang === 'hi' ? 'रास्ता देखें' : 'Get Directions'}</span>
        </a>

        {onLiveQueueClick ? (
          <button
            onClick={onLiveQueueClick}
            className="bg-agri-green hover:bg-agri-green-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm inline-flex items-center justify-center space-x-1.5 touch-target min-h-[44px]"
          >
            <Clock className="w-4 h-4 text-agri-gold" />
            <span>⏱ {lang === 'hi' ? 'अपनी बारी देखें' : 'Track My Turn'}</span>
          </button>
        ) : (
          <div className="bg-agri-green-soft text-agri-green-dark text-xs font-bold px-3 py-2.5 rounded-xl border border-agri-green-border text-center flex items-center justify-center">
            <span>✓ {lang === 'hi' ? 'पास सक्रिय है' : 'Pass Active'}</span>
          </div>
        )}
      </div>

      {/* Secondary Booking Details Toggle */}
      <div className="border-t border-agri-ivory-muted pt-2.5">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-agri-green hover:text-agri-green-dark flex items-center justify-between w-full touch-target min-h-[36px]"
        >
          <span>{lang === 'hi' ? 'बुकिंग विवरण देखें' : 'View booking details'}</span>
          <span>{showDetails ? '▲' : '▾'}</span>
        </button>

        {showDetails && (
          <div className="mt-2.5 p-3 rounded-xl bg-agri-ivory/60 border border-agri-ivory-muted text-xs space-y-1.5 text-agri-text animate-in fade-in duration-200">
            <div className="flex justify-between">
              <span className="text-agri-text-muted">{lang === 'hi' ? 'फसल' : 'Crop'}:</span>
              <strong className="font-bold">{booking.crop || 'Paddy (Grade A)'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-agri-text-muted">{lang === 'hi' ? 'अनुमानित वजन' : 'Expected Qty'}:</span>
              <strong className="font-bold">{booking.expectedQty || 40} Quintals</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-agri-text-muted">{lang === 'hi' ? 'काउंटर' : 'Assigned Counter'}:</span>
              <strong className="font-bold font-mono">{booking.counter || 'Counter 2'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-agri-text-muted">{lang === 'hi' ? 'बुकिंग आईडी' : 'Booking ID'}:</span>
              <strong className="font-mono text-[11px] text-agri-text-muted">{booking.bookingId || 'BK-2026-8812'}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-agri-ivory-muted">
              <span className="text-agri-text-muted">{lang === 'hi' ? 'मंडी का पता' : 'Address'}:</span>
              <span className="text-right text-[11px] text-agri-text font-medium">{currentCentre.address}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

