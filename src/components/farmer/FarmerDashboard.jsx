import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Wheat, Calendar, MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, UserCheck, AlertTriangle, Navigation, HelpCircle, FileText, Scale, Info } from 'lucide-react';
import { TokenDisplay } from '../ui/TokenDisplay';
import { MetricCard } from '../ui/MetricCard';
import { SlotBookingModal } from './SlotBookingModal';
import { Accordion } from '../ui/Accordion';
import BookingActions from './BookingActions';

export const FarmerDashboard = () => {
  const {
    user,
    activeBooking,
    farmerBookings = [],
    selectActiveBooking,
    setFarmerTab,
    centres,
    getRecommendedCentre,
    switchBookingCentre,
    demoCondition,
    dismissedRerouteAlert,
    setDismissedRerouteAlert,
    lang,
    t
  } = useDemo();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCentreForBooking, setSelectedCentreForBooking] = useState(null);

  const farmerDisplayName = user?.user_metadata?.name || user?.name || (lang === 'hi' ? 'रमेश सिंह' : 'Ramesh Singh');

  // Derived booked centre vs recommended centre
  const bookedCentre = centres.find(c => c.id === activeBooking?.centreId) || centres[0];
  const recommendedCentre = getRecommendedCentre(centres);

  // Single source of truth for demo congestion
  const isCongestionActive = demoCondition === 'CONGESTED_SONIPAT';
  const congestedCentre = isCongestionActive ? (centres.find(c => c.id === 'cnt-sonipat') || centres[0]) : null;

  const isBookedCentreCongested = isCongestionActive && (bookedCentre.id === 'cnt-sonipat');
  const isAlternativeBetter = recommendedCentre.id !== bookedCentre.id;

  const isCompleted = activeBooking?.status === 'COMPLETED';
  const isDisbursed = activeBooking?.paymentStatus === 'DISBURSED';
  const isProcessing = activeBooking?.status === 'PROCESSING';
  const isCheckedIn = activeBooking?.status === 'CHECKED_IN';

  // Booking-specific rerouting alert: active booking is at congested mandi and is not completed/disbursed
  const shouldShowBookingReroute = isCongestionActive && isBookedCentreCongested && isAlternativeBetter && !dismissedRerouteAlert && !isCompleted && !isDisbursed;

  // General congestion advisory: congestion is active, not dismissed, but booking does not need reroute
  const shouldShowGeneralAdvisory = isCongestionActive && !dismissedRerouteAlert && !shouldShowBookingReroute;

  // Accordion Items Definition
  const bookingSummaryItems = [
    {
      id: 'summary-breakdown',
      title: t('bookingSummaryDetails', 'More Details & Booking Summary'),
      subtitle: t('currentBookingAt', 'Your current token is registered at') + ` ${bookedCentre.name}`,
      icon: FileText,
      badgeText: activeBooking?.token || 'SNP-014',
      badgeColor: 'bg-agri-gold/20 text-agri-green-dark border-agri-gold/40',
      content: (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-agri-ivory/50 rounded-xl border border-agri-green/10 space-y-1">
              <span className="text-[11px] text-agri-text-muted font-bold block">{t('cropGrade', 'Crop & Variety')}</span>
              <p className="font-bold text-agri-text">{activeBooking?.crop || 'Paddy (Grade A)'}</p>
            </div>

            <div className="p-3 bg-agri-ivory/50 rounded-xl border border-agri-green/10 space-y-1">
              <span className="text-[11px] text-agri-text-muted font-bold block">{t('expectedWeight', 'Expected Quantity')}</span>
              <p className="font-bold text-agri-text">{activeBooking?.expectedQty || 40} Quintals</p>
            </div>

            <div className="p-3 bg-agri-ivory/50 rounded-xl border border-agri-green/10 space-y-1">
              <span className="text-[11px] text-agri-text-muted font-bold block">{t('rateMsp', 'Government MSP Rate')}</span>
              <p className="font-bold text-agri-green font-mono">₹{activeBooking?.ratePerQuintal || 2200} / Quintal</p>
            </div>

            <div className="p-3 bg-agri-ivory/50 rounded-xl border border-agri-green/10 space-y-1">
              <span className="text-[11px] text-agri-text-muted font-bold block">{t('estPayout', 'Estimated Gross Payout')}</span>
              <p className="font-bold text-agri-gold-dark font-mono text-sm">
                ₹{((activeBooking?.expectedQty || 40) * (activeBooking?.ratePerQuintal || 2200)).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-agri-green/15 text-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-agri-text-muted font-bold uppercase">{t('centreLocation', 'Procurement Yard Location')}</span>
              <p className="font-semibold text-agri-text">{bookedCentre.address}</p>
            </div>
            <span className="text-[11px] font-mono font-bold bg-agri-green/10 text-agri-green px-2 py-1 rounded">
              Gate Counter 2
            </span>
          </div>
        </div>
      )
    }
  ];

  const faqItems = [
    {
      id: 'faq-1',
      title: t('faq1Q', 'What documents are mandatory when arriving at the Mandi gate?'),
      subtitle: t('requiredDocs', 'Mandatory Documents'),
      icon: HelpCircle,
      badgeText: 'Gate Check-in',
      content: t('faq1A', 'Please bring your Aadhaar Card, Kisan Credit Card / Bank Passbook copy, and your KisanSetu Token Pass (digital or printed).')
    },
    {
      id: 'faq-2',
      title: t('faq2Q', 'What is the maximum allowed moisture percentage for Grade A Paddy?'),
      subtitle: t('moistureLimit', 'Quality Standards'),
      icon: Scale,
      badgeText: 'Max 17%',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      content: t('faq2A', 'The maximum permissible moisture limit for MSP procurement is 17%. Paddy exceeding 17% will require on-yard sun drying before weighment.')
    },
    {
      id: 'faq-3',
      title: t('faq3Q', 'How long does MSP Direct Benefit Transfer (DBT) payment take?'),
      subtitle: t('payoutSla', 'Bank Credit SLA'),
      icon: CheckCircle2,
      badgeText: '24 - 48 Hours',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      content: t('faq3A', 'Once the Mandi Operator records your net weight and quality approval, DoCA Admin authorizes payout release within 24 to 48 hours directly into your Aadhaar-linked SBI bank account.')
    },
    {
      id: 'faq-4',
      title: t('faq4Q', 'Can I reroute my booking if my primary Mandi is congested?'),
      subtitle: t('congestedAlertTitle', 'Smart Congestion Rerouting'),
      icon: Navigation,
      badgeText: '1-Click Reroute',
      content: (
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-agri-text leading-relaxed">
            {t('faq4A', 'Yes! When KisanSetu detects heavy queue congestion (>85% yard capacity), you will receive a 1-click option on your dashboard to seamlessly transfer your slot to a nearby low-wait Mandi.')}
          </p>
          <button
            onClick={() => setFarmerTab('centres')}
            className="inline-flex items-center space-x-1 text-xs font-bold text-agri-green hover:text-agri-green-dark hover:underline pt-0.5"
          >
            <span>{lang === 'hi' ? 'मंडी विकल्प देखें →' : 'View Mandi Options →'}</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* 1. DYNAMIC CONGESTION ALERTS */}

      {/* 1A. BOOKING-SPECIFIC REROUTING ALERT (Only when active booking is at the congested mandi and still active) */}
      {shouldShowBookingReroute && (
        <div className="bg-[#4A1510] text-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-rose-500 relative overflow-hidden animate-in slide-in-from-top duration-300">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-rose-900 text-amber-300 rounded-xl shrink-0 border border-rose-500">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase bg-amber-400 text-rose-950 px-2.5 py-0.5 rounded font-mono">
                  {t('congestedAlertTitle', '⚠️ MANDI HEAVY TRAFFIC ALERT')}
                </span>

                <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                  {lang === 'hi'
                    ? `${bookedCentre.name} में इंतजार समय बढ़कर ~${bookedCentre.estWaitMinutes} मिनट हो गया है`
                    : `${bookedCentre.name} waiting time increased to ~${bookedCentre.estWaitMinutes} min`}
                </h3>

                <p className="text-xs text-rose-100 leading-relaxed max-w-xl">
                  {lang === 'hi'
                    ? `आपकी वर्तमान बुकिंग (${activeBooking?.token}) इसी केंद्र पर है। पास की पानीपत मंडी में केवल ~${recommendedCentre.estWaitMinutes} मिनट का इंतजार है।`
                    : `Your current token (${activeBooking?.token}) is registered at this congested yard. Panipat Mandi is available nearby with only ~${recommendedCentre.estWaitMinutes} min wait.`}
                </p>
              </div>
            </div>

            {/* Reroute Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <button
                onClick={() => {
                  switchBookingCentre(recommendedCentre.id);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-rose-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 touch-target min-h-[44px]"
              >
                <span>{lang === 'hi' ? `${recommendedCentre.name.split(' ')[0]} बदलें (~${recommendedCentre.estWaitMinutes}म)` : `Switch to ${recommendedCentre.name.split(' ')[0]} (~${recommendedCentre.estWaitMinutes}m)`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDismissedRerouteAlert(true)}
                className="bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold px-4 py-3 rounded-xl transition-colors border border-rose-700 text-center touch-target min-h-[44px]"
              >
                {lang === 'hi' ? `${bookedCentre.name.split(' ')[0]} ही रखें` : `Keep ${bookedCentre.name.split(' ')[0]}`}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 1B. GENERAL MANDI CONGESTION ADVISORY */}
      {shouldShowGeneralAdvisory && congestedCentre && (
        <div className="bg-amber-950/90 text-amber-50 rounded-2xl p-4 sm:p-5 shadow-md border-2 border-amber-500 relative overflow-hidden animate-in slide-in-from-top duration-300">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-900 text-amber-300 rounded-xl shrink-0 border border-amber-600">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded font-mono">
                  {lang === 'hi' ? 'राज्य मंडी यातायात सूचना' : 'STATE MANDI TRAFFIC ADVISORY'}
                </span>

                <h3 className="font-heading text-base font-bold text-white">
                  {lang === 'hi'
                    ? `${congestedCentre.name} में भारी भीड़ (~${congestedCentre.estWaitMinutes} मिनट इंतजार)`
                    : `${congestedCentre.name} experiencing heavy truck traffic (~${congestedCentre.estWaitMinutes} min wait)`}
                </h3>

                <p className="text-xs text-amber-100 leading-relaxed max-w-xl">
                  {lang === 'hi'
                    ? `सोनीपत में ट्रकों की भारी आमद के कारण इंतजार बढ़ गया है। नई बुकिंग के लिए पानीपत मंडी (~${recommendedCentre.estWaitMinutes} मिनट) सुझाई गई है।`
                    : `High influx of harvest trucks reported at Sonipat Main Yard. Panipat Mandi (~${recommendedCentre.estWaitMinutes} min wait) is currently recommended for open slot arrivals.`}
                  {activeBooking && (
                    <span className="block mt-1 text-emerald-300 font-semibold">
                      {lang === 'hi'
                        ? `आपकी वर्तमान बुकिंग (${activeBooking.token}) ${bookedCentre.name} पर है और प्रभावित नहीं है।`
                        : `Your current token (${activeBooking.token}) is booked at ${bookedCentre.name} and is unaffected.`}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Advisory Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <button
                onClick={() => setFarmerTab('centres')}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 touch-target min-h-[40px]"
              >
                <span>{lang === 'hi' ? 'मंडी स्थिति व विकल्प देखें' : 'View Mandi Options & Live Status'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDismissedRerouteAlert(true)}
                className="bg-amber-900/60 hover:bg-amber-900 text-amber-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors border border-amber-700/60 text-center touch-target min-h-[40px]"
              >
                {lang === 'hi' ? 'सूचना हटाएं' : 'Dismiss Advisory'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PROMINENT MANDI SLOT BOOKING ACTION HEADER */}
      <div className="bg-gradient-to-r from-agri-green-dark to-agri-green rounded-2xl p-4 sm:p-5 text-white shadow-agri-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-agri-gold/30">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase bg-agri-gold/20 text-agri-gold px-2.5 py-0.5 rounded border border-agri-gold/30 font-mono inline-block">
            {lang === 'hi' ? 'सीधी सरकारी खरीद' : 'DIRECT MSP PROCUREMENT'}
          </span>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
            {lang === 'hi' ? 'मंडी आगमन स्लॉट बुक करें' : 'Book a Mandi Arrival Slot'}
          </h2>
        </div>

        <button
          onClick={() => {
            setSelectedCentreForBooking(null);
            setIsBookingModalOpen(true);
          }}
          className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all shadow-agri-sm flex items-center justify-center space-x-2 shrink-0 touch-target min-h-[48px] hover:scale-[1.02] active:scale-[0.98]"
        >
          <Wheat className="w-4 h-4 stroke-[2.5]" />
          <span>{lang === 'hi' ? 'मंडी स्लॉट बुक करें' : 'Book a Mandi Slot'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. PRIMARY FARMER STATUS HERO CARD */}
      <div className="bg-[#17432A] text-white rounded-2xl p-6 sm:p-7 shadow-agri-md relative overflow-hidden space-y-6 border border-agri-gold/30">

        {/* Top Greeting & Center Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-white/10">
          <div>
            <span className="text-[11px] font-bold bg-agri-gold/20 text-agri-gold px-3 py-1 rounded-full border border-agri-gold/30 font-mono inline-block mb-1.5">
              {t('liveMandiStatus', 'Live Mandi Status')}
            </span>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              {lang === 'hi' ? `नमस्ते, ${farmerDisplayName}` : `Namaste, ${farmerDisplayName}`}
            </h1>
          </div>

          <span className="text-xs text-agri-ivory/90 bg-[#102e1c] px-3.5 py-1.5 rounded-xl border border-agri-gold/20 font-mono self-start sm:self-auto">
            {lang === 'hi' ? 'वर्तमान केंद्र:' : 'Booked Yard:'} <strong className="text-agri-gold font-bold">{bookedCentre.name.split(' ')[0]}</strong>
          </span>
        </div>

        {/* MULTIPLE BOOKINGS TOKEN SWITCHER */}
        {farmerBookings.length > 1 && (
          <div className="bg-[#102e1c] p-3 rounded-xl border border-agri-gold/20 space-y-2">
            <span className="text-[11px] text-agri-gold font-bold block font-mono">
              {lang === 'hi' ? 'आपकी बुकिंग:' : 'Your Bookings:'}
            </span>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {farmerBookings.map((b) => {
                const isActive = b.token === activeBooking?.token;
                return (
                  <button
                    key={b.token}
                    onClick={() => selectActiveBooking(b.token)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${isActive
                      ? 'bg-agri-gold text-agri-green-dark shadow-sm ring-1 ring-white/40'
                      : 'bg-[#17432A] text-agri-ivory hover:bg-white/10 border border-white/10'
                      }`}
                  >
                    <span>{b.token}</span>
                    <span className="text-[10px] opacity-80">({b.crop?.split(' ')[0] || 'Crop'} • {b.status})</span>
                    {isActive && <CheckCircle2 className="w-3 h-3 text-agri-green-dark" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PRIMARY BOOKING STATUS BOX */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#123621] border border-agri-gold/25 shadow-inner font-sans space-y-5">

          {/* WAITING State */}
          {activeBooking?.status === 'WAITING' && (
            <div className="space-y-4 text-amber-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-agri-gold font-bold block">
                    {t('yourToken', 'Your Token Number')}
                  </span>
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-agri-gold font-mono tracking-tight mt-0.5 block">
                    {activeBooking?.token || 'SNP-014'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-agri-ivory/70 block">
                    {t('assignedCounter', 'Assigned Counter')}
                  </span>
                  <span className="text-xs font-bold text-white font-mono bg-[#17432A] px-3 py-1.5 rounded-lg border border-agri-gold/30 inline-block mt-1">
                    {activeBooking?.counter || 'Counter 2'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-center">
                <div className="bg-[#17432A]/90 p-3.5 rounded-xl border border-white/10">
                  <span className="text-xs text-agri-ivory/80 block">
                    {lang === 'hi' ? 'आगे किसान' : 'Farmers ahead'}
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-white font-mono mt-1">3</p>
                </div>
                <div className="bg-[#17432A]/90 p-3.5 rounded-xl border border-white/10">
                  <span className="text-xs text-agri-ivory/80 block">
                    {t('estimatedWait', 'Estimated Wait Time')}
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-agri-gold font-mono mt-1">~{bookedCentre.estWaitMinutes} min</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFarmerTab('queue');
                }}
                className="w-full bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm touch-target min-h-[48px]"
              >
                <span>{lang === 'hi' ? 'अपनी बारी का ट्रैक करें' : 'Track My Turn'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* CHECKED_IN State */}
          {isCheckedIn && (
            <div className="space-y-4 text-blue-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-blue-300 font-bold block">
                    {lang === 'hi' ? 'गेट चेक-इन सत्यापित' : 'Gate Check-in Verified'}
                  </span>
                  <span className="font-heading font-extrabold text-3xl text-white font-mono mt-0.5 block">
                    {activeBooking?.token}
                  </span>
                </div>
                <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-400/40">
                  {lang === 'hi' ? 'गेट एंट्री पास' : 'Gate Verified'}
                </span>
              </div>
              <button
                onClick={() => setFarmerTab('queue')}
                className="w-full bg-blue-400 hover:bg-blue-300 text-agri-green-dark font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm touch-target min-h-[48px]"
              >
                <span>{lang === 'hi' ? 'कतार स्थिति देखें' : 'View Queue Position'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PROCESSING State */}
          {isProcessing && (
            <div className="space-y-4 text-agri-green-dark">
              <div className="flex items-center justify-between border-b border-agri-green-dark/20 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-agri-green-dark block">
                    {lang === 'hi' ? 'आपकी बारी आ गई है!' : 'Turn Arrived!'}
                  </span>
                  <span className="font-heading font-extrabold text-3xl text-agri-green-dark font-mono mt-0.5 block">
                    #{activeBooking?.token}
                  </span>
                </div>
                <span className="bg-agri-green text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full">
                  Counter 2
                </span>
              </div>
              <button
                onClick={() => setFarmerTab('queue')}
                className="w-full bg-agri-green-dark hover:bg-agri-green text-white font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm touch-target min-h-[48px]"
              >
                <span>{lang === 'hi' ? 'काउंटर 2 पर जाएं' : 'Proceed to Counter 2'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* COMPLETED State */}
          {isCompleted && (
            <div className="space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-agri-gold font-bold block">
                    {lang === 'hi' ? 'फसल तौल दर्ज' : 'Procurement Logged'}
                  </span>
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-agri-gold font-mono mt-0.5 block">
                    {activeBooking?.actualQty || 38.5} Quintals
                  </span>
                </div>
                <span className="bg-agri-gold/20 text-agri-gold text-xs font-bold px-3.5 py-1.5 rounded-full border border-agri-gold/30">
                  DBT Pending
                </span>
              </div>
              <button
                onClick={() => setFarmerTab('history')}
                className="w-full bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm touch-target min-h-[48px]"
              >
                <span>{lang === 'hi' ? 'भुगतान रसीद देखें' : 'View Payout Receipt'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* NO ACTIVE BOOKING State */}
          {!activeBooking && (
            <div className="space-y-3.5 text-center py-3 text-agri-ivory">
              <p className="text-sm">
                {lang === 'hi'
                  ? 'आपके पास कोई सक्रिय टोकन नहीं है। आज ही अपना स्लॉट बुक करें।'
                  : 'You have no active slot booking. Book your arrival slot now.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCentreForBooking(null);
                  setIsBookingModalOpen(true);
                }}
                className="w-full bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm"
              >
                <Wheat className="w-4 h-4" />
                <span>{lang === 'hi' ? 'मंडी स्लॉट बुक करें' : 'Book a Mandi Slot'}</span>
              </button>
            </div>
          )}

          {/* THE NEW BOOKING ACTIONS ADDED HERE */}
          {activeBooking && (
            <div className="pt-2 mt-4 border-t border-white/10">
              <BookingActions
                bookingId={activeBooking.token}
                currentStatus={activeBooking.status}
              />
            </div>
          )}

        </div>
      </div>

      {/* 3. ACCORDION 1: MORE DETAILS & BOOKING SUMMARY */}
      <Accordion items={bookingSummaryItems} allowMultiple={true} />

      {/* 4. YOUR MANDI & LOCATION */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-agri-ivory-muted shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-agri-text-muted font-bold block">
              {t('mandi', 'Your Mandi')}
            </span>
            <h3 className="font-heading text-base sm:text-lg font-bold text-agri-text">
              {bookedCentre.name}
            </h3>
            <p className="text-xs text-agri-text-muted mt-0.5">
              {lang === 'hi' ? 'समय स्लॉट:' : 'Slot:'} <strong className="font-mono text-agri-green">{activeBooking?.slotTime || '11:00 AM – 11:30 AM'}</strong>
            </p>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${bookedCentre.lat},${bookedCentre.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-agri-green hover:bg-agri-green-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shrink-0 transition-all touch-target min-h-[44px]"
          >
            <Navigation className="w-4 h-4 text-agri-gold" />
            <span>{lang === 'hi' ? 'रास्ता देखें' : 'Get Directions'}</span>
          </a>
        </div>
      </div>

      {/* 5. MANDI RECOMMENDATION CARD */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-agri-green/30 relative shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-agri-ivory-muted">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
              <span className="text-[10px] font-bold text-agri-gold bg-agri-gold/20 px-2.5 py-0.5 rounded-full border border-agri-gold/40 font-mono">
                {lang === 'hi' ? 'बेहतर विकल्प उपलब्ध' : 'BETTER OPTION AVAILABLE'}
              </span>

              <span className="text-[10px] text-agri-text bg-agri-ivory px-2.5 py-0.5 rounded-full border border-agri-ivory-muted font-sans font-medium">
                {lang === 'hi' ? 'आपकी वर्तमान बुकिंग:' : 'Your current booking:'} <strong>{bookedCentre.name.split(' ')[0]}</strong>
              </span>
            </div>

            <h3 className="font-heading text-base sm:text-lg font-bold text-agri-green flex items-center gap-2 flex-wrap">
              <span>{lang === 'hi' ? 'सुझाई गई मंडी:' : 'Recommended:'}</span>
              <span className="text-agri-text font-extrabold">{recommendedCentre.name}</span>
            </h3>

            <p className="text-xs text-agri-text-muted flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-agri-green shrink-0" />
              <span>{recommendedCentre.address} • <strong>{recommendedCentre.distanceKm} km away</strong></span>
            </p>
          </div>

          <button
            onClick={() => setFarmerTab('centres')}
            className="bg-agri-green hover:bg-agri-green-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-1.5 shrink-0 transition-all touch-target min-h-[44px]"
          >
            <span>{lang === 'hi' ? 'सभी मंडियां देखें' : 'View All Mandis'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center py-2 bg-agri-ivory/60 rounded-xl border border-agri-ivory-muted">
          <div>
            <span className="text-[11px] text-agri-text-muted font-sans">{lang === 'hi' ? 'इंतजार समय' : 'Wait time'}</span>
            <p className="font-heading text-base font-bold text-agri-gold-dark font-mono mt-0.5">~{recommendedCentre.estWaitMinutes} min</p>
          </div>
          <div>
            <span className="text-[11px] text-agri-text-muted font-sans">{lang === 'hi' ? 'मंडी लोड' : 'Yard load'}</span>
            <p className="font-heading text-base font-bold text-agri-green font-mono mt-0.5">{recommendedCentre.capacityPercent}%</p>
          </div>
          <div>
            <span className="text-[11px] text-agri-text-muted font-sans">{lang === 'hi' ? 'खुले स्लॉट' : 'Open slots'}</span>
            <p className="font-heading text-base font-bold text-agri-text font-mono mt-0.5">{recommendedCentre.availableSlots} free</p>
          </div>
        </div>
      </div>

      {/* 6. BEFORE YOU VISIT THE MANDI (QUICK FAQS) */}
      <div className="space-y-2.5 pt-1">
        <div className="px-1">
          <h3 className="font-heading text-base font-bold text-agri-text flex items-center space-x-1.5">
            <span>{lang === 'hi' ? 'मंडी जाने से पहले ज़रूरी बातें' : 'Before You Visit the Mandi'}</span>
          </h3>
          <p className="text-xs text-agri-text-muted mt-0.5">
            {lang === 'hi'
              ? 'दस्तावेज़, गुणवत्ता, भुगतान और मंडी स्थिति से जुड़े त्वरित उत्तर।'
              : 'Quick answers about documents, quality, payment and Mandi congestion.'}
          </p>
        </div>
        <Accordion items={faqItems} allowMultiple={true} defaultOpenIds={[]} compact={true} />
      </div>

      {/* Slot Booking Modal */}
      {isBookingModalOpen && (
        <SlotBookingModal
          centre={selectedCentreForBooking}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}

    </div>
  );
};