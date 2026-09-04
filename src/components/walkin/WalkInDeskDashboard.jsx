import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  UserPlus, 
  Users, 
  Clock, 
  CheckCircle2, 
  Printer, 
  MessageSquare, 
  Scale, 
  AlertCircle, 
  ShieldCheck, 
  Building2,
  Ticket,
  Search,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';
import { LiveQueueTable } from '../operator/LiveQueueTable';
import { sanitizePersonName, isValidPersonName, sanitizeMobile, isValidMobile, sanitizeAadhaarLast4, isValidAadhaarLast4 } from '../../lib/validation';

// Standard APMC Weighment Counters / Operator Tables
const OPERATOR_TABLES = [
  { id: 'Counter 1', name: 'Operator Table 1', label: 'Table 1 (North Scale)', shortName: 'Table 1', scaleType: 'North Scale' },
  { id: 'Counter 2', name: 'Operator Table 2', label: 'Table 2 (Main Scale)', shortName: 'Table 2', scaleType: 'Main Scale' },
  { id: 'Counter 3', name: 'Operator Table 3', label: 'Table 3 (East Scale)', shortName: 'Table 3', scaleType: 'East Scale' },
  { id: 'Counter 4', name: 'Operator Table 4', label: 'Table 4 (Express Scale)', shortName: 'Table 4', scaleType: 'Express Scale' }
];

