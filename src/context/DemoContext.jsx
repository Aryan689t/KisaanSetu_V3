import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  createSlotBooking, 
  fetchBookings, 
  fetchCentres, 
  updateBookingStatus, 
  updateBookingProcurement, 
  disburseBookingPayment, 
  generateNextToken 
} from '../lib/supabaseService';
import { createBooking as apiCreateBooking } from '../lib/apiService';
import { calculateEstimatedWaitMinutes, evaluateMandiCongestionState, rankAndRecommendCentres } from '../lib/mandiEngine';
import {
  initialCentres,
  initialCrops,
  initialTimeSlots,
  initialQueueItems,
  initialPastHistory,
  initialNotifications
} from '../mock/initialData';

const DemoContext = createContext();

/**
 * Parses any booking's date, slot time, and status into a standardized
 * scheduled timestamp for accurate chronological sorting.
 */
export function parseBookingSchedule(booking) {
  if (!booking) return { timestamp: 0, isUpcoming: false, formattedDate: '29 Aug 2026', formattedTime: '11:00 AM' };

  const rawStr = `${booking.slotDate || ''} ${booking.slot_date || ''} ${booking.slotTime || ''} ${booking.slot_time || ''}`;
  
  // 1. Determine Date (default to Aug 29, 2026)
  let year = 2026;
  let month = 7; // August (0-indexed)
  let day = 29;

  const monthNames = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  const dateMatch = rawStr.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})(?:[,\s]+(\d{4}))?/i);
  
  if (dateMatch) {
    const mStr = dateMatch[1].toLowerCase().slice(0, 3);
    if (monthNames[mStr] !== undefined) month = monthNames[mStr];
    day = parseInt(dateMatch[2], 10);
    if (dateMatch[3]) year = parseInt(dateMatch[3], 10);
  } else if (/tomorrow/i.test(rawStr)) {
    day = 30;
  } else if (/today/i.test(rawStr)) {
    day = 29;
  } else if (booking.createdAt || booking.created_at) {
    const d = new Date(booking.createdAt || booking.created_at);
    if (!isNaN(d.getTime())) {
      year = d.getFullYear();
      month = d.getMonth();
      day = d.getDate();
    }
  }

  // 2. Determine Time (start of slot window)
  let hours = 11;
  let minutes = 0;
  const timeMatch = rawStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    const meridiem = timeMatch[3].toUpperCase();
    if (meridiem === 'PM' && h < 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    hours = h;
    minutes = m;
  }

  const scheduleDate = new Date(year, month, day, hours, minutes, 0, 0);
  const timestamp = scheduleDate.getTime();
  const isUpcoming = booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED';

  const formattedDate = scheduleDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = timeMatch ? `${timeMatch[1]}:${timeMatch[2]} ${timeMatch[3]}` : (booking.slotTime || '11:00 AM');

  return {
    timestamp,
    isUpcoming,
    scheduleDate,
    formattedDate,
    formattedTime
  };
}

