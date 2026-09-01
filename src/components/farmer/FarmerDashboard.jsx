import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Wheat, Calendar, MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, UserCheck, AlertTriangle, Navigation, HelpCircle, FileText, Scale, Info } from 'lucide-react';
import { TokenDisplay } from '../ui/TokenDisplay';
import { MetricCard } from '../ui/MetricCard';
import { SlotBookingModal } from './SlotBookingModal';
import { Accordion } from '../ui/Accordion';

export const FarmerDashboard = () => {
  const {
    activeBooking,
    setFarmerTab,
    centres,
    getRecommendedCentre,
    switchBookingCentre,
    dismissedRerouteAlert,
    setDismissedRerouteAlert,
    lang,
    speakText,
    t
  } = useDemo();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCentreForBooking, setSelectedCentreForBooking] = useState(null);

  // Derived booked centre vs recommended centre
  const bookedCentre = centres.find(c => c.id === activeBooking?.centreId) || centres[0];
  const recommendedCentre = getRecommendedCentre(centres);

  const isBookedCentreCongested = bookedCentre.status === 'CONGESTED' || bookedCentre.capacityPercent > 85;
  const isAlternativeBetter = recommendedCentre.id !== bookedCentre.id;
  
  const isCompleted = activeBooking?.status === 'COMPLETED';
  const isDisbursed = activeBooking?.paymentStatus === 'DISBURSED';
  const isProcessing = activeBooking?.status === 'PROCESSING';
  const isCheckedIn = activeBooking?.status === 'CHECKED_IN';

  // Congestion alert condition
  const shouldShowRerouteWarning = isBookedCentreCongested && isAlternativeBetter && !dismissedRerouteAlert && !isCompleted && !isDisbursed;

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
      content: t('faq4A', 'Yes! When KisanSetu detects heavy queue congestion (>85% yard capacity), you will receive a 1-click option on your dashboard to seamlessly transfer your slot to a nearby low-wait Mandi.')
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* 1. DYNAMIC CONGESTION REROUTING ALERT */}
      {shouldShowRerouteWarning && (
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
                    ? `आपकी वर्तमान बुकिंग ${bookedCentre.name} की ही है। पास की पानीपत मंडी में केवल ~${recommendedCentre.estWaitMinutes} मिनट का इंतजार है।`
                    : `Your current booking remains at ${bookedCentre.name}. Panipat Mandi is available nearby with only ~${recommendedCentre.estWaitMinutes} min wait.`}
                </p>
              </div>
            </div>

            {/* Reroute Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <button
                onClick={() => {
                  switchBookingCentre(recommendedCentre.id);
                  speakText('पानीपत मंडी में बुकिंग बदल दी गई है', 'Booking switched to Panipat Mandi');
                }}
                className="bg-amber-400 hover:bg-amber-300 text-rose-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 touch-target min-h-[44px]"
              >
                <span>👉 {lang === 'hi' ? `पानीपत बदलें (~${recommendedCentre.estWaitMinutes}म)` : `Switch to Panipat (~${recommendedCentre.estWaitMinutes}m)`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDismissedRerouteAlert(true)}
                className="bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold px-4 py-3 rounded-xl transition-colors border border-rose-700 text-center touch-target min-h-[44px]"
              >
                {t('keepSonipat', 'Keep Sonipat')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. "WHAT DO I DO NOW?" — PRIMARY FARMER STATUS HERO CARD */}
      <div className="bg-[#17432A] text-white rounded-2xl p-5 sm:p-6 shadow-agri-md relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold bg-agri-gold/20 text-agri-gold px-2.5 py-0.5 rounded-full border border-agri-gold/30 font-mono inline-block mb-1">
              🟢 {t('liveMandiStatus', 'Live Mandi Status')}
            </span>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              {lang === 'hi' ? 'नमस्ते, रमेश सिंह जी 🙏' : 'Namaste, Ramesh Singh ji 🙏'}
            </h1>
          </div>

          <span className="text-xs text-agri-ivory/80 bg-[#102e1c] px-3 py-1 rounded-xl border border-agri-gold/20 font-mono self-start sm:self-auto">
            {lang === 'hi' ? 'वर्तमान बुकिंग:' : 'Booked:'} <strong className="text-agri-gold">{bookedCentre.name.split(' ')[0]} Yard</strong>
          </span>
        </div>

        {/* PRIMARY TASK BOX */}
        <div className="p-4.5 rounded-xl bg-[#123621] border border-agri-gold/30 shadow-inner font-sans space-y-3">
          
          {/* WAITING State */}
          {activeBooking?.status === 'WAITING' && (
            <div className="space-y-3.5 text-amber-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] text-agri-gold font-bold block">
                    {t('yourToken', 'Your Token Number')}
                  </span>
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-agri-gold font-mono tracking-tight">
                    {activeBooking?.token || 'SNP-014'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-agri-ivory/70 block">
                    {t('assignedCounter', 'Assigned Counter')}
                  </span>
                  <span className="text-xs font-bold text-white font-mono bg-[#17432A] px-2.5 py-1 rounded-lg border border-agri-gold/30 inline-block mt-0.5">
                    {activeBooking?.counter || 'Counter 2'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-[#17432A]/80 p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-agri-ivory/80 block">
                    {lang === 'hi' ? 'आगे किसान' : 'Farmers ahead'}
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-white font-mono mt-0.5">3</p>
                </div>
                <div className="bg-[#17432A]/80 p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-agri-ivory/80 block">
                    {t('estimatedWait', 'Estimated Wait Time')}
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-agri-gold font-mono mt-0.5">~{bookedCentre.estWaitMinutes} min</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFarmerTab('queue');
                  speakText('अपनी कतार स्थिति देखें', 'Tracking live queue position');
                }}
                className="w-full bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm touch-target min-h-[48px]"
              >
                <span>⏱ {lang === 'hi' ? 'अपनी बारी का ट्रैक करें' : 'Track My Turn'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* CHECKED_IN State */}
          {isCheckedIn && (
            <div className="space-y-3 text-blue-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] text-blue-300 font-bold block">
                    {lang === 'hi' ? 'गेट चेक-इन सत्यापित' : 'Gate Check-in Verified'}
                  </span>
                  <span className="font-heading font-extrabold text-3xl text-white font-mono">
                    {activeBooking?.token}
                  </span>
                </div>
                <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/40">
                  ✓ {lang === 'hi' ? 'गेट एंट्री पास' : 'Gate Verified'}
                </span>
              </div>
              <button
                onClick={() => setFarmerTab('queue')}
                className="w-full bg-blue-400 hover:bg-blue-300 text-agri-green-dark font-extrabold text-xs px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm touch-target min-h-[48px]"
              >
                <span>{lang === 'hi' ? 'कतार स्थिति देखें' : 'View Queue Position'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PROCESSING State */}
          {isProcessing && (
            <div className="space-y-3 text-agri-green-dark">
              <div className="flex items-center justify-between border-b border-agri-green-dark/20 pb-3">
                <div>
                  <span className="text-[11px] font-extrabold text-agri-green-dark block">
                    🔔 {lang === 'hi' ? 'आपकी बारी आ गई है!' : 'Turn Arrived!'}
                  </span>
                  <span className="font-heading font-extrabold text-3xl text-agri-green-dark font-mono">
                    #{activeBooking?.token}
                  </span>
                </div>
                <span className="bg-agri-green text-white text-xs font-extrabold px-3 py-1 rounded-full animate-bounce">
                  Counter 2
                </span>
              </div>
              <button
                onClick={() => setFarmerTab('queue')}
                className="w-full bg-agri-green-dark hover:bg-agri-green text-white font-extrabold text-xs px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm touch-target min-h-[48px]"
              >
                <span>{lang === 'hi' ? 'काउंटर 2 पर जाएं' : 'Proceed to Counter 2'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* COMPLETED State */}
          {isCompleted && (
            <div className="space-y-3 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] text-agri-gold font-bold block">
                    {lang === 'hi' ? 'फसल तौल दर्ज' : 'Procurement Logged'}
                  </span>
                  <span className="font-heading font-extrabold text-2xl text-agri-gold font-mono">
                    {activeBooking?.actualQty || 38.5} Quintals
                  </span>
                </div>
                <span className="bg-agri-gold/20 text-agri-gold text-xs font-bold px-3 py-1 rounded-full border border-agri-gold/30">
                  DBT Pending
                </span>
              </div>
              <button
                onClick={() => setFarmerTab('history')}
                className="w-full bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-xs px-5 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-agri-sm touch-target min-h-[48px]"
              >
                <span>{lang === 'hi' ? 'भुगतान रसीद देखें' : 'View Payout Receipt'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
              📍 {t('mandi', 'Your Mandi')}
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
            onClick={() => speakText('मानचित्र दिशा-निर्देश खोले जा रहे हैं', 'Opening Google Maps directions')}
            className="bg-agri-green hover:bg-agri-green-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shrink-0 transition-all touch-target min-h-[44px]"
          >
            <Navigation className="w-4 h-4 text-agri-gold" />
            <span>📍 {lang === 'hi' ? 'रास्ता देखें' : 'Get Directions'}</span>
          </a>
        </div>
      </div>

      {/* 5. ACCORDION 2: MANDI FAQ & PROCUREMENT GUIDELINES */}
      <div className="space-y-2">
        <h3 className="font-heading text-base font-bold text-agri-text flex items-center space-x-2 px-1">
          <Info className="w-4 h-4 text-agri-green" />
          <span>{t('mandiFaqTitle', 'Mandi Guidelines & Frequently Asked Questions (FAQ)')}</span>
        </h3>
        <Accordion items={faqItems} allowMultiple={true} />
      </div>

      {/* 6. RECOMMENDATION CARD */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-agri-green/30 relative shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-agri-ivory-muted">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
              <span className="text-[10px] font-bold text-agri-gold bg-agri-gold/20 px-2.5 py-0.5 rounded-full border border-agri-gold/40 font-mono">
                💡 {lang === 'hi' ? 'बेहतर विकल्प उपलब्ध' : 'BETTER OPTION AVAILABLE'}
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
