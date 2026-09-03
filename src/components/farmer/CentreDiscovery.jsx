import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { MapPin, Clock, Users, Calendar, Search, Filter, ShieldCheck, CheckCircle2, Navigation, HelpCircle, AlertTriangle, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { SlotBookingModal } from './SlotBookingModal';

export const CentreDiscovery = () => {
  const { centres, getRecommendedCentre, activeBooking, demoCondition, setFarmerTab, lang } = useDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWhyHero, setShowWhyHero] = useState(false);
  const [showOtherMandis, setShowOtherMandis] = useState(false);

  const recommendedCentre = getRecommendedCentre(centres);
  const bookedCentre = centres.find(c => c.id === activeBooking?.centreId) || centres[0];
  
  // Single source of truth for demo congestion
  const isCongestionActive = demoCondition === 'CONGESTED_SONIPAT';
  const congestedCentre = isCongestionActive ? (centres.find(c => c.id === 'cnt-sonipat') || centres[0]) : null;

  const handleOpenBooking = (centre) => {
    setSelectedCentre(centre);
    setIsModalOpen(true);
  };

  const otherCentres = centres.filter(c => c.id !== recommendedCentre.id && c.id !== bookedCentre.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-3 border-b border-agri-ivory-muted">
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-agri-text">
          {lang === 'hi' ? 'अपनी फसल के लिए मंडी चुनें' : 'Where should I go to sell my crop?'}
        </h1>
        <p className="text-xs text-agri-text-muted mt-0.5">
          {lang === 'hi'
            ? 'कम भीड़ और कम इंतजार समय वाली सबसे अच्छी मंडी का चयन करें।'
            : 'Find nearby mandis with shorter waiting times and open arrival slots.'}
        </p>
      </div>

      {/* CONGESTION ADVISORY BANNER (WHEN CONGESTION IS ACTIVE) */}
      {isCongestionActive && congestedCentre && (
        <div className="bg-amber-950/90 text-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-500 shadow-md space-y-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-900 text-amber-300 rounded-xl shrink-0 border border-amber-600">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded font-mono">
                  {lang === 'hi' ? 'राज्य मंडी यातायात सूचना' : 'STATE MANDI CONGESTION ADVISORY'}
                </span>
                <span className="text-[10px] bg-rose-900 text-rose-200 px-2 py-0.5 rounded font-bold border border-rose-700">
                  {lang === 'hi' ? 'भारी भीड़' : 'Very Busy / Heavy Traffic'}
                </span>
              </div>

              <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                {congestedCentre.name}: {lang === 'hi' ? `इंतजार समय ~${congestedCentre.estWaitMinutes} मिनट` : `Estimated Wait Time ~${congestedCentre.estWaitMinutes} min`}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-black/20 border border-amber-500/30">
                  <span className="text-rose-300 font-bold block">{congestedCentre.name}</span>
                  <span className="text-amber-100 text-[11px]">~{congestedCentre.estWaitMinutes} min wait • {congestedCentre.capacityPercent}% yard capacity</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/20 border border-emerald-500/40">
                  <span className="text-emerald-300 font-bold block">{lang === 'hi' ? 'सुझाई गई:' : 'Recommended:'} {recommendedCentre.name}</span>
                  <span className="text-emerald-100 text-[11px]">~{recommendedCentre.estWaitMinutes} min wait • {recommendedCentre.availableSlots} slots open</span>
                </div>
              </div>

              <p className="text-xs text-amber-100 leading-relaxed pt-1">
                {lang === 'hi'
                  ? `सोनीपत मंडी में ट्रकों की भारी आमद के कारण कतार लंबी है। आप नीचे किसी भी मंडी का चयन कर सामान्य रूप से स्लॉट बुक कर सकते हैं।`
                  : `Farmers are advised to choose ${recommendedCentre.name.split(' ')[0]} Yard or nearby alternative yards with open windows to avoid queue bottlenecks. Select any yard below to book.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. FIRST: YOUR BOOKED MANDI (IF FARMER HAS AN ACTIVE BOOKING)             */}
      {/* ========================================================================= */}
      {activeBooking && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-agri-green shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-agri-ivory-muted pb-3">
            <div>
              <span className="text-[11px] font-bold text-agri-green-dark bg-agri-green-soft px-3 py-1 rounded-full border border-agri-green-border font-sans inline-block mb-1.5">
                {lang === 'hi' ? 'आपकी बुक की गई मंडी' : 'Your booked mandi'}
              </span>

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-agri-text">
                {bookedCentre.name}
              </h2>

              <p className="text-xs text-agri-text-muted flex items-center space-x-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-agri-green shrink-0" />
                <span>{bookedCentre.address} • <strong>{bookedCentre.distanceKm} km away</strong></span>
              </p>
            </div>

            <div className="text-left sm:text-right font-mono bg-agri-ivory/60 p-2 sm:p-0 rounded-xl border sm:border-0 border-agri-ivory-muted">
              <span className="text-[10px] text-agri-text-muted uppercase block font-sans">Token Pass</span>
              <span className="font-bold text-lg text-agri-green font-mono">{activeBooking.token}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
            <div>
              <span className="text-agri-text-muted block">{lang === 'hi' ? 'समय स्लॉट' : 'Slot window'}</span>
              <strong className="text-agri-text font-mono block mt-0.5 text-sm">{activeBooking.slotTime || '11:00 AM – 11:30 AM'}</strong>
            </div>
            <div>
              <span className="text-agri-text-muted block">{lang === 'hi' ? 'इंतजार समय' : 'Estimated wait'}</span>
              <strong className="text-agri-gold-dark font-mono block mt-0.5 text-sm">~{bookedCentre.estWaitMinutes} min</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${bookedCentre.lat},${bookedCentre.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-agri-ivory hover:bg-agri-ivory-muted text-agri-green-dark px-4 py-3 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-1.5 border border-agri-ivory-muted transition-colors touch-target min-h-[44px]"
            >
              <Navigation className="w-3.5 h-3.5 text-agri-green" />
              <span>{lang === 'hi' ? 'रास्ता देखें' : 'Get Directions'}</span>
            </a>

            <button
              onClick={() => setFarmerTab('queue')}
              className="bg-agri-green hover:bg-agri-green-dark text-white px-4 py-3 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-1.5 transition-colors shadow-sm touch-target min-h-[44px]"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'अपनी बारी देखें' : 'View My Turn'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SECOND: RECOMMENDED / BEST OPTION FOR YOU                              */}
      {/* ========================================================================= */}
      <div className="bg-[#17432A] text-white rounded-2xl p-5 sm:p-6 shadow-agri-md relative space-y-4 border-2 border-agri-gold/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="bg-agri-gold text-agri-green-dark px-3 py-0.5 rounded-full text-xs font-extrabold shadow-sm font-mono inline-block mb-1.5">
              {lang === 'hi' ? 'सुझाई गई मंडी' : 'Best option for you'}
            </span>

            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
              {recommendedCentre.name}
            </h2>

            <p className="text-xs text-agri-ivory/80 flex items-center space-x-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-agri-gold shrink-0" />
              <span>{recommendedCentre.address} • <strong>{recommendedCentre.distanceKm} km away</strong></span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-emerald-900/80 text-emerald-200 px-3 py-1 rounded-full border border-emerald-500/40 font-bold">
              {lang === 'hi' ? 'कम इंतजार' : 'Less waiting'}
            </span>
          </div>
        </div>

        {/* Core Simple Farmer Metrics */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-[#102e1c] p-3 rounded-xl border border-agri-gold/20">
            <span className="text-[11px] text-agri-ivory/70 block">
              {lang === 'hi' ? 'इंतजार समय' : 'Estimated wait'}
            </span>
            <p className="font-heading text-xl font-extrabold text-agri-gold font-mono mt-0.5">
              ~{recommendedCentre.estWaitMinutes} min
            </p>
          </div>

          <div className="bg-[#102e1c] p-3 rounded-xl border border-agri-gold/20">
            <span className="text-[11px] text-agri-ivory/70 block">
              {lang === 'hi' ? 'स्लॉट उपलब्ध' : 'Slots available'}
            </span>
            <p className="font-heading text-xl font-extrabold text-white font-mono mt-0.5">
              {recommendedCentre.availableSlots} free
            </p>
          </div>
        </div>

        {/* Rationale Toggle */}
        <div>
          <button
            onClick={() => setShowWhyHero(!showWhyHero)}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 inline-flex items-center space-x-1.5 touch-target min-h-[36px]"
          >
            <HelpCircle className="w-4 h-4 text-agri-gold" />
            <span>{lang === 'hi' ? 'यह मंडी क्यों सुझाई गई है?' : 'Why is this recommended?'}</span>
          </button>

          {showWhyHero && (
            <div className="mt-2 p-3.5 bg-[#102e1c] rounded-xl border border-white/10 text-xs text-agri-ivory space-y-1.5 animate-in fade-in duration-200">
              <strong className="font-bold text-agri-gold block font-heading">
                {lang === 'hi' ? 'सुझाव का कारण:' : 'Recommendation Reason:'}
              </strong>
              <p className="text-agri-ivory/90 leading-relaxed">
                {recommendedCentre.recommendationReason} (~{recommendedCentre.estWaitMinutes} min wait vs ~{bookedCentre.estWaitMinutes} min at {bookedCentre.name.split(' ')[0]}).
              </p>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${recommendedCentre.lat},${recommendedCentre.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-2 transition-all touch-target min-h-[48px]"
          >
            <Navigation className="w-4 h-4 text-agri-gold" />
            <span>{lang === 'hi' ? 'रास्ता देखें' : 'Get Directions'}</span>
          </a>

          <button
            onClick={() => handleOpenBooking(recommendedCentre)}
            className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-xs px-4 py-3 rounded-xl shadow-agri-sm transition-all flex items-center justify-center space-x-2 touch-target min-h-[48px]"
          >
            <Calendar className="w-4 h-4" />
            <span>{lang === 'hi' ? 'यह मंडी चुनें और स्लॉट बुक करें' : 'Select this Mandi & Book'}</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. THIRD: OTHER NEARBY MANDIS (COLLAPSIBLE SECTION)                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-agri-ivory-muted shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5 text-agri-green" />
            <div>
              <h3 className="font-heading text-base font-bold text-agri-text">
                {lang === 'hi' ? 'अन्य नजदीकी मंडियां' : 'Other nearby mandis'}
              </h3>
              <p className="text-xs text-agri-text-muted">
                {lang === 'hi' ? `${otherCentres.length} मंडियां तुलना के लिए उपलब्ध हैं` : `${otherCentres.length} alternative mandis available`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOtherMandis(!showOtherMandis)}
            className="bg-agri-ivory hover:bg-agri-ivory-muted text-agri-green-dark px-3.5 py-2 rounded-xl text-xs font-bold border border-agri-ivory-muted transition-all touch-target min-h-[40px] inline-flex items-center space-x-1"
          >
            <span>{showOtherMandis ? (lang === 'hi' ? 'छिपाएं' : 'Hide') : (lang === 'hi' ? 'सभी देखें' : 'See all mandis')}</span>
            {showOtherMandis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* SEARCH FILTER (WHEN EXPANDED) */}
        {showOtherMandis && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-agri-text-muted" />
              <input
                type="text"
                placeholder={lang === 'hi' ? 'मंडी का नाम या ज़िला खोजें...' : 'Search mandi name or district...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-agri-ivory/60 border border-agri-ivory-muted rounded-xl text-xs text-agri-text focus:outline-none focus:ring-2 focus:ring-agri-green/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {otherCentres
                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.district.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((centre) => (
                  <div key={centre.id} className="p-4 rounded-xl border border-agri-ivory-muted bg-[#FFFDF7] space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-agri-text">{centre.name}</h4>
                        <p className="text-[11px] text-agri-text-muted flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-agri-green shrink-0" />
                          <span>{centre.distanceKm} km away</span>
                        </p>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        centre.capacityPercent > 80
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {centre.capacityPercent > 80 ? (lang === 'hi' ? 'भारी भीड़' : 'Very busy') : (lang === 'hi' ? 'कम भीड़' : 'Less waiting')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs bg-agri-ivory/50 p-2 rounded-lg">
                      <div>
                        <span className="text-[10px] text-agri-text-muted block">{lang === 'hi' ? 'इंतजार समय' : 'Wait time'}</span>
                        <strong className="text-agri-gold-dark font-mono mt-0.5 block">~{centre.estWaitMinutes} min</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-agri-text-muted block">{lang === 'hi' ? 'स्लॉट उपलब्ध' : 'Slots available'}</span>
                        <strong className="text-agri-green font-mono mt-0.5 block">{centre.availableSlots} free</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${centre.lat},${centre.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-agri-ivory hover:bg-agri-ivory-muted text-agri-green-dark py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 border border-agri-ivory-muted"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'रास्ता' : 'Directions'}</span>
                      </a>

                      <button
                        onClick={() => handleOpenBooking(centre)}
                        className="bg-agri-green hover:bg-agri-green-dark text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'बुक करें' : 'Book Slot'}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isModalOpen && selectedCentre && (
        <SlotBookingModal
          centre={selectedCentre}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
};