// Comprehensive Bilingual Translation Dictionary
export const translations = {
  en: {
    // Brand & Header
    navBrand: 'KisanSetu',
    navTagline: 'Department of Consumer Affairs • Direct Crop Procurement',
    home: 'Home',
    mandi: 'Mandi',
    token: 'Token',
    payment: 'Payments',
    farmerRole: 'Farmer View',
    operatorRole: 'Mandi Operator View',
    walkinRole: 'Walk-In Desk View',
    adminRole: 'DoCA Admin View',
    login: 'Sign In / Account',
    logout: 'Sign Out',
    demoMode: 'Interactive Demo Mode',
    
    // Status Badges
    statusWaiting: 'Waiting for Slot',
    statusCheckedIn: 'Checked In at Gate',
    statusProcessing: 'At Inspection Counter',
    statusCompleted: 'Procurement Complete',
    statusDisbursed: 'MSP Disbursed to Bank',
    statusCongested: 'CONGESTED YARD',
    statusNormal: 'NORMAL LOAD',
    
    // Hero & Dashboard Alerts
    liveMandiStatus: 'Live Mandi Status',
    whatDoIDoNow: 'What Do I Do Now?',
    congestedAlertTitle: '⚠️ Mandi Congestion Alert',
    congestedAlertDesc: 'Waiting time increased due to high truck influx. Consider switching to nearby recommended yard.',
    switchPanipat: 'Switch to Panipat Mandi',
    keepSonipat: 'Keep Sonipat Yard',
    currentBookingAt: 'Your current token is registered at',
    estimatedWait: 'Est. Wait Time',
    assignedCounter: 'Assigned Counter',
    queuePosition: 'Queue Position',
    yourToken: 'Your Token Number',
    
    // Accordion Titles & FAQ
    bookingSummaryDetails: 'More Details & Booking Summary',
    mandiFaqTitle: 'Mandi Guidelines & Frequently Asked Questions (FAQ)',
    
    faq1Q: 'What documents are mandatory when arriving at the Mandi gate?',
    faq1A: 'Please bring your Aadhaar Card, Kisan Credit Card / Bank Passbook copy, and your KisanSetu Token Pass (digital or printed).',
    
    faq2Q: 'What is the maximum allowed moisture percentage for Grade A Paddy?',
    faq2A: 'The maximum permissible moisture limit for MSP procurement is 17%. Paddy exceeding 17% will require on-yard sun drying before weighment.',
    
    faq3Q: 'How long does MSP Direct Benefit Transfer (DBT) payment take?',
    faq3A: 'Once the Mandi Operator records your net weight and quality approval, DoCA Admin authorizes payout release within 24 to 48 hours directly into your Aadhaar-linked SBI bank account.',
    
    faq4Q: 'Can I reroute my booking if my primary Mandi is congested?',
    faq4A: 'Yes! When KisanSetu detects heavy queue congestion (>85% yard capacity), you will receive a 1-click option on your dashboard to seamlessly transfer your slot to a nearby low-wait Mandi.',
    
    // Booking Summary Breakdown
    cropGrade: 'Crop & Variety',
    expectedWeight: 'Expected Quantity',
    rateMsp: 'Government MSP Rate',
    estPayout: 'Estimated Gross Payout',
    centreLocation: 'Procurement Yard Location',
    coordinateRef: 'GPS & Gate Ref',

    // Auth Modal
    loginTitle: 'Sign in to KisanSetu',
    loginSubtitle: 'Manage crop slots, track weighment tokens, and monitor MSP payments.',
    emailLabel: 'Mobile / Email Address',
    passwordLabel: 'Password',
    signInButton: 'Sign In',
    demoQuickLogin: 'Quick Demo Role Access',
    signedInAs: 'Signed in as'
  },
  hi: {
    // Brand & Header
    navBrand: 'किसानसेतु',
    navTagline: 'उपभोक्ता मामले विभाग • प्रत्यक्ष फसल खरीद',
    home: 'होम',
    mandi: 'मंडी',
    token: 'टोकन',
    payment: 'भुगतान',
    farmerRole: 'किसान दृश्य',
    operatorRole: 'मंडी ऑपरेटर दृश्य',
    walkinRole: 'वॉक-इन डेस्क दृश्य',
    adminRole: 'विभाग प्रशासक दृश्य',
    login: 'साइन इन / खाता',
    logout: 'साइन आउट',
    demoMode: 'इंटरएक्टिव डेमो मोड',
    
    // Status Badges
    statusWaiting: 'स्लॉट की प्रतीक्षा',
    statusCheckedIn: 'गेट पर चेक-इन संपन्न',
    statusProcessing: 'जांच काउंटर पर जारी',
    statusCompleted: 'खरीद प्रक्रिया पूर्ण',
    statusDisbursed: 'एमएसपी भुगतान बैंक में प्रेषित',
    statusCongested: 'मंडी में भारी भीड़',
    statusNormal: 'सामान्य भार',
    
    // Hero & Dashboard Alerts
    liveMandiStatus: 'लाइव मंडी स्थिति',
    whatDoIDoNow: 'मुझे अब क्या करना है?',
    congestedAlertTitle: '⚠️ मंडी में भारी भीड़ की चेतावनी',
    congestedAlertDesc: 'ट्रकों की भारी आवक के कारण इंतजार समय बढ़ गया है। पास की सुझाई गई मंडी में बदलने का विचार करें।',
    switchPanipat: 'पानीपत मंडी में बदलें',
    keepSonipat: 'सोनीपत ही रखें',
    currentBookingAt: 'आपका वर्तमान टोकन इस केंद्र पर पंजीकृत है:',
    estimatedWait: 'अनुमानित इंतजार',
    assignedCounter: 'आवंटित काउंटर',
    queuePosition: 'कतार स्थिति',
    yourToken: 'आपका टोकन नंबर',
    
    // Accordion Titles & FAQ
    bookingSummaryDetails: 'अधिक विवरण व बुकिंग सारांश',
    mandiFaqTitle: 'मंडी दिशानिर्देश व अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    
    faq1Q: 'मंडी गेट पर आगमन के समय कौन से दस्तावेज अनिवार्य हैं?',
    faq1A: 'कृपया अपना आधार कार्ड, किसान क्रेडिट कार्ड / बैंक पासबुक की प्रति और अपना किसानसेतु टोकन पास (डिजिटल या प्रिंटेड) साथ लाएं।',
    
    faq2Q: 'ग्रेड ए धान के लिए अधिकतम अनुमत नमी प्रतिशत क्या है?',
    faq2A: 'एमएसपी खरीद के लिए अधिकतम अनुमत नमी की सीमा 17% है। 17% से अधिक नमी वाले धान को तौल से पहले मंडी में सुखाना होगा।',
    
    faq3Q: 'एमएसपी प्रत्यक्ष लाभ अंतरण (DBT) भुगतान में कितना समय लगता है?',
    faq3A: 'ऑपरेटर द्वारा तौल व गुणवत्ता अनुमोदन दर्ज करने के बाद, DoCA एडमिन 24 से 48 घंटों में आपके आधार से जुड़े एसबीआई बैंक खाते में सीधे भुगतान जारी कर देता है।',
    
    faq4Q: 'यदि मेरी प्राथमिक मंडी में भीड़ है तो क्या मैं बुकिंग बदल सकता हूँ?',
    faq4A: 'हाँ! जब किसानसेतु भारी कतार (>85% क्षमता) का पता लगाता है, तो आपको पास की कम प्रतीक्षा वाली मंडी में स्लॉट स्थानांतरित करने का 1-क्लिक विकल्प मिलता है।',
    
    // Booking Summary Breakdown
    cropGrade: 'फसल व किस्म',
    expectedWeight: 'अनुमानित मात्रा',
    rateMsp: 'सरकारी एमएसपी दर',
    estPayout: 'अनुमानित कुल भुगतान',
    centreLocation: 'खरीद केंद्र स्थान',
    coordinateRef: 'जीपीएस व गेट संदर्भ',

    // Auth Modal
    loginTitle: 'किसानसेतु में साइन इन करें',
    loginSubtitle: 'फसल स्लॉट प्रबंधित करें, टोकन ट्रैक करें और एमएसपी भुगतान की निगरानी करें।',
    emailLabel: 'मोबाइल / ईमेल पता',
    passwordLabel: 'पासवर्ड',
    signInButton: 'साइन इन करें',
    demoQuickLogin: 'त्वरित डेमो भूमिका पहुँच',
    signedInAs: 'के रूप में साइन इन हैं'
  }
};

