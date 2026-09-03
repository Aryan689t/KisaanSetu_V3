import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { CheckCircle2, RefreshCw, Navigation } from 'lucide-react';
import { fetchQueuePosition } from '../../lib/apiService';
import { MandiCongestionBanner } from '../ui/MandiCongestionBanner';

export const LiveQueueTracker = () => {
  const { queueItems, activeBooking, farmerBookings = [], selectActiveBooking, lang, centres } = useDemo();
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [livePosition, setLivePosition] = useState(null);
  const [isRefreshingQueue, setIsRefreshingQueue] = useState(false);

  const currentCentre = centres.find(c => c.id === activeBooking?.centreId) || centres[0];
  const youTokenIndex = queueItems.findIndex(q => q.token === activeBooking?.token);
  
  // Real backend queue position query with graceful fallback
  const loadQueuePosition = async () => {
    if (!activeBooking?.token || !currentCentre?.id) return;
    setIsRefreshingQueue(true);
    try {
      const res = await fetchQueuePosition(currentCentre.id, activeBooking.token);
      if (res?.success && res?.data) {
        setLivePosition(res.data);
      }
    } catch (err) {
      console.debug('[LiveQueueTracker] Live position API sync:', err.message);
    } finally {
      setIsRefreshingQueue(false);
    }
  };

  useEffect(() => {
    loadQueuePosition();
  }, [activeBooking?.token, currentCentre?.id, queueItems]);

  const farmersAheadCount = livePosition?.farmersAhead != null
    ? livePosition.farmersAhead
    : Math.max(0, youTokenIndex);

  const estWaitMins = livePosition?.estWaitMinutes != null
    ? livePosition.estWaitMinutes
    : Math.max(8, farmersAheadCount * 8);

  const isCompleted = activeBooking?.status === 'COMPLETED';
  const isDisbursed = activeBooking?.paymentStatus === 'DISBURSED';
  const isProcessing = activeBooking?.status === 'PROCESSING';
  const isCheckedIn = activeBooking?.status === 'CHECKED_IN';

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* COMPACT CONGESTION ADVISORY BANNER */}
      <MandiCongestionBanner />

      {/* MULTIPLE BOOKINGS SELECTOR (IF FARMER HAS > 1 BOOKING) */}
      {farmerBookings.length > 1 && (
        <div className="bg-white p-3 rounded-2xl border border-agri-ivory-muted shadow-sm flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-agri-text">
            {lang === 'hi' ? 'आपके टोकन पास:' : 'Your Active Token Passes:'}
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {farmerBookings.map((b) => {
              const isActive = b.token === activeBooking?.token;
              return (
                <button
                  key={b.token}
                  onClick={() => selectActiveBooking(b.token)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-agri-green text-white shadow-sm ring-2 ring-agri-gold'
                      : 'bg-agri-ivory text-agri-text hover:bg-agri-ivory-muted border border-agri-ivory-muted'
                  }`}
                >
                  <span>{b.token}</span>
                  <span className="text-[10px] opacity-90">({b.status})</span>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-agri-gold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. PRIMARY FARMER TOKEN & TURN HERO CARD */}
      <div className="bg-[#17432A] text-white rounded-2xl p-5 sm:p-6 shadow-agri-md relative space-y-4">

        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-agri-gold bg-agri-gold/20 px-2.5 py-0.5 rounded-full border border-agri-gold/30 font-mono inline-block">
                {lang === 'hi' ? 'आपकी बारी' : 'YOUR TURN'}
              </span>
              {livePosition && (
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  Live DB Sync
                </span>
              )}
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
              {lang === 'hi' ? 'लाइव कतार ट्रैक करें' : 'Live Queue Tracker'}
            </h1>
          </div>

          <div className="text-right flex items-center space-x-2">
            <div>
              <span className="text-[10px] text-agri-ivory/70 block">{lang === 'hi' ? 'टोकन नंबर' : 'Token'}</span>
              <span className="font-heading font-extrabold text-3xl text-agri-gold font-mono">
                {activeBooking?.token || 'SNP-014'}
              </span>
            </div>
            <button
              onClick={loadQueuePosition}
              disabled={isRefreshingQueue}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-agri-ivory transition-all self-end"
              title="Refresh queue telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingQueue ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div className="bg-[#102e1c] p-4 rounded-xl border border-agri-gold/30 space-y-3 font-sans">

          {/* WAITING State */}
          {activeBooking?.status === 'WAITING' && (
            <div className="space-y-3 text-amber-100">
              <div className="flex items-center space-x-2">
                <strong className="font-bold text-base text-agri-gold">
                  {lang === 'hi' ? 'अपनी बारी का इंतज़ार करें' : 'Waiting for your turn'}
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-[#17432A] p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-agri-ivory/80 block">{lang === 'hi' ? 'आगे किसान' : 'Farmers ahead'}</span>
                  <p className="font-heading text-xl font-extrabold text-white font-mono mt-0.5">
                    {farmersAheadCount}
                  </p>
                </div>
                <div className="bg-[#17432A] p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-agri-ivory/80 block">{lang === 'hi' ? 'अनुमानित समय' : 'Estimated wait'}</span>
                  <p className="font-heading text-xl font-extrabold text-agri-gold font-mono mt-0.5">
                    ~{estWaitMins} min
                  </p>
                </div>
              </div>

              <p className="text-xs text-agri-ivory/90 text-center">
                {lang === 'hi'
                  ? 'कृपया अपने टोकन नंबर की बारी का इंतज़ार करें। मंडी परिसर में ही रहें।'
                  : 'Please wait for your token to be called. Stay near the mandi yard.'}
              </p>
            </div>
          )}

          {/* CHECKED_IN State */}
          {isCheckedIn && (
            <div className="space-y-2 text-blue-100">
              <div className="flex items-center space-x-2">
                <strong className="font-bold text-base text-white">
                  {lang === 'hi' ? 'गेट चेक-इन पूरा हुआ' : 'Gate Check-in Verified'}
                </strong>
              </div>
              <p className="text-xs text-blue-100/90">
                {lang === 'hi'
                  ? 'गेट पर सत्यापन पूरा हो गया है। कृपया काउंटर 2 के पास रहें।'
                  : 'Check-in verified at entry gate. Please stay near Counter 2.'}
              </p>
            </div>
          )}

          {/* PROCESSING State */}
          {isProcessing && (
            <div className="space-y-2 text-agri-green-dark bg-agri-gold p-3.5 rounded-xl">
              <div className="flex items-center space-x-2">
                <strong className="font-extrabold text-base">
                  {lang === 'hi' ? 'आपकी बारी आ गई है!' : 'YOUR TURN HAS ARRIVED!'}
                </strong>
              </div>
              <p className="text-xs font-semibold text-agri-green-dark">
                {lang === 'hi'
                  ? 'टोकन SNP-014: कृपया तुरंत काउंटर 2 पर तौल के लिए जाएं।'
                  : 'Token SNP-014: Proceed immediately to Counter 2 for crop inspection.'}
              </p>
            </div>
          )}

          {/* COMPLETED State */}
          {isCompleted && (
            <div className="space-y-2 text-emerald-100">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <strong className="font-bold text-base text-white">
                  {lang === 'hi' ? 'फसल तौल दर्ज हो गया है' : 'Procurement Logged'}
                </strong>
              </div>
              <p className="text-xs text-emerald-100/90">
                {lang === 'hi'
                  ? `वजन: ${activeBooking?.actualQty || 38.5} क्विंटल। बैंक DBT भुगतान प्रक्रिया में है।`
                  : `Weighed: ${activeBooking?.actualQty || 38.5} Qtl. Payout ₹${((activeBooking?.actualQty || 38.5) * 2200).toLocaleString()} via bank DBT.`}
              </p>
            </div>
          )}

        </div>

        {/* Location & Directions Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-agri-ivory/80">
            <span className="block font-bold text-white">{currentCentre.name}</span>
            <span className="text-[11px]">{lang === 'hi' ? 'स्लॉट समय:' : 'Slot:'} {activeBooking?.slotTime || '11:00 AM – 11:30 AM'}</span>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${currentCentre.lat},${currentCentre.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 transition-all touch-target min-h-[40px]"
          >
            <Navigation className="w-3.5 h-3.5 text-agri-gold" />
            <span>{lang === 'hi' ? 'रास्ता देखें' : 'Get Directions'}</span>
          </a>
        </div>

      </div>

      {/* 2. SIMPLIFIED FARMER QUEUE TIMELINE */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-agri-ivory-muted shadow-sm space-y-4 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-agri-ivory-muted">
          <div>
            <h3 className="font-heading text-base font-bold text-agri-text">
              {lang === 'hi' ? 'मंडी कतार स्थिति' : 'Mandi Queue Feed'}
            </h3>
            <p className="text-xs text-agri-text-muted">
              {currentCentre.name} • {lang === 'hi' ? 'लाइव काउंटर अपडेट' : 'Live clearance status'}
            </p>
          </div>

          <span className="text-[11px] font-bold text-agri-green bg-agri-green-soft px-2.5 py-0.5 rounded-full border border-agri-green-border font-mono">
            Live Counter 2
          </span>
        </div>

        {/* Simplified Queue List */}
        <div className="space-y-2.5">
          {queueItems.map((item) => {
            const isYou = item.token === activeBooking?.token;
            const isDone = item.status === 'COMPLETED';
            const isAtCounter = item.status === 'PROCESSING';
            const isExpanded = expandedItemId === item.token;

            return (
              <div
                key={item.token}
                className={`p-3.5 rounded-xl border transition-all ${isYou
                    ? 'bg-[#FAF7EE] border-2 border-agri-gold shadow-sm ring-1 ring-agri-gold/40'
                    : isAtCounter
                      ? 'bg-amber-50 border-amber-300'
                      : isDone
                        ? 'bg-gray-50 border-gray-200 text-gray-500'
                        : 'bg-white border-agri-ivory-muted'
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    {/* Status Symbol */}
                    <span className="text-base font-bold flex items-center">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isAtCounter ? (
                        <span className="text-xs font-bold text-amber-600 font-mono">→</span>
                      ) : isYou ? (
                        <span className="text-xs font-bold text-agri-green font-mono">★</span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                      )}
                    </span>

                    <span className="font-heading font-extrabold text-base text-agri-green font-mono">
                      {item.token}
                    </span>

                    <span className="text-xs font-bold text-agri-text">
                      {isYou ? (lang === 'hi' ? 'आप (रमेश सिंह)' : 'You (Ramesh Singh)') : item.farmerName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : isAtCounter
                          ? 'bg-amber-200 text-amber-900 font-extrabold'
                          : isYou
                            ? 'bg-agri-gold text-agri-green-dark font-extrabold'
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                      {isDone
                        ? (lang === 'hi' ? 'पूरा हुआ' : 'Completed')
                        : isAtCounter
                          ? (lang === 'hi' ? 'काउंटर 2 पर' : 'At Counter 2')
                          : isYou
                            ? (lang === 'hi' ? 'आपकी बारी' : 'Your Turn')
                            : (lang === 'hi' ? 'इंतजार में' : 'Waiting')}
                    </span>
                  </div>
                </div>

                {/* Subtitle helper */}
                {isYou && (
                  <p className="text-xs font-semibold text-agri-green-dark mt-1 pl-7">
                    {lang === 'hi'
                      ? `आपकी बारी आने वाली है • ${farmersAheadCount} किसान आगे हैं`
                      : `Your turn is coming • ${farmersAheadCount} farmers ahead`}
                  </p>
                )}

                {/* Details Toggle */}
                <div className="pt-2 mt-2 border-t border-agri-ivory-muted/60 flex items-center justify-between text-[11px]">
                  <span className="text-agri-text-muted">
                    {lang === 'hi' ? 'फसल:' : 'Crop:'} <strong>{item.crop} ({item.expectedQty} Qtl)</strong>
                  </span>

                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : item.token)}
                    className="text-agri-green font-bold hover:underline touch-target min-h-[32px] flex items-center"
                  >
                    <span>{isExpanded ? (lang === 'hi' ? 'विवरण छिपाएं' : 'Hide details') : (lang === 'hi' ? 'विवरण देखें' : 'View details')}</span>
                  </button>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="mt-2 p-2.5 rounded-lg bg-agri-ivory/80 text-[11px] space-y-1 text-agri-text animate-in fade-in duration-200">
                    <div className="flex justify-between">
                      <span className="text-agri-text-muted">{lang === 'hi' ? 'आगमन समय:' : 'Arrival Time:'}</span>
                      <span className="font-mono">{item.arrivalTime || '10:22 AM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-agri-text-muted">{lang === 'hi' ? 'आवंटित काउंटर:' : 'Counter:'}</span>
                      <span className="font-mono">{item.counter || 'Counter 2'}</span>
                    </div>
                    {item.actualQty && (
                      <div className="flex justify-between font-bold text-agri-green">
                        <span>{lang === 'hi' ? 'तौल वजन:' : 'Weighed Qty:'}</span>
                        <span>{item.actualQty} Qtl ({item.qualityGrade || 'Grade A'})</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

