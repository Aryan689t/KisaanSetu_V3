import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  Wheat, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  Navigation, 
  HelpCircle, 
  FileText, 
  Scale, 
  Info,
  Coins,
  Ticket,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { TokenDisplay } from '../ui/TokenDisplay';
import { StatusBadge } from '../ui/StatusBadge';
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
    queueItems,
    lang,
    t
  } = useDemo();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCentreForBooking, setSelectedCentreForBooking] = useState(null);

  const isHindi = lang === 'hi';
  const farmerDisplayName = user?.user_metadata?.name || user?.name || (isHindi ? 'रमेश सिंह' : 'Ramesh Singh');

  // Derived booked centre vs recommended centre
  const bookedCentre = centres.find(c => c.id === activeBooking?.centreId) || centres[0];
  const recommendedCentre = getRecommendedCentre(centres);
  
  // Congestion alerts logic
  const isCongestionActive = demoCondition === 'CONGESTED_SONIPAT';
  const congestedCentre = isCongestionActive ? (centres.find(c => c.id === 'cnt-sonipat') || centres[0]) : null;

  const isBookedCentreCongested = isCongestionActive && (bookedCentre.id === 'cnt-sonipat');
  const isAlternativeBetter = recommendedCentre.id !== bookedCentre.id;
  
  // Current Booking State Breakdown
  const status = activeBooking?.status;
  const isSuspendedDrying = status === 'DRYING_REQUIRED' || status === 'SUSPENDED_DRYING';
  const isWaiting = status === 'WAITING' || status === 'BOOKED' || status === 'SLOT_CONFIRMED';
  const isCheckedIn = status === 'CHECKED_IN';
  const isProcessing = status === 'PROCESSING';
  const isCompleted = status === 'COMPLETED';
  const isDisbursed = activeBooking?.paymentStatus === 'DISBURSED';

  // Queue Position Calculation for the Farmer
  const youTokenIndex = queueItems.findIndex(q => q.token === activeBooking?.token);
  const farmersAheadCount = youTokenIndex >= 0 ? youTokenIndex : 3;
  const estWaitMins = isWaiting ? (bookedCentre.estWaitMinutes || 16) : 0;

  // Pricing calculations
  const cropRate = activeBooking?.ratePerQuintal || 2200;
  const expectedQty = activeBooking?.expectedQty || 40;
  const actualQty = activeBooking?.actualQty || expectedQty;
  const estPayout = Math.round(expectedQty * cropRate);
  const finalPayout = Math.round(actualQty * cropRate);

  // Booking-specific rerouting alert
  const shouldShowBookingReroute = isCongestionActive && isBookedCentreCongested && isAlternativeBetter && !dismissedRerouteAlert && !isCompleted && !isDisbursed;
  const shouldShowGeneralAdvisory = isCongestionActive && !dismissedRerouteAlert && !shouldShowBookingReroute;

  // FAQ Items Definition
  const faqItems = [
    {
      id: 'faq-1',
      title: isHindi ? 'मंडी गेट पर कौन से दस्तावेज़ अनिवार्य हैं?' : 'What documents are mandatory when arriving at the Mandi gate?',
      subtitle: isHindi ? 'अनिवार्य दस्तावेज़' : 'Mandatory Documents',
      icon: HelpCircle,
      badgeText: 'Gate Check-in',
      content: isHindi 
        ? 'कृपया अपना आधार कार्ड, किसान क्रेडिट कार्ड / बैंक पासबुक की प्रति और अपना किसानसेतु टोकन पास (डिजिटल या प्रिंटेड) साथ लाएं।'
        : 'Please bring your Aadhaar Card, Kisan Credit Card / Bank Passbook copy, and your KisanSetu Token Pass (digital or printed).'
    },
    {
      id: 'faq-2',
      title: isHindi ? 'ग्रेड-ए धान के लिए अधिकतम अनुमत नमी कितनी है?' : 'What is the maximum allowed moisture percentage for Grade A Paddy?',
      subtitle: isHindi ? 'गुणवत्ता मानक' : 'Quality Standards',
      icon: Scale,
      badgeText: 'Max 17%',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      content: isHindi
        ? 'एमएसपी खरीद के लिए अधिकतम अनुमत नमी सीमा 17% है। 17% से अधिक नमी होने पर तौल से पहले यार्ड में धूप में सुखाना होगा।'
        : 'The maximum permissible moisture limit for MSP procurement is 17%. Paddy exceeding 17% will require on-yard sun drying before weighment.'
    },
    {
      id: 'faq-3',
      title: isHindi ? 'एमएसपी डीबीटी बैंक भुगतान में कितना समय लगता है?' : 'How long does MSP Direct Benefit Transfer (DBT) payment take?',
      subtitle: isHindi ? 'बैंक क्रेडिट समय' : 'Bank Credit SLA',
      icon: CheckCircle2,
      badgeText: '24 - 48 Hours',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      content: isHindi
        ? 'मंडी ऑपरेटर द्वारा शुद्ध वजन और गुणवत्ता अनुमोदन दर्ज करने के बाद, 24 से 48 घंटों के भीतर सीधे आपके आधार से जुड़े बैंक खाते में भुगतान ट्रांसफर कर दिया जाता है।'
        : 'Once the Mandi Operator records your net weight and quality approval, DBT payout release is processed within 24 to 48 hours directly into your Aadhaar-linked bank account.'
    },
    {
      id: 'faq-4',
      title: isHindi ? 'यदि प्राथमिक मंडी में भीड़ हो तो क्या मैं अपना स्लॉट बदल सकता हूँ?' : 'Can I reroute my booking if my primary Mandi is congested?',
      subtitle: isHindi ? 'स्मार्ट री-रूटिंग' : 'Smart Congestion Rerouting',
      icon: Navigation,
      badgeText: '1-Click Reroute',
      content: (
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-agri-text leading-relaxed">
            {isHindi
              ? 'हाँ! जब किसानसेतु भारी कतार भीड़ (>85% क्षमता) का पता लगाता है, तो आपको अपने डैशबोर्ड पर 1-क्लिक विकल्प मिलेगा जिससे आप पास की कम-भीड़ वाली मंडी में आसानी से स्लॉट ट्रांसफर कर सकते हैं।'
              : 'Yes! When KisanSetu detects heavy queue congestion (>85% yard capacity), you will receive a 1-click option on your dashboard to seamlessly transfer your slot to a nearby low-wait Mandi.'}
          </p>
          <button
            onClick={() => setFarmerTab('centres')}
            className="inline-flex items-center space-x-1 text-xs font-bold text-agri-green hover:text-agri-green-dark hover:underline pt-0.5"
          >
            <span>{isHindi ? 'मंडी विकल्प देखें →' : 'View Mandi Options →'}</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. UPGRADED FUEL VS. TIME SMART REROUTE CARD (CONGESTION BENEFIT ANALYSIS)  */}
      {/* ========================================================================= */}
      {shouldShowBookingReroute && (
        <div className="bg-gradient-to-br from-[#3b120c] via-[#2a0b06] to-[#1c0704] text-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-rose-500 relative overflow-hidden animate-in slide-in-from-top duration-300">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/30 pb-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-rose-900/80 text-amber-300 rounded-xl shrink-0 border border-rose-500/60 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-rose-950 px-2 py-0.5 rounded font-mono">
                  {isHindi ? 'स्मार्ट री-रूट व मालभाड़ा सब्सिडी' : '⚡ SMART MANDI REROUTE & FREIGHT INCENTIVE'}
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white mt-0.5">
                  {isHindi ? 'भारी भीड़ बाईपास व लागत-लाभ विश्लेषण' : 'Heavy Queue Congestion Detected at Sonipat Yard'}
                </h3>
              </div>
            </div>

            <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 self-start sm:self-auto font-bold">
              Govt. DBT Incentive Active
            </span>
          </div>

          {/* Comparative Cost-Benefit Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
            
            {/* Current Mandi Card (Red) */}
            <div className="p-4 rounded-2xl bg-rose-950/60 border-2 border-rose-500/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Current Booked Mandi
                </span>
                <span className="text-[10px] bg-rose-900 text-rose-200 px-2 py-0.5 rounded font-mono font-bold border border-rose-700">
                  CONGESTED
                </span>
              </div>
              <h4 className="font-heading font-black text-lg text-white">
                {bookedCentre.name}
              </h4>
              <div className="p-2.5 bg-black/40 rounded-xl border border-rose-500/30 text-xs space-y-1 font-mono">
                <p className="text-rose-200 flex justify-between">
                  <span>Estimated Wait Time:</span>
                  <strong className="text-rose-400 font-extrabold text-sm">~67 min wait</strong>
                </p>
                <p className="text-rose-300/80 flex justify-between text-[11px]">
                  <span>Yard Capacity Load:</span>
                  <span>94% (Heavy Truck Backlog)</span>
                </p>
              </div>
            </div>

            {/* Alternate Recommended Mandi Card (Green) */}
            <div className="p-4 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Recommended Alternate Mandi
                </span>
                <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold border border-emerald-600">
                  FAST LANE
                </span>
              </div>
              <h4 className="font-heading font-black text-lg text-white">
                Panipat Sub-Mandi (12 km)
              </h4>
              <div className="p-2.5 bg-black/40 rounded-xl border border-emerald-500/30 text-xs space-y-1 font-mono">
                <p className="text-emerald-200 flex justify-between">
                  <span>Estimated Wait Time:</span>
                  <strong className="text-emerald-300 font-extrabold text-sm">~14 min wait</strong>
                </p>
                <p className="text-emerald-300/80 flex justify-between text-[11px]">
                  <span>Active Weighbridges:</span>
                  <span>4 Scales Open (Low Traffic)</span>
                </p>
              </div>
            </div>

          </div>

          {/* Economic Breakdown Bar */}
          <div className="mt-3.5 p-3.5 bg-black/40 rounded-2xl border border-agri-gold/40 text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[11px] font-mono">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400 block text-[10px]">Est. Extra Diesel (12 km)</span>
                <strong className="text-rose-400 text-xs font-bold">-₹180</strong>
              </div>
              <div className="p-2 bg-emerald-950/50 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-300 block text-[10px]">Govt. Freight Subsidy</span>
                <strong className="text-emerald-300 text-xs font-bold">+₹200 (Added to DBT)</strong>
              </div>
              <div className="p-2 bg-agri-gold/20 rounded-xl border border-agri-gold/40">
                <span className="text-agri-gold block text-[10px]">Net Economic Benefit</span>
                <strong className="text-amber-300 text-xs font-extrabold">Save 53 mins & earn ₹20 extra</strong>
              </div>
            </div>
          </div>

          {/* Large Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3">
            <button
              onClick={() => switchBookingCentre(recommendedCentre.id, 200)}
              className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-rose-950 font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-rose-950 fill-rose-950" />
              <span>{isHindi ? '⚡ री-रूट स्वीकारें व ₹200 सब्सिडी पाएं' : '⚡ Accept Reroute & Claim ₹200 Subsidy'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDismissedRerouteAlert(true)}
              className="bg-white/10 hover:bg-white/20 text-rose-200 text-xs font-semibold py-3.5 px-5 rounded-2xl transition-colors border border-white/15 text-center cursor-pointer"
            >
              {isHindi ? 'सोनीपत में ही रुकें' : 'Keep Sonipat Yard'}
            </button>
          </div>

        </div>
      )}

      {shouldShowGeneralAdvisory && congestedCentre && (
        <div className="bg-amber-950/90 text-amber-50 rounded-2xl p-4 sm:p-5 shadow-md border-2 border-amber-500 relative overflow-hidden animate-in slide-in-from-top duration-300">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-900 text-amber-300 rounded-xl shrink-0 border border-amber-600">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded font-mono">
                  {isHindi ? 'राज्य मंडी यातायात सूचना' : 'STATE MANDI TRAFFIC ADVISORY'}
                </span>

                <h3 className="font-heading text-base font-bold text-white">
                  {isHindi
                    ? `${congestedCentre.name} में भारी भीड़ (~${congestedCentre.estWaitMinutes} मिनट इंतजार)`
                    : `${congestedCentre.name} experiencing heavy truck traffic (~${congestedCentre.estWaitMinutes} min wait)`}
                </h3>

                <p className="text-xs text-amber-100 leading-relaxed max-w-xl">
                  {isHindi
                    ? `सोनीपत में ट्रकों की भारी आमद के कारण इंतजार बढ़ गया है। नई बुकिंग के लिए पानीपत मंडी (~${recommendedCentre.estWaitMinutes} मिनट) सुझाई गई है।`
                    : `High influx of harvest trucks reported at Sonipat Main Yard. Panipat Mandi (~${recommendedCentre.estWaitMinutes} min wait) is currently recommended for open slot arrivals.`}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <button
                onClick={() => setFarmerTab('centres')}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 touch-target min-h-[40px]"
              >
                <span>{isHindi ? 'मंडी स्थिति व विकल्प देखें' : 'View Mandi Options & Live Status'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDismissedRerouteAlert(true)}
                className="bg-amber-900/60 hover:bg-amber-900 text-amber-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors border border-amber-700/60 text-center touch-target min-h-[40px]"
              >
                {isHindi ? 'सूचना हटाएं' : 'Dismiss Advisory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PROMINENT "BOOK A MANDI SLOT" ACTION BAR                               */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-agri-green-dark via-[#1d5736] to-agri-green rounded-2xl p-4 sm:p-5 text-white shadow-agri-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-agri-gold/30">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase bg-agri-gold/20 text-agri-gold px-2.5 py-0.5 rounded border border-agri-gold/30 font-mono inline-block">
            {isHindi ? 'सरकारी एमएसपी खरीद' : 'GOVERNMENT MSP PROCUREMENT'}
          </span>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
            {isHindi ? 'मंडी आगमन स्लॉट बुक करें' : 'Book a Mandi Arrival Slot'}
          </h2>
          <p className="text-xs text-agri-ivory/80 font-normal">
            {isHindi ? 'अपनी फसल के लिए 30-मिनट का निश्चित समय चुनें और लाइन में लगने से बचें।' : 'Reserve your 30-minute arrival window to sell produce without waiting in long queues.'}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCentreForBooking(null);
            setIsBookingModalOpen(true);
          }}
          className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-black text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 shrink-0 touch-target min-h-[48px] hover:scale-[1.02] active:scale-[0.98] border border-agri-gold-dark/20 cursor-pointer"
        >
          <Wheat className="w-4 h-4 stroke-[2.5]" />
          <span>{isHindi ? 'नया स्लॉट बुक करें →' : 'Book a Mandi Slot →'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. STATE-AWARE PRIMARY HERO CARD: "WHAT DO I NEED TO DO NOW?"             */}
      {/* ========================================================================= */}
      <div className="bg-[#17432A] text-white rounded-3xl p-6 sm:p-7 shadow-agri-md relative overflow-hidden space-y-6 border-2 border-agri-gold/40">
        
        {/* Top Header: Greeting & Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-agri-gold/20 text-agri-gold px-3 py-1 rounded-full border border-agri-gold/30 text-xs font-mono font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-agri-gold" />
              <span>{isHindi ? 'आपकी वर्तमान स्थिति' : 'Your Visit Status'}</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              {isHindi ? `नमस्ते, ${farmerDisplayName}` : `Namaste, ${farmerDisplayName}`}
            </h1>
          </div>

          {activeBooking && (
            <span className="text-xs text-agri-ivory/90 bg-[#102e1c] px-3.5 py-1.5 rounded-xl border border-agri-gold/20 font-mono self-start sm:self-auto">
              {isHindi ? 'केंद्र:' : 'Mandi:'} <strong className="text-agri-gold font-bold">{bookedCentre.name.split(' ')[0]} Yard</strong>
            </span>
          )}
        </div>

        {/* Multi-booking switcher tabs (if farmer has multiple tokens) */}
        {farmerBookings.length > 1 && (
          <div className="bg-[#102e1c] p-3 rounded-2xl border border-agri-gold/20 space-y-2">
            <span className="text-[11px] text-agri-gold font-bold block font-mono">
              {isHindi ? 'आपकी सक्रिय बुकिंग्स:' : 'Your Booked Tokens:'}
            </span>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {farmerBookings.map((b) => {
                const isActive = b.token === activeBooking?.token;
                return (
                  <button
                    key={b.token}
                    onClick={() => selectActiveBooking(b.token)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                      isActive
                        ? 'bg-agri-gold text-agri-green-dark shadow-sm ring-2 ring-white/40'
                        : 'bg-[#17432A] text-agri-ivory hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <span>{b.token}</span>
                    <span className="text-[10px] opacity-80">({b.crop?.split(' ')[0] || 'Crop'} • {b.status})</span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-agri-green-dark" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* STATE A: NO ACTIVE BOOKING                                            */}
        {/* --------------------------------------------------------------------- */}
        {!activeBooking && (
          <div className="p-6 rounded-2xl bg-[#123621] border border-agri-gold/25 text-center space-y-4 font-sans">
            <div className="w-12 h-12 rounded-2xl bg-agri-gold/20 text-agri-gold mx-auto flex items-center justify-center font-bold border border-agri-gold/30">
              <Wheat className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                {isHindi ? 'क्या आप अपनी फसल एमएसपी पर बेचना चाहते हैं?' : 'Ready to Sell Your Crop at MSP?'}
              </h2>
              <p className="text-xs text-agri-ivory/80 leading-relaxed">
                {isHindi
                  ? 'अपना आगमन स्लॉट अभी बुक करें, डिजिटल टोकन प्राप्त करें और सीधे बैंक खाते में भुगतान पाएं।'
                  : 'Book an arrival slot at your nearby APMC Mandi to avoid waiting in long queues and guarantee your MSP payout.'}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCentreForBooking(null);
                setIsBookingModalOpen(true);
              }}
              className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-black text-sm px-6 py-3.5 rounded-xl transition-all shadow-md inline-flex items-center space-x-2 cursor-pointer"
            >
              <Wheat className="w-4 h-4 stroke-[2.5]" />
              <span>{isHindi ? 'मंडी स्लॉट बुक करें →' : 'Book a Mandi Slot →'}</span>
            </button>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* STATE HOLDING YARD: MOISTURE FAILURE / SUN-DRYING REQUIRED            */}
        {/* --------------------------------------------------------------------- */}
        {activeBooking && isSuspendedDrying && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-950 via-[#3a100a] to-[#250804] border-2 border-amber-400 shadow-xl space-y-5 font-sans animate-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-400/30 pb-4">
              <div>
                <span className="text-xs text-amber-300 font-extrabold uppercase tracking-wider block font-mono bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 w-fit">
                  ☀️ {isHindi ? 'निरीक्षण स्थगित • धूप में सुखाना आवश्यक' : 'INSPECTION SUSPENDED • DRYING REQUIRED'}
                </span>
                <div className="flex items-center space-x-3 mt-1.5">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-white font-mono tracking-tight">
                    {activeBooking.token}
                  </span>
                  <span className="text-xs font-black bg-rose-500/30 text-rose-200 px-3 py-1 rounded-full border border-rose-400/40 font-mono">
                    MOISTURE: {activeBooking.moisturePercent || 19.2}%
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right bg-black/40 p-3 rounded-xl border border-amber-400/30">
                <span className="text-[11px] text-amber-200/80 block font-mono">
                  {isHindi ? 'होल्डिंग यार्ड स्थान' : 'Holding Yard Location'}
                </span>
                <span className="text-xs font-bold text-amber-300 font-mono inline-block mt-0.5">
                  {activeBooking.dryingYardLocation || 'Yard 2 • Solar Aeration Bed C'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-black/40 rounded-xl border border-amber-400/30 space-y-2 text-xs text-amber-100">
              <p className="font-bold text-sm text-amber-300 flex items-center space-x-1.5">
                <span>⚠️ {isHindi ? 'नमी 17% सीमा से अधिक है' : 'Produce Moisture Exceeds 17.0% Permissible MSP Threshold'}</span>
              </p>
              <p className="text-amber-100/90 leading-relaxed">
                {isHindi
                  ? `आपकी फसल में नमी का स्तर ${activeBooking.moisturePercent || 19.2}% मापा गया है। लॉट को यार्ड 2 के सोलर ड्राइंग बेड में स्थानांतरित कर दिया गया है। जब तक नमी 17% से नीचे नहीं आती, आपका कतार समय स्थगित (PAUSED) रहेगा।`
                  : `Your grain moisture was recorded at ${activeBooking.moisturePercent || 19.2}% (above the 17.0% MSP limit). Your lot has been directed to the on-yard solar drying bed. Your wait-time counter is PAUSED until aeration is complete.`}
              </p>
            </div>

            {/* Suspended Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs font-mono">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400 block text-[10px]">Queue Wait Timer</span>
                <strong className="text-amber-300 text-sm font-black">PAUSED ⏸</strong>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400 block text-[10px]">Target Moisture</span>
                <strong className="text-emerald-300 text-sm font-bold">&le; 17.0%</strong>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-gray-400 block text-[10px]">Aeration ETA</span>
                <strong className="text-amber-200 text-sm font-bold">~45 - 60 mins</strong>
              </div>
            </div>

            <button
              onClick={() => setFarmerTab('queue')}
              className="w-full bg-amber-400 hover:bg-amber-300 text-rose-950 font-black text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>{isHindi ? 'होल्डिंग यार्ड स्थिति देखें →' : 'View Holding Yard Telemetry →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* STATE B: UPCOMING / WAITING MANDI VISIT (GREEN CHANNEL EXPRESS PASS)  */}
        {/* --------------------------------------------------------------------- */}
        {activeBooking && isWaiting && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#123621] border-2 border-agri-gold/40 shadow-inner space-y-5 font-sans relative overflow-hidden">
            
            {/* Express Green Channel Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-agri-gold font-extrabold uppercase tracking-wider font-mono bg-agri-gold/20 px-2.5 py-0.5 rounded-full border border-agri-gold/30 inline-flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-agri-gold" />
                    <span>EXPRESS PASS • GREEN CHANNEL</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-1.5">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-white font-mono tracking-tight">
                    {activeBooking.token}
                  </span>
                  <span className="text-xs font-bold bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 font-mono">
                    {activeBooking.status || 'WAITING'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right bg-[#17432A]/80 p-3 rounded-xl border border-white/10 sm:bg-transparent sm:p-0 sm:border-0">
                <span className="text-[11px] text-agri-ivory/70 block font-mono">
                  {isHindi ? 'आवंटित काउंटर / स्टेशन' : 'Assigned Fast-Track Station'}
                </span>
                <span className="text-xs font-bold text-agri-gold font-mono bg-[#17432A] px-3 py-1 rounded-lg border border-agri-gold/30 inline-block mt-0.5">
                  {activeBooking.counter || 'Counter 2 (Main Scale)'}
                </span>
              </div>
            </div>

            {/* Visit Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#17432A]/90 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-agri-ivory/70 block uppercase font-mono">{isHindi ? 'मंडी केंद्र' : 'Procurement Mandi'}</span>
                <p className="font-bold text-white truncate">{bookedCentre.name}</p>
              </div>

              <div className="p-3 bg-[#17432A]/90 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-agri-ivory/70 block uppercase font-mono">{isHindi ? 'आगमन समय स्लॉट' : 'Arrival Slot'}</span>
                <p className="font-bold text-agri-gold font-mono truncate">{activeBooking.slotTime || 'Today • 11:00 AM – 11:30 AM'}</p>
              </div>

              <div className="p-3 bg-[#17432A]/90 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-agri-ivory/70 block uppercase font-mono">{isHindi ? 'फसल व मात्रा' : 'Crop & Quantity'}</span>
                <p className="font-bold text-white truncate">{activeBooking.crop} • {expectedQty} Qtl</p>
              </div>

              <div className="p-3 bg-[#17432A]/90 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-agri-ivory/70 block uppercase font-mono">{isHindi ? 'अनुमानित कतार इंतजार' : 'Estimated Queue'}</span>
                <p className="font-bold text-emerald-300 font-mono truncate">~{estWaitMins} min ({farmersAheadCount} ahead)</p>
              </div>
            </div>

            {/* Status explanation strip */}
            <div className="p-3 bg-[#102e1c] rounded-xl border border-agri-gold/20 flex items-center justify-between text-xs text-agri-ivory/90">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-agri-gold shrink-0" />
                <span>
                  {isHindi
                    ? 'आपका टोकन सत्यापित है। कृपया अपने समय स्लॉट के दौरान मंडी गेट पर पहुंचें।'
                    : 'Your token is confirmed. Please arrive at the mandi gate during your designated slot window.'}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => setFarmerTab('queue')}
              className="w-full bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-black text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer hover:scale-[1.01]"
            >
              <span>{isHindi ? 'लाइव कतार ट्रैक करें →' : 'Track Live Queue →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Cancel & Reschedule Actions */}
            <div className="pt-2 border-t border-white/10">
              <BookingActions
                bookingId={activeBooking.token}
                currentStatus={activeBooking.status}
              />
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* STATE C: CHECKED-IN / PROCESSING AT MANDI                             */}
        {/* --------------------------------------------------------------------- */}
        {activeBooking && (isCheckedIn || isProcessing) && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#123621] border border-blue-400/40 shadow-inner space-y-5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block font-mono">
                  {isHindi ? 'आपकी वर्तमान मंडी यात्रा' : 'YOUR CURRENT MANDI VISIT'}
                </span>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-white font-mono">
                    {activeBooking.token}
                  </span>
                  <span className="text-xs font-bold bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full border border-blue-400/40 font-mono">
                    {isCheckedIn ? 'CHECKED-IN' : 'PROCESSING'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-agri-ivory/70 block">{isHindi ? 'तौल काउंटर' : 'Weighbridge'}</span>
                <span className="text-xs font-bold text-agri-gold font-mono bg-[#17432A] px-3 py-1 rounded-lg border border-agri-gold/30 inline-block mt-0.5">
                  {activeBooking.counter || 'Counter 2'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-950/60 rounded-xl border border-blue-400/30 text-xs text-blue-100 space-y-1">
              <p className="font-bold text-sm text-white">
                {isCheckedIn
                  ? (isHindi ? 'गेट चेक-इन सत्यापित!' : 'Gate Check-In Verified!')
                  : (isHindi ? 'तौल व गुणवत्ता जांच जारी' : 'Produce Weighment & QC in Progress')}
              </p>
              <p className="text-blue-200/90 leading-relaxed">
                {isCheckedIn
                  ? (isHindi ? 'आप गेट पर पहुंच चुके हैं। कृपया तौल कांटे पर बुलाए जाने की प्रतीक्षा करें।' : 'You have checked in at Gate 1. Please proceed towards your assigned weighbridge when called.')
                  : (isHindi ? 'आपकी फसल का वजन व नमी जांच काउंटर 2 पर की जा रही है।' : 'Your produce is currently undergoing weighing and moisture testing at Counter 2.')}
              </p>
            </div>

            <button
              onClick={() => setFarmerTab('queue')}
              className="w-full bg-blue-400 hover:bg-blue-300 text-agri-green-dark font-black text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>{isHindi ? 'कतार स्थिति व लाइव टोकन देखें →' : 'Track Live Queue & Call Status →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* STATE D: PROCUREMENT COMPLETED                                        */}
        {/* --------------------------------------------------------------------- */}
        {activeBooking && isCompleted && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#123621] border border-emerald-400/40 shadow-inner space-y-5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block font-mono">
                  {isHindi ? 'सरकारी खरीद संपन्न' : 'PROCUREMENT COMPLETED'}
                </span>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-agri-gold font-mono">
                    {actualQty} Quintals
                  </span>
                  <span className="text-xs font-bold bg-emerald-500/30 text-emerald-200 px-3 py-1 rounded-full border border-emerald-400/40 font-mono">
                    {isDisbursed ? 'PAID / DISBURSED' : 'DBT PENDING'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-agri-ivory/70 block">{isHindi ? 'कुल एमएसपी भुगतान' : 'Total MSP Payout'}</span>
                <span className="text-base font-black text-emerald-300 font-mono">
                  ₹{finalPayout.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-400/30 text-xs text-emerald-100 space-y-1">
              <p className="font-bold text-sm text-white">
                {isHindi ? 'फसल तौल व रसीद स्वीकृत' : 'Produce Accepted & Approved'}
              </p>
              <p className="text-emerald-200/90 leading-relaxed">
                {isHindi
                  ? `आपकी ${activeBooking.crop} की खरीद सफलता पूर्वक संपन्न हो गई है। ₹${finalPayout.toLocaleString()} का भुगतान आपके आधार-लिंक्ड बैंक खाते में ट्रांसफर किया जा रहा है।`
                  : `Procurement recorded successfully for Token ${activeBooking.token}. Direct Benefit Transfer of ₹${finalPayout.toLocaleString()} is being processed to your linked SBI account.`}
              </p>
            </div>

            <button
              onClick={() => setFarmerTab('history')}
              className="w-full bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-black text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isHindi ? 'डिजिटल भुगतान रसीद देखें →' : 'View Payout Receipt & J-Form →'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. "YOUR BOOKING" SUMMARY CARD (Direct, Simple & Farmer-Centric)          */}
      {/* ========================================================================= */}
      {activeBooking && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-agri-ivory-muted shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-agri-ivory-muted">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-agri-green/10 text-agri-green flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-agri-text">
                  {isHindi ? 'आपकी वर्तमान बुकिंग' : 'Your Booking'}
                </h3>
                <p className="text-[11px] text-agri-text-muted">
                  {isHindi ? 'टोकन व फसल विवरण' : `Details for Token ${activeBooking.token}`}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-agri-ivory text-agri-green-dark px-2.5 py-1 rounded-lg border border-agri-ivory-muted">
              {activeBooking.token}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 bg-agri-ivory/50 rounded-2xl border border-agri-ivory-muted space-y-0.5">
              <span className="text-[10px] text-agri-text-muted font-bold uppercase">{isHindi ? 'फसल' : 'Crop'}</span>
              <p className="font-bold text-agri-text truncate">{activeBooking.crop}</p>
            </div>

            <div className="p-3 bg-agri-ivory/50 rounded-2xl border border-agri-ivory-muted space-y-0.5">
              <span className="text-[10px] text-agri-text-muted font-bold uppercase">{isHindi ? 'मात्रा' : 'Quantity'}</span>
              <p className="font-bold text-agri-text font-mono truncate">{expectedQty} Quintals</p>
            </div>

            <div className="p-3 bg-agri-ivory/50 rounded-2xl border border-agri-ivory-muted space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-agri-text-muted font-bold uppercase">{isHindi ? 'मंडी केंद्र' : 'Mandi'}</span>
              <p className="font-bold text-agri-text truncate">{bookedCentre.name.split(' ')[0]} Yard</p>
            </div>

            <div className="p-3 bg-agri-ivory/50 rounded-2xl border border-agri-ivory-muted space-y-0.5">
              <span className="text-[10px] text-agri-text-muted font-bold uppercase">{isHindi ? 'स्लॉट' : 'Slot'}</span>
              <p className="font-bold text-agri-text font-mono truncate">{activeBooking.slotTime?.split('•')[1] || '11:00 – 11:30 AM'}</p>
            </div>

            <div className="p-3 bg-agri-ivory/50 rounded-2xl border border-agri-ivory-muted space-y-0.5">
              <span className="text-[10px] text-agri-text-muted font-bold uppercase">{isHindi ? 'एमएसपी दर' : 'MSP Rate'}</span>
              <p className="font-bold text-agri-green font-mono truncate">₹{cropRate} / Qtl</p>
            </div>

            <div className="p-3 bg-agri-green-soft rounded-2xl border border-agri-green-border space-y-0.5">
              <span className="text-[10px] text-agri-green-dark font-bold uppercase">{isHindi ? 'अनुमानित भुगतान' : 'Est. Payout'}</span>
              <p className="font-bold text-agri-green-dark font-mono truncate">₹{estPayout.toLocaleString()}</p>
            </div>
          </div>

          {/* Mandi Address & Directions button */}
          <div className="p-3.5 bg-agri-ivory/60 rounded-2xl border border-agri-ivory-muted flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-agri-green shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-agri-text-muted font-bold uppercase block">{isHindi ? 'मंडी यार्ड का पता' : 'Mandi Yard Address'}</span>
                <p className="font-semibold text-agri-text">{bookedCentre.address}</p>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${bookedCentre.lat},${bookedCentre.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-agri-green hover:bg-agri-green-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-agri-gold" />
              <span>{isHindi ? 'गूगल मैप्स पर रास्ता देखें' : 'Get Directions'}</span>
            </a>
          </div>

          {/* Booking Actions (Cancel / Reschedule) */}
          <BookingActions
            bookingId={activeBooking.token}
            currentStatus={activeBooking.status}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. RECOMMENDED MANDI CARD (KisanSetu Differentiating Feature)             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-agri-green/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-agri-ivory-muted">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-agri-gold/20 text-agri-green-dark px-2.5 py-0.5 rounded-full border border-agri-gold/40 text-[10px] font-mono font-bold mb-1">
              <Sparkles className="w-3 h-3 text-agri-gold" />
              <span>{isHindi ? 'कम भीड़ वाली मंडी सिफारिश' : 'SMART MANDI RECOMMENDATION'}</span>
            </div>
            
            <h3 className="font-heading text-base sm:text-lg font-bold text-agri-text flex items-center gap-2 flex-wrap">
              <span>{isHindi ? 'सुझाई गई खरीद मंडी:' : 'Recommended:'}</span>
              <span className="text-agri-green font-black">{recommendedCentre.name}</span>
            </h3>

            <p className="text-xs text-agri-text-muted flex items-center space-x-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-agri-green shrink-0" />
              <span>{recommendedCentre.address} • <strong>{recommendedCentre.distanceKm} km away</strong></span>
            </p>
          </div>

          <button
            onClick={() => setFarmerTab('centres')}
            className="bg-agri-green hover:bg-agri-green-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-1.5 shrink-0 transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>{isHindi ? 'सभी मंडियां देखें' : 'View All Mandis'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Congestion Metrics Strip */}
        <div className="grid grid-cols-3 gap-2.5 text-center py-3 bg-agri-ivory/60 rounded-2xl border border-agri-ivory-muted">
          <div>
            <span className="text-[11px] text-agri-text-muted font-sans block">{isHindi ? 'अनुमानित इंतजार' : 'Estimated wait'}</span>
            <p className="font-heading text-base font-black text-agri-gold-dark font-mono mt-0.5">~{recommendedCentre.estWaitMinutes} min</p>
          </div>
          <div>
            <span className="text-[11px] text-agri-text-muted font-sans block">{isHindi ? 'यार्ड लोड' : 'Yard capacity'}</span>
            <p className="font-heading text-base font-black text-agri-green font-mono mt-0.5">{recommendedCentre.capacityPercent}%</p>
          </div>
          <div>
            <span className="text-[11px] text-agri-text-muted font-sans block">{isHindi ? 'सक्रिय कांटे' : 'Weighbridges'}</span>
            <p className="font-heading text-base font-black text-agri-text font-mono mt-0.5">{recommendedCentre.activeCounters} Online</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. "BEFORE YOU VISIT THE MANDI" (FAQ / PREPARATION GUIDANCE)              */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="px-1">
          <h3 className="font-heading text-base sm:text-lg font-bold text-agri-text">
            {isHindi ? 'मंडी जाने से पहले ज़रूरी बातें' : 'Before You Visit the Mandi'}
          </h3>
          <p className="text-xs text-agri-text-muted mt-0.5">
            {isHindi
              ? 'दस्तावेज़, नमी सीमा, एमएसपी बैंक भुगतान और मंडी स्थिति से जुड़े त्वरित उत्तर।'
              : 'Helpful guidance on documents, moisture limits, bank DBT payments, and congestion rerouting.'}
          </p>
        </div>
        <Accordion items={faqItems} allowMultiple={true} defaultOpenIds={[]} compact={true} />
      </div>

      {/* ========================================================================= */}
      {/* 7. SLOT BOOKING MODAL                                                     */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <SlotBookingModal
          centre={selectedCentreForBooking}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}

    </div>
  );
};