// Standard Demo Profiles for hackathon and interactive presentation
export const DEMO_PROFILES = {
  farmer: {
    name: 'Ramesh Singh',
    roleTitle: 'Farmer',
    email: 'farmer@kisansetu.gov.in',
    district: 'Sonipat, Haryana',
    initials: 'RS',
    mobile: '9876543210',
    aadhaarLast4: '4092'
  },
  operator: {
    name: 'Rajesh Kumar',
    roleTitle: 'Procurement Operator',
    email: 'operator@kisansetu.gov.in',
    district: 'Sonipat Procurement Yard',
    initials: 'RK',
    mobile: '9812345678',
    aadhaarLast4: '7821'
  },
  walkin: {
    name: 'Suresh Patel',
    roleTitle: 'Gate Desk Operator',
    email: 'desk.operator@kisansetu.gov.in',
    district: 'Sonipat Main Yard • Gate 1 Desk',
    initials: 'SP',
    mobile: '9812345678',
    aadhaarLast4: '5921'
  },
  admin: {
    name: 'S. K. Sharma',
    roleTitle: 'DoCA Admin',
    email: 'admin@doca.gov.in',
    district: 'New Delhi HQ',
    initials: 'SK',
    mobile: '9811002233',
    aadhaarLast4: '1001'
  }
};

export const getDemoUserForRole = (role, customEmail = '', customData = {}) => {
  const profile = DEMO_PROFILES[role] || DEMO_PROFILES.farmer;
  const fullName = customData.fullName || customData.full_name || (customEmail && !customEmail.includes('@kisansetu.gov.in') ? customEmail.split('@')[0] : profile.name);
  const email = customEmail || profile.email;
  const district = customData.district || profile.district;
  const mobile = customData.mobile || customData.phone || profile.mobile;
  const aadhaarLast4 = customData.aadhaarLast4 || customData.aadhaar_last4 || profile.aadhaarLast4;

  return {
    id: customData.id || `usr-${role}-${role === 'farmer' ? 'ramesh' : role === 'operator' ? 'rajesh' : 'patel'}`,
    email: email,
    phone: mobile,
    mobile: mobile,
    aadhaarLast4: aadhaarLast4,
    district: district,
    user_metadata: {
      full_name: fullName,
      name: fullName,
      role: role,
      roleTitle: profile.roleTitle,
      district: district,
      initials: profile.initials,
      mobile: mobile,
      aadhaarLast4: aadhaarLast4
    },
    created_at: new Date().toISOString()
  };
};