export const WalkInDeskDashboard = () => {
  const { 
    centres, 
    crops, 
    timeSlots, 
    bookSlot, 
    queueItems, 
    lang, 
    t 
  } = useDemo();

  const isHindi = lang === 'hi';

  // Toggle state for opening/closing the form
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [farmerName, setFarmerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('5921');
  const [selectedCrop, setSelectedCrop] = useState(crops[0]?.name || 'Paddy (Grade A)');
  const [expectedQty, setExpectedQty] = useState(40);
  const [selectedCentreId, setSelectedCentreId] = useState(centres[0]?.id || 'cnt-sonipat');
  const [assignedCounter, setAssignedCounter] = useState('Counter 2');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedToken, setConfirmedToken] = useState(null);
  const [smsSimulated, setSmsSimulated] = useState(false);
  const [printSimulated, setPrintSimulated] = useState(false);

  // -------------------------------------------------------------------------
  // CONGESTION CALCULATION & AUTO-RECOMMENDATION ENGINE (Using actual live queue)
  // -------------------------------------------------------------------------
  const tableCongestionStats = OPERATOR_TABLES.map(table => {
    const waitingFarmers = queueItems.filter(q => 
      (q.counter === table.id || q.counter === table.name || q.counter === table.shortName) &&
      (q.status === 'WAITING' || q.status === 'CHECKED_IN' || q.status === 'SLOT_CONFIRMED' || q.status === 'BOOKED')
    ).length;

    const processingFarmers = queueItems.filter(q => 
      (q.counter === table.id || q.counter === table.name || q.counter === table.shortName) &&
      q.status === 'PROCESSING'
    ).length;

    const totalInQueue = waitingFarmers + processingFarmers;
    const estimatedWaitMin = Math.max(4, (waitingFarmers * 8) + (processingFarmers * 4));

    return {
      ...table,
      waitingFarmers,
      processingFarmers,
      totalInQueue,
      estimatedWaitMin
    };
  });

  // Determine least congested table dynamically
  const recommendedTable = [...tableCongestionStats].sort((a, b) => {
    if (a.totalInQueue !== b.totalInQueue) return a.totalInQueue - b.totalInQueue;
    return a.estimatedWaitMin - b.estimatedWaitMin;
  })[0] || tableCongestionStats[0];

  // Auto-select the least congested table when opening the form
  const handleOpenForm = () => {
    if (!isFormOpen) {
      setAssignedCounter(recommendedTable.id);
    }
    setIsFormOpen(true);
    setConfirmedToken(null);
  };

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const activeCropObj = crops.find(c => c.name === selectedCrop) || crops[0] || { mspRate: 2200 };
  const estimatedPayout = Math.round(Number(expectedQty || 0) * (activeCropObj.mspRate || 2200));

  // Filter all walk-in tokens from the unified queue
  const walkInBookings = queueItems.filter(q => 
    q.bookingType === 'WALK_IN' || 
    q.bookingType === 'ASSISTED' || 
    q.token?.startsWith('W-') ||
    q.token?.startsWith('SNP-W')
  );
  
  const totalWalkIns = walkInBookings.length;
  const activeInYard = queueItems.filter(q => q.status === 'CHECKED_IN' || q.status === 'PROCESSING').length;
  const totalCompleted = queueItems.filter(q => q.status === 'COMPLETED').length;

  const handleCreateWalkInBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidPersonName(farmerName)) {
      setErrorMsg(isHindi ? 'कृपया केवल अक्षरों में सही किसान का नाम दर्ज करें (2-60 अक्षर)।' : 'Please enter a valid farmer name (letters and spaces only, 2-60 characters).');
      return;
    }

    if (mobile && !isValidMobile(mobile)) {
      setErrorMsg(isHindi ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें (शुरुआत 6-9 से)।' : 'Please enter a valid 10-digit mobile number (starting with 6-9).');
      return;
    }

    if (aadhaarLast4 && !isValidAadhaarLast4(aadhaarLast4)) {
      setErrorMsg(isHindi ? 'कृपया आधार के अंतिम 4 अंक सही दर्ज करें।' : 'Please enter valid 4 digits of Aadhaar.');
      return;
    }

    if (!expectedQty || Number(expectedQty) <= 0) {
      setErrorMsg(isHindi ? 'कृपया वैध फसल मात्रा दर्ज करें।' : 'Please enter a valid crop quantity.');
      return;
    }

    setIsSubmitting(true);

    try {
      const slotTimeCombined = `Today (Spot Entry) • 11:00 AM - 11:30 AM`;
      const result = await bookSlot({
        centreId: selectedCentreId,
        farmerName: farmerName.trim(),
        mobile: mobile.trim() || '+91 98000 00000',
        aadhaarLast4: aadhaarLast4.trim() || '4821',
        cropName: selectedCrop,
        expectedQty: Number(expectedQty),
        slotTime: slotTimeCombined,
        bookingType: 'WALK_IN',
        status: 'CHECKED_IN',
        counter: assignedCounter
      });

      setConfirmedToken(result);
      setSmsSimulated(false);
      setPrintSimulated(false);
    } catch (err) {
      console.error('[WalkInDesk Error]:', err);
      setErrorMsg(err.message || 'Failed to issue spot token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setConfirmedToken(null);
    setFarmerName('');
    setMobile('');
    setAadhaarLast4('5921');
    setExpectedQty(40);
    setErrorMsg('');
    setSmsSimulated(false);
    setPrintSimulated(false);
    setAssignedCounter(recommendedTable.id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setConfirmedToken(null);
    setFarmerName('');
    setMobile('');
    setAadhaarLast4('5921');
    setExpectedQty(40);
    setErrorMsg('');
    setSmsSimulated(false);
    setPrintSimulated(false);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* Walk-In Desk Header Banner */}
      <div className="bg-gradient-to-r from-[#17432A] via-[#1b5032] to-[#123621] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border-2 border-agri-gold/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-agri-gold text-agri-green-dark px-3 py-1 rounded-full text-xs font-extrabold shadow-sm font-mono uppercase tracking-wider">
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isHindi ? 'मंडी गेट सहायता केंद्र • वॉक-इन पंजीकरण' : 'APMC GATE ASSISTED REGISTRATION DESK'}</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {isHindi ? 'वॉक-इन किसान ऑन-स्पॉट टोकन व काउंटर आवंटन' : 'Walk-In Registration & Smart Counter Dispatch'}
            </h1>
            <p className="text-xs sm:text-sm text-agri-ivory/90 font-normal leading-relaxed">
              {isHindi
                ? 'बिना स्मार्टफोन वाले किसानों का तुरंत ऑन-स्पॉट पंजीकरण करें, सबसे कम भीड़ वाले तौल काउंटर की पहचान करें, और किसान को सही ऑपरेटर टेबल पर निर्देशित करें।'
                : 'Dedicated desk for non-smartphone farmers arriving at the APMC gate. Issues official spot tokens, detects the least-congested operator table, and dispatches farmers into the unified procurement queue.'}
            </p>
          </div>

          <div className="bg-[#102d1d]/80 backdrop-blur-md p-4 rounded-2xl border border-agri-gold/30 text-xs space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-agri-ivory/70">{isHindi ? 'डेस्क भूमिका:' : 'Desk Role:'}</span>
              <span className="font-bold text-agri-gold font-mono">Gate Registration & Dispatch</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-agri-ivory/70">{isHindi ? 'तौल/खरीद:' : 'Procurement:'}</span>
              <span className="text-agri-ivory/90 font-mono">Managed by Operators</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-agri-ivory/70">{isHindi ? 'कतार एकीकरण:' : 'Queue Integration:'}</span>
              <span className="text-emerald-300 font-bold font-mono">● 100% Unified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <MetricCard
          title={isHindi ? 'वॉक-इन टोकन (आज)' : 'Walk-In Tokens Issued'}
          value={totalWalkIns}
          subtitle={isHindi ? 'गेट पर पंजीकृत किसान' : 'Directed to operator tables'}
          icon={Ticket}
          highlight={totalWalkIns > 0}
        />
        <MetricCard
          title={isHindi ? 'यार्ड में कुल सक्रिय' : 'Total Active in Yard'}
          value={activeInYard}
          subtitle={isHindi ? 'तौल व जांच जारी' : 'Checked-in & Processing'}
          icon={Users}
        />
        <MetricCard
          title={isHindi ? 'सक्रिय तौल कांटे' : 'Active Operator Tables'}
          value="4 / 4"
          subtitle={isHindi ? 'कांटे 1, 2, 3, 4 ऑनलाइन' : 'Weighbridges online'}
          icon={Scale}
        />
        <MetricCard
          title={isHindi ? 'खरीद पूर्ण' : 'Procurement Done'}
          value={totalCompleted}
          subtitle={isHindi ? 'तौल व रसीद संपन्न' : 'Completed today'}
          icon={CheckCircle2}
          badgeText="Today"
        />
      </div>

      {/* Main Workspace Layout - Pure Single Vertical Column (No Left/Right splits) */}
      <div className="space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP ACTION CARD: PROMINENT + ISSUE WALK-IN TOKEN BUTTON                */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-agri-gold/50 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold shrink-0 shadow-inner">
                <UserPlus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="font-heading font-black text-base sm:text-lg text-agri-text">
                  {isHindi ? 'ऑन-स्पॉट वॉक-इन टोकन जारी करें' : 'Issue On-Spot Walk-In Token'}
                </h2>
                <p className="text-xs text-agri-text-muted mt-0.5">
                  {isHindi
                    ? 'बिना स्मार्टफोन वाले किसानों का त्वरित पंजीकरण करें और सबसे कम भीड़ वाले काउंटर पर भेजें'
                    : 'Register non-smartphone farmer, detect least-congested operator table & issue official spot gate pass'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenForm}
              className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99] border border-agri-green-light/30 shrink-0 hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4 text-agri-gold" />
              <span>{isHindi ? '+ वॉक-इन टोकन जारी करें' : '+ Issue Walk-In Token'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. RECENT WALK-IN TOKENS / DIRECTED FARMERS (Directly underneath button)  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-agri-ivory-muted shadow-sm space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-agri-ivory-muted">
            <div className="flex items-center space-x-2">
              <Ticket className="w-4 h-4 text-agri-green" />
              <h3 className="font-heading font-bold text-sm sm:text-base text-agri-text">
                {isHindi ? 'हाल ही के वॉक-इन टोकन व काउंटर आवंटन' : 'Recent Walk-In Tokens / Directed Farmers'}
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              {walkInBookings.length} {isHindi ? 'दर्ज' : 'Registered Today'}
            </span>
          </div>

          {walkInBookings.length === 0 ? (
            <div className="text-center py-8 text-xs text-agri-text-muted">
              <Ticket className="w-9 h-9 text-gray-300 mx-auto mb-2" />
              <p className="font-medium text-sm text-agri-text">{isHindi ? 'अभी तक कोई वॉक-इन टोकन जारी नहीं हुआ है।' : 'No walk-in tokens issued yet today.'}</p>
              <p className="text-xs mt-1 text-gray-400">Click "+ Issue Walk-In Token" above to register arrivals at the gate.</p>
            </div>
          ) : (
            <div className="divide-y divide-agri-ivory-muted">
              {walkInBookings.map((item, idx) => {
                const isFirst = idx === 0;
                return (
                  <div
                    key={item.token || idx}
                    className={`py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                      isFirst && confirmedToken?.token === item.token 
                        ? 'bg-amber-50/60 p-3 rounded-xl border border-amber-300 animate-in fade-in' 
                        : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono font-black text-sm text-agri-green">
                          {item.token}
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded font-mono border border-amber-300">
                          WALK-IN
                        </span>
                        <span className="font-bold text-sm text-agri-text truncate">
                          {item.farmerName}
                        </span>
                      </div>
                      
                      <div className="text-xs text-agri-text-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans">
                        <span>{item.crop || item.cropName || 'Paddy'}</span>
                        <span>•</span>
                        <span>{item.expectedQty || 40} Qtl</span>
                        <span>•</span>
                        <span className="font-mono text-agri-green-dark font-black bg-agri-green-soft px-2 py-0.5 rounded border border-agri-green-border">
                          → Directed to: {item.counter || 'Operator Table 2'}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                      <span className="text-[11px] text-agri-text-muted font-mono sm:hidden">Queue Status:</span>
                      <StatusBadge status={item.status || 'CHECKED_IN'} type="queue" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. POPUP MODAL CARD: TOKEN GENERATION & SMART CONGESTION DISPATCH         */}
      {/* ========================================================================= */}
      {(isFormOpen || confirmedToken) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-agri-gold/60 p-5 sm:p-7 space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-agri-ivory-muted">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-base sm:text-lg text-agri-text">
                    {isHindi ? 'वॉक-इन किसान ऑन-स्पॉट टोकन' : 'Issue Walk-In Spot Gate Token'}
                  </h2>
                  <p className="text-xs text-agri-text-muted">
                    {isHindi ? 'गेट 1 सहायता डेस्क • ऑन-स्पॉट काउंटर आवंटन' : 'APMC Gate 1 Assisted Desk • Least-Congested Dispatch'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300 font-mono">
                  WALK_IN
                </span>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  title="Close popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!confirmedToken ? (
              <form onSubmit={handleCreateWalkInBooking} className="space-y-4">
                
                {/* Farmer Name */}
                <div>
                  <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                    {isHindi ? 'किसान का पूरा नाम (केवल अक्षर) *' : 'Farmer Full Name (Letters only) *'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={farmerName}
                    onChange={(e) => {
                      setFarmerName(sanitizePersonName(e.target.value));
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Gurdeep Singh"
                    className="w-full p-3 bg-agri-ivory/40 border border-agri-ivory-muted rounded-xl text-sm font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green outline-none"
                  />
                </div>

                {/* Mobile & Aadhaar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                      {isHindi ? 'मोबाइल नंबर (10 अंक, वैकल्पिक)' : 'Mobile (10 digits, Optional)'}
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => {
                        setMobile(sanitizeMobile(e.target.value));
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="9812345678"
                      className="w-full p-2.5 bg-agri-ivory/40 border border-agri-ivory-muted rounded-xl text-xs font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green outline-none"
                    />
                    <span className="text-[10px] text-agri-text-muted block mt-0.5">For SMS spot notification</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                      {isHindi ? 'आधार अंतिम 4 अंक' : 'Aadhaar Last 4'}
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={4}
                      value={aadhaarLast4}
                      onChange={(e) => {
                        setAadhaarLast4(sanitizeAadhaarLast4(e.target.value));
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="4821"
                      className="w-full p-2.5 bg-agri-ivory/40 border border-agri-ivory-muted rounded-xl text-xs font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green outline-none"
                    />
                    <span className="text-[10px] text-agri-text-muted block mt-0.5">For DBT Bank validation</span>
                  </div>
                </div>

                {/* Crop & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                      {isHindi ? 'फसल व किस्म *' : 'Crop & Variety *'}
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full p-2.5 bg-agri-ivory/40 border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green outline-none"
                    >
                      {crops.map(c => (
                        <option key={c.id || c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                      {isHindi ? 'अनुमानित मात्रा (क्विंटल) *' : 'Expected Qty (Qtl) *'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="500"
                      required
                      value={expectedQty}
                      onChange={(e) => setExpectedQty(e.target.value)}
                      className="w-full p-2.5 bg-agri-ivory/40 border border-agri-ivory-muted rounded-xl text-xs font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green outline-none"
                    />
                  </div>
                </div>

                {/* Mandi Centre */}
                <div>
                  <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                    {isHindi ? 'खरीद मंडी केंद्र *' : 'Procurement Mandi *'}
                  </label>
                  <select
                    value={selectedCentreId}
                    onChange={(e) => setSelectedCentreId(e.target.value)}
                    className="w-full p-2.5 bg-agri-ivory/40 border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green outline-none"
                  >
                    {centres.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.district})</option>
                    ))}
                  </select>
                </div>

                {/* ========================================================================= */}
                {/* CONGESTION-AWARE OPERATOR TABLE DISPATCH & RECOMMENDATION                 */}
                {/* ========================================================================= */}
                <div className="space-y-2.5 pt-2 border-t border-agri-ivory-muted">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-agri-text uppercase tracking-wider">
                      {isHindi ? 'ऑपरेटर टेबल / काउंटर आवंटन *' : 'Direct Farmer to Operator Table *'}
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live Congestion Calculated
                    </span>
                  </div>

                  {/* Prominent Auto-Recommendation Card */}
                  <div 
                    onClick={() => setAssignedCounter(recommendedTable.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      assignedCounter === recommendedTable.id
                        ? 'bg-emerald-50/90 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-agri-ivory/60 border-agri-ivory-muted hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                            RECOMMENDED
                          </span>
                          <span className="text-sm font-black text-agri-text font-mono">
                            {recommendedTable.name} ({recommendedTable.scaleType})
                          </span>
                        </div>
                        <p className="text-xs text-emerald-900 font-medium mt-0.5">
                          Lowest congestion • <strong>{recommendedTable.waitingFarmers} waiting</strong> • ~{recommendedTable.estimatedWaitMin}m wait
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                      {assignedCounter === recommendedTable.id ? '✓ Selected' : 'Select'}
                    </span>
                  </div>

                  {/* All Operator Tables Grid with Live Congestion Breakdown */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {tableCongestionStats.map((table) => {
                      const isSelected = assignedCounter === table.id;
                      const isRec = recommendedTable.id === table.id;

                      return (
                        <button
                          type="button"
                          key={table.id}
                          onClick={() => setAssignedCounter(table.id)}
                          className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-agri-green-dark text-white border-agri-green-dark shadow-md ring-2 ring-agri-gold/50'
                              : 'bg-white text-agri-text hover:bg-agri-ivory border-agri-ivory-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`font-mono text-xs font-black ${isSelected ? 'text-agri-gold' : 'text-agri-green'}`}>
                              {table.shortName}
                            </span>
                            {isRec && (
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase font-mono ${
                                isSelected ? 'bg-agri-gold text-agri-green-dark' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                Best
                              </span>
                            )}
                          </div>
                          <div className={`text-xs leading-tight space-y-1 ${isSelected ? 'text-agri-ivory/80' : 'text-agri-text-muted'}`}>
                            <div>Waiting: <strong className={isSelected ? 'text-white' : 'text-agri-text'}>{table.waitingFarmers}</strong></div>
                            <div>Est. Wait: <strong className={isSelected ? 'text-white' : 'text-agri-text'}>~{table.estimatedWaitMin} min</strong></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* MSP Calculation Preview */}
                <div className="p-3.5 bg-agri-green-soft text-agri-green-dark rounded-2xl border border-agri-green-border flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-agri-green shrink-0" />
                    <span className="font-bold">MSP: ₹{activeCropObj.mspRate || 2200}/Qtl</span>
                  </div>
                  <span className="font-mono font-black text-sm text-agri-green-dark">
                    Est. Payout: ₹{estimatedPayout.toLocaleString()}
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold">
                    {errorMsg}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-agri-ivory-muted">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-5 py-3 rounded-xl text-xs font-bold text-agri-text-muted hover:bg-agri-ivory transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-agri-gold" />
                    <span>{isSubmitting ? 'Generating Spot Token...' : 'Generate Spot Token & Gate Pass'}</span>
                  </button>
                </div>

              </form>
            ) : (
              /* Confirmation Popup Card after spot token creation */
              <div className="space-y-5 animate-in zoom-in-95 duration-200">
                
                <div className="text-center space-y-1">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 font-mono inline-block">
                    ✓ SPOT TOKEN ISSUED & DIRECTED
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-agri-text">
                    Gate Pass Ready for {confirmedToken.farmerName || farmerName}
                  </h3>
                </div>

                {/* Printable Slip Card */}
                <div className="bg-[#FAF7EE] p-5 rounded-2xl border-2 border-dashed border-agri-green-border shadow-sm space-y-3.5 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-sans">Official APMC Gate Pass</span>
                      <span className="text-3xl font-black text-agri-green-dark">
                        {confirmedToken.token}
                      </span>
                    </div>
                    <div className="text-right font-sans">
                      <span className="text-[10px] text-gray-500 block">Queue Status</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 font-mono">
                        {confirmedToken.status || 'CHECKED_IN'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                    <div>
                      <span className="text-gray-500 block text-[10px]">Farmer</span>
                      <strong>{confirmedToken.farmerName || farmerName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Mobile</span>
                      <strong>{confirmedToken.mobile || mobile || '+91 98000 00000'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Mandi Centre</span>
                      <strong>{selectedCentre.name}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Directed Operator Table</span>
                      <strong className="text-agri-green-dark font-mono font-bold text-sm">{confirmedToken.counter || assignedCounter}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Crop & Quantity</span>
                      <strong>{confirmedToken.crop || selectedCrop} • {confirmedToken.expectedQty || expectedQty} Qtl</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Source Tag</span>
                      <strong className="text-amber-800">WALK_IN (Assisted Desk)</strong>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span>BARCODE: |||| | ||| |||| | ||</span>
                    <span>APMC GATE CONTROL</span>
                  </div>
                </div>

                {/* Physical Print & SMS Simulation Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPrintSimulated(true)}
                    className="p-3 bg-agri-ivory hover:bg-agri-ivory-muted text-agri-green-dark font-bold rounded-xl border border-agri-ivory-muted flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-agri-green" />
                    <span>{printSimulated ? '✓ Gate Slip Printed' : 'Print Physical Gate Slip'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSmsSimulated(true)}
                    className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-xl border border-amber-300 flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-700" />
                    <span>{smsSimulated ? '✓ SMS Dispatched' : 'Simulate SMS Notification'}</span>
                  </button>
                </div>

                {/* Simulated SMS Toast Preview */}
                {smsSimulated && (
                  <div className="p-3.5 bg-gray-900 text-gray-100 rounded-2xl text-xs space-y-1.5 animate-in slide-in-from-bottom duration-200">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>📱 SMS GATEWAY DISPATCH</span>
                      <span>DELIVERED NOW</span>
                    </div>
                    <p className="font-mono text-xs text-emerald-300">
                      "KisanSetu: Token {confirmedToken.token} issued for {farmerName}. Directed to: {confirmedToken.counter || assignedCounter}. Please proceed to your weighbridge when called."
                    </p>
                  </div>
                )}

                {/* Form Action Controls */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-agri-gold" />
                    <span>+ Issue Another</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="bg-agri-ivory hover:bg-agri-ivory-muted text-agri-text font-bold py-3 rounded-xl text-xs sm:text-sm transition-all border border-agri-ivory-muted flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Done • Close</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