export const DemoProvider = ({ children }) => {
  // Navigation & Role State
  const [activeRole, setActiveRoleState] = useState(() => {
    try {
      const savedRole = localStorage.getItem('kisansetu_role');
      if (savedRole && ['farmer', 'operator', 'walkin', 'admin'].includes(savedRole)) {
        return savedRole;
      }
      const savedUser = localStorage.getItem('kisansetu_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.user_metadata?.role) return parsed.user_metadata.role;
      }
      return 'farmer';
    } catch {
      return 'farmer';
    }
  });

  const [farmerTab, setFarmerTab] = useState('dashboard'); // 'dashboard' | 'centres' | 'queue' | 'history'

  // Language & Accessibility State
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // User & Authentication State (persisted across page reloads / browser reopen)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('kisansetu_user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      // Validate that the stored user session is structurally valid
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.email) {
        // Check expiration if session has expires_at timestamp
        if (parsed.expires_at && Date.now() > parsed.expires_at) {
          localStorage.removeItem('kisansetu_user');
          localStorage.removeItem('kisansetu_role');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Synchronized Role Switcher (updates activeRole and associated demo identity seamlessly)
  const setActiveRole = (role) => {
    if (!role || !['farmer', 'operator', 'walkin', 'admin'].includes(role)) return;
    setActiveRoleState(role);
    try {
      localStorage.setItem('kisansetu_role', role);
    } catch {}

    // Synchronize active user profile for demo session
    setUser((prevUser) => {
      // If real Supabase user session exists with matching role, keep it
      if (prevUser && !prevUser.id?.startsWith('usr-') && prevUser.user_metadata?.role === role) {
        return prevUser;
      }
      const nextUser = getDemoUserForRole(role);
      try {
        localStorage.setItem('kisansetu_user', JSON.stringify(nextUser));
      } catch {}
      return nextUser;
    });
  };

  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        try {
          localStorage.setItem('kisansetu_user', JSON.stringify(session.user));
          if (session.user.user_metadata?.role) {
            setActiveRoleState(session.user.user_metadata.role);
            localStorage.setItem('kisansetu_role', session.user.user_metadata.role);
          }
        } catch {}
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        try {
          localStorage.setItem('kisansetu_user', JSON.stringify(session.user));
          if (session.user.user_metadata?.role) {
            setActiveRole(session.user.user_metadata.role);
            localStorage.setItem('kisansetu_role', session.user.user_metadata.role);
          }
        } catch {}
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        try {
          localStorage.removeItem('kisansetu_user');
          localStorage.removeItem('kisansetu_role');
        } catch {}
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Translation Helper Function t(key)
  const t = (key, fallbackText) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallbackText || key;
  };

  // Application Data State
  const [centres, setCentres] = useState(initialCentres);
  const [crops] = useState(initialCrops);
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots);
  const [queueItems, setQueueItems] = useState(initialQueueItems);
  const [pastHistory, setPastHistory] = useState(initialPastHistory);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Dynamic Congestion Demo Condition
  const [demoCondition, setDemoConditionState] = useState('NORMAL');
  
  // Alert Dismissal State
  const [dismissedRerouteAlert, setDismissedRerouteAlert] = useState(false);

  // Active Selected Booking Token (persisted in localStorage across refreshes)
  const [activeBookingToken, setActiveBookingTokenState] = useState(() => {
    try {
      return localStorage.getItem('kisansetu_active_token') || 'SNP-014';
    } catch {
      return 'SNP-014';
    }
  });

  const setActiveBookingToken = (token) => {
    setActiveBookingTokenState(token);
    try {
      if (token) localStorage.setItem('kisansetu_active_token', token);
    } catch (e) {
      console.warn('Could not save active token to localStorage:', e);
    }
  };

  // Set of tokens created by the current farmer in this browser session
  const [sessionFarmerTokens, setSessionFarmerTokens] = useState(() => {
    try {
      const saved = sessionStorage.getItem('kisansetu_farmer_tokens');
      return saved ? JSON.parse(saved) : ['SNP-014'];
    } catch {
      return ['SNP-014'];
    }
  });

  // Farmer's own bookings (only bookings belonging to currently logged-in farmer)
  const rawFarmerBookings = queueItems.filter(q => {
    if (!q || !q.token) return false;

    // 1. If an authenticated Supabase user is logged in with a real UUID
    if (user?.id && !user.id.startsWith('usr-')) {
      if (q.user_id === user.id || q.farmerId === user.id) return true;
      if (user.email && (q.farmerPhone === user.email || q.mobile === user.email)) return true;
      return sessionFarmerTokens.includes(q.token);
    }

    // 2. For registered or demo farmer session:
    if (user?.mobile && (q.mobile === user.mobile || q.phone === user.mobile)) return true;
    if (user?.email && q.mobile === user.email) return true;
    if (q.token === 'SNP-014' || q.bookingId === 'BK-2026-8812') return true;
    if (sessionFarmerTokens.includes(q.token)) return true;

    return false;
  });

  // Sort chronologically:
  // 1. Upcoming/Active bookings come first (sorted by earliest scheduled date & time ascending)
  // 2. Completed/Cancelled bookings come after (sorted descending by completion date)
  const farmerBookings = [...rawFarmerBookings].sort((a, b) => {
    const parsedA = parseBookingSchedule(a);
    const parsedB = parseBookingSchedule(b);

    if (parsedA.isUpcoming && !parsedB.isUpcoming) return -1;
    if (!parsedA.isUpcoming && parsedB.isUpcoming) return 1;

    if (parsedA.isUpcoming && parsedB.isUpcoming) {
      return parsedA.timestamp - parsedB.timestamp;
    }

    return parsedB.timestamp - parsedA.timestamp;
  });

  // Dynamic activeBooking resolution
  const activeBooking = 
    farmerBookings.find(q => q.token === activeBookingToken) ||
    farmerBookings[0] ||
    null;

  const selectActiveBooking = (token) => {
    setActiveBookingToken(token);
  };

  // Fetch initial data from Supabase on mount & provide manual refresh
  const refreshBookings = async () => {
    setIsLoadingBookings(true);
    try {
      // 1. Fetch Centres from Supabase
      const centresRes = await fetchCentres();
      if (centresRes.success && centresRes.data && centresRes.data.length > 0) {
        setCentres(centresRes.data);
      }

      // 2. Fetch Bookings from Supabase
      const bookingsRes = await fetchBookings();
      if (bookingsRes.success && bookingsRes.data && bookingsRes.data.length > 0) {
        setQueueItems(bookingsRes.data);

        // Populate completed / disbursed history from real database records
        const completedFromDb = bookingsRes.data
          .filter(b => b.status === 'COMPLETED' || b.paymentStatus === 'DISBURSED')
          .map(b => ({
            id: `HIST-${b.token}`,
            season: 'Kharif 2026',
            date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '29 Aug 2026',
            centre: b.centreName || 'Sonipat Main Procurement Centre',
            crop: b.crop || b.cropName || 'Paddy (Grade A)',
            expectedQty: b.expectedQty || 40.0,
            actualQty: b.actualQty || 38.5,
            ratePerQuintal: b.ratePerQuintal || 2200,
            totalAmount: b.totalAmount || b.totalPayout || Math.round((b.actualQty || 38.5) * (b.ratePerQuintal || 2200)),
            formula: b.formula || `${b.actualQty || 38.5} quintals × ₹${(b.ratePerQuintal || 2200).toLocaleString()}/quintal`,
            qualityGrade: b.qualityGrade || 'Grade A',
            moisturePercent: b.moisturePercent || 12.4,
            procurementStatus: 'COMPLETED',
            paymentStatus: b.paymentStatus || 'DISBURSED',
            dbtReference: b.dbtReference || 'DBT-UTIB000984210',
            bankAccount: 'State Bank of India (****4092)'
          }));

        if (completedFromDb.length > 0) {
          setPastHistory(prev => {
            const existingIds = new Set(completedFromDb.map(c => c.id));
            const remaining = prev.filter(p => !existingIds.has(p.id));
            return [...completedFromDb, ...remaining];
          });
        }
      }
    } catch (err) {
      console.error('[DemoContext] Failed to sync data with Supabase:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  // Helper to add notification
  const addNotification = (title, message, type = 'info', forRole = 'farmer') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      message,
      type,
      read: false,
      forRole
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Mark all notifications as read
  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Compute recommended centre dynamically using the APMC Load Balancing Engine
  const getRecommendedCentre = (centresList = centres) => {
    if (!centresList || centresList.length === 0) return initialCentres[0];
    const ranked = rankAndRecommendCentres(centresList);
    return ranked[0] || centresList[0];
  };

  // Set Demo Condition
  const setDemoCondition = (condition) => {
    setDemoConditionState(condition);
    setDismissedRerouteAlert(false);

    if (condition === 'CONGESTED_SONIPAT') {
      setCentres(prev => prev.map(c => {
        if (c.id === 'cnt-sonipat') {
          return {
            ...c,
            queueCount: 34,
            estWaitMinutes: 67,
            capacityPercent: 94,
            status: 'CONGESTED',
            recommended: false,
            recommendationReason: 'Heavy truck backlog (~67 min wait).'
          };
        }
        if (c.id === 'cnt-panipat') {
          return {
            ...c,
            queueCount: 6,
            estWaitMinutes: 12,
            capacityPercent: 35,
            availableSlots: 11,
            status: 'NORMAL',
            recommended: true,
            recommendationReason: '⚡ 4 active counters • Fast lane (~12 min wait).'
          };
        }
        return c;
      }));

      addNotification(
        '⚠️ Mandi Congestion Alert',
        'Sonipat Main Yard is experiencing heavy truck backlog (~67 min wait). Panipat Mandi (~12 min wait) is currently recommended.',
        'warning',
        'farmer'
      );
    } else {
      setCentres(initialCentres);
      addNotification(
        'Mandi Telemetry Restored',
        'Restored normal yard capacity telemetry across state mandis.',
        'info',
        'farmer'
      );
    }
  };

  // Switch Booking Centre
  const switchBookingCentre = async (newCentreId) => {
    const targetCentre = centres.find(c => c.id === newCentreId);
    if (!targetCentre) return;

    const currentToken = activeBooking?.token || 'SNP-014';

    setQueueItems(prev => prev.map(item => {
      if (item.token === currentToken) {
        return {
          ...item,
          centreId: targetCentre.id,
          centreName: targetCentre.name,
          counter: 'Counter 1 (Assigned)',
          slotTime: '11:30 AM - 12:00 PM'
        };
      }
      return item;
    }));

    setDismissedRerouteAlert(true);

    // Persist to Supabase
    await updateBookingStatus(currentToken, activeBooking?.status || 'WAITING', { centre_id: targetCentre.id });

    addNotification(
      'Mandi Rerouted Successfully!',
      `Token ${currentToken} switched to ${targetCentre.name}. Estimated wait time reduced to ~${targetCentre.estWaitMinutes} mins.`,
      'success',
      'farmer'
    );
  };

  // Book New Slot via Backend REST API (Supports Online Farmer & Operator Assisted / Walk-In)
  const bookSlot = async ({ 
    centreId, 
    cropName, 
    slotTime, 
    slotDate, 
    expectedQty,
    farmerName = null,
    mobile = null,
    aadhaarLast4 = '4821',
    bookingType = 'ONLINE',
    status = 'WAITING',
    counter = 'Counter 2'
  }) => {
    const centre = centres.find(c => c.id === centreId) || centres[0];
    const farmerFullName = farmerName || user?.user_metadata?.full_name || 'Ramesh Singh (YOU)';
    const farmerMobile = mobile || user?.mobile || user?.email || '+91 98765 43210';
    const userId = user?.id || (user?.user_metadata?.role === 'farmer' ? user.id : 'usr-farmer-ramesh');
    
    // Call backend API (Token is generated by backend and persisted to database with slot capacity check)
    const result = await apiCreateBooking({
      centreId: centre.id,
      cropName: cropName || 'Paddy (Grade A)',
      slotTime: slotTime || '11:00 AM - 11:30 AM',
      expectedQty: Number(expectedQty) || 40,
      farmerName: farmerFullName,
      mobile: farmerMobile,
      aadhaarLast4,
      bookingType,
      status,
      counter
    });

    const bookingRecord = {
      ...result.data,
      slotDate: slotDate || 'Today (Aug 29, 2026)',
      user_id: userId,
      farmerId: userId,
      bookingType,
      status: result.data?.status || status,
      counter: result.data?.counter || counter
    };

    // Register this newly created token under current farmer session if online booking
    if (bookingRecord?.token && bookingType === 'ONLINE') {
      setSessionFarmerTokens(prev => {
        const updated = Array.from(new Set([...prev, bookingRecord.token]));
        try { sessionStorage.setItem('kisansetu_farmer_tokens', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });
      setActiveBookingToken(bookingRecord.token);
    }

    // Append newly created booking to state without overwriting existing bookings
    setQueueItems(prev => {
      const filtered = prev.filter(item => item.token !== bookingRecord.token);
      return [bookingRecord, ...filtered];
    });

    // Update centre available slot count
    setCentres(prev => prev.map(c => {
      if (c.id === centreId) {
        return {
          ...c,
          queueCount: (c.queueCount || 0) + 1,
          availableSlots: Math.max(0, (c.availableSlots || 1) - 1)
        };
      }
      return c;
    }));

    addNotification(
      bookingType === 'WALK_IN' ? 'Spot Token Issued!' : 'Slot Booked Successfully!',
      `Official Token ${bookingRecord.token} generated for ${centre.name} (${slotTime}).`,
      'success',
      bookingType === 'WALK_IN' ? 'operator' : 'farmer'
    );

    return bookingRecord;
  };

  // Mark Farmer No-Show / Cancelled
  const markFarmerNoShow = async (tokenStr) => {
    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        return { 
          ...item, 
          status: 'NO_SHOW', 
          noShowTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
      }
      return item;
    }));

    await updateBookingStatus(tokenStr, 'NO_SHOW');

    addNotification(
      'Token Marked No-Show',
      `Token ${tokenStr} was marked as No-Show. Capacity released.`,
      'info',
      'operator'
    );
  };

  // Check-In Farmer
  const checkInFarmer = async (tokenStr) => {
    // 1. Optimistic UI update
    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        return { ...item, status: 'CHECKED_IN' };
      }
      return item;
    }));

    // 2. Persist to Supabase
    await updateBookingStatus(tokenStr, 'CHECKED_IN');

    addNotification(
      'Farmer Checked-In',
      `Token ${tokenStr} marked as Checked In at gate control.`,
      'info',
      'operator'
    );

    addNotification(
      'Check-in Confirmed',
      `Token ${tokenStr} has successfully checked in at Mandi gate.`,
      'success',
      'farmer'
    );
  };

  // Call Next Farmer
  const callNextFarmer = async (tokenStr = 'SNP-014', counterName = 'Counter 2') => {
    // 1. Optimistic UI update
    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        return { ...item, status: 'PROCESSING', counter: counterName };
      }
      return item;
    }));

    // 2. Persist to Supabase
    await updateBookingStatus(tokenStr, 'PROCESSING', { counter: counterName });

    addNotification(
      'Your Turn Has Arrived!',
      `Token ${tokenStr}: Please proceed to ${counterName} immediately for crop moisture & weight inspection.`,
      'warning',
      'farmer'
    );

    addNotification(
      'Farmer Called to Counter',
      `Called ${tokenStr} to ${counterName}.`,
      'info',
      'operator'
    );
  };

  // Complete Procurement
  const completeProcurement = async ({ 
    tokenStr = 'SNP-014', 
    actualQty = 38.5, 
    moisturePercent = 14.2, 
    qualityGrade = 'Grade A', 
    ratePerQuintal = 2200,
    qualityParameters = null 
  }) => {
    const qty = Number(actualQty);
    const rate = Number(ratePerQuintal) || 2200;
    const totalPayout = Math.round(qty * rate);
    const formulaStr = `${qty} quintals × ₹${rate.toLocaleString()}/quintal = ₹${totalPayout.toLocaleString()}`;

    const effectiveQualityParams = qualityParameters || {
      moisturePercent: Number(moisturePercent),
      foreignMatter: 1.2,
      damagedGrains: 2.4,
      chalkyGrains: 3.0,
      admixture: 4.0,
      immatureGrains: 1.5,
      allPassed: true,
      inspectedAt: new Date().toISOString()
    };

    // 1. Optimistic UI update
    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        return {
          ...item,
          status: 'COMPLETED',
          actualQty: qty,
          moisturePercent: Number(moisturePercent),
          qualityGrade,
          qualityParameters: effectiveQualityParams,
          ratePerQuintal: rate,
          completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          paymentStatus: 'PENDING_DISBURSAL',
          totalAmount: totalPayout,
          totalPayout,
          formula: formulaStr
        };
      }
      return item;
    }));

    // 2. Persist to Supabase / Backend
    await updateBookingProcurement(tokenStr, {
      actualQty: qty,
      moisturePercent: Number(moisturePercent),
      qualityGrade,
      ratePerQuintal: rate,
      qualityParameters: effectiveQualityParams
    });

    const targetItem = queueItems.find(q => q.token === tokenStr);

    const newHistoryItem = {
      id: `HIST-${tokenStr}`,
      season: 'Kharif 2026',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      centre: targetItem?.centreName || 'Sonipat Main Procurement Centre',
      crop: targetItem?.crop || targetItem?.cropName || 'Paddy (Grade A)',
      expectedQty: targetItem?.expectedQty || 40.0,
      actualQty: qty,
      ratePerQuintal: rate,
      totalAmount: totalPayout,
      formula: formulaStr,
      qualityGrade,
      moisturePercent: Number(moisturePercent),
      qualityParameters: effectiveQualityParams,
      procurementStatus: 'COMPLETED',
      paymentStatus: 'PENDING_DISBURSAL',
      dbtReference: 'Pending Admin Settlement',
      bankAccount: 'State Bank of India (****4092)'
    };

    setPastHistory(prev => [newHistoryItem, ...prev.filter(h => h.id !== newHistoryItem.id)]);

    addNotification(
      'Procurement Completed!',
      `Weighed ${qty} Quintals (${qualityGrade}, ${moisturePercent}% Moisture). Calculation: ${formulaStr}. Awaiting Admin DBT Disbursal.`,
      'success',
      'farmer'
    );

    addNotification(
      'Procurement Submitted',
      `Completed inspection for ${tokenStr}. Payout: ₹${totalPayout.toLocaleString()}. Sent to Admin queue.`,
      'success',
      'operator'
    );
  };

  // Admin Disburse Payment
  const disbursePayment = async (tokenStr = 'SNP-014') => {
    let disbursedAmount = 84700;
    let targetBooking = queueItems.find(item => item.token === tokenStr);
    if (targetBooking) {
      disbursedAmount = targetBooking.totalAmount || targetBooking.totalPayout || Math.round((targetBooking.actualQty || 38.5) * (targetBooking.ratePerQuintal || 2200));
    }

    const dbtRef = `DBT-UTIB000${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Optimistic UI update
    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        return { 
          ...item, 
          paymentStatus: 'DISBURSED',
          dbtReference: dbtRef
        };
      }
      return item;
    }));

    setPastHistory(prev => prev.map(h => {
      if (h.id === `HIST-${tokenStr}` || (h.paymentStatus === 'PENDING_DISBURSAL' && tokenStr === 'SNP-014')) {
        return {
          ...h,
          paymentStatus: 'DISBURSED',
          dbtReference: dbtRef
        };
      }
      return h;
    }));

    // 2. Persist to Supabase
    await disburseBookingPayment(tokenStr, dbtRef);

    addNotification(
      '₹ MSP Payment Disbursed!',
      `Direct Benefit Transfer of ₹${disbursedAmount.toLocaleString()} credited to SBI A/C ****4092. Ref: ${dbtRef}.`,
      'success',
      'farmer'
    );

    addNotification(
      'DBT Disbursed Authorized',
      `Payment of ₹${disbursedAmount.toLocaleString()} authorized for token ${tokenStr}. Audit record logged.`,
      'info',
      'admin'
    );
  };

  // Role Switcher & Farmer Authentication Login/Register handler
  const loginWithRole = (role, email = '', userData = {}) => {
    setActiveRoleState(role);
    try {
      localStorage.setItem('kisansetu_role', role);
    } catch {}

    const authenticatedUser = getDemoUserForRole(role, email, userData);

    setUser(authenticatedUser);
    try {
      localStorage.setItem('kisansetu_user', JSON.stringify(authenticatedUser));
    } catch (e) {
      console.warn('Could not persist user session:', e);
    }
    setIsLoginOpen(false);

    const roleName = authenticatedUser.user_metadata?.roleTitle || role;
    addNotification('Authentication Successful', `Signed in as ${authenticatedUser.user_metadata.full_name} (${roleName}).`, 'success', role);
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    setUser(null);
    setSession(null);
    try {
      localStorage.removeItem('kisansetu_user');
      localStorage.removeItem('kisansetu_role');
      sessionStorage.removeItem('kisansetu_farmer_tokens');
    } catch {}
    
    // Reset browser address path to home if on a sub-route
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    addNotification('Signed Out', 'You have been safely signed out.', 'info', activeRole);
  };

  // Reset demo state
  const resetDemoState = async () => {
    setCentres(initialCentres);
    setTimeSlots(initialTimeSlots);
    setPastHistory(initialPastHistory);
    setNotifications(initialNotifications);
    setFarmerTab('dashboard');
    setDemoConditionState('NORMAL');
    setDismissedRerouteAlert(false);
    setActiveBookingToken('SNP-014');
    setSessionFarmerTokens(['SNP-014']);
    try {
      localStorage.setItem('kisansetu_active_token', 'SNP-014');
      localStorage.removeItem('kisansetu_farmer_tokens');
      sessionStorage.removeItem('kisansetu_farmer_tokens');
      localStorage.removeItem('kisansetu_user');
      localStorage.removeItem('kisansetu_role');
    } catch {}
    
    // Re-fetch clean state from Supabase
    await refreshBookings();
    addNotification('Demo State Reset', 'Restored initial dataset & normal load conditions.', 'info', activeRole);
  };

  return (
    <DemoContext.Provider
      value={{
        activeRole,
        setActiveRole,
        farmerTab,
        setFarmerTab,
        centres,
        crops,
        timeSlots,
        queueItems,
        pastHistory,
        notifications,
        activeBooking,
        farmerBookings,
        activeBookingToken,
        setActiveBookingToken,
        selectActiveBooking,
        refreshBookings,
        isLoadingBookings,
        demoCondition,
        setDemoCondition,
        dismissedRerouteAlert,
        setDismissedRerouteAlert,
        getRecommendedCentre,
        switchBookingCentre,
        bookSlot,
        checkInFarmer,
        callNextFarmer,
        markFarmerNoShow,
        completeProcurement,
        disbursePayment,
        resetDemoState,
        markNotificationsRead,
        lang,
        setLang,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isLoginOpen,
        setIsLoginOpen,
        user,
        session,
        loginWithRole,
        logout,
        t,
        translations
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
