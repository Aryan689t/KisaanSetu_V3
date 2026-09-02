import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { createSlotBooking, subscribeToTokenUpdates } from '../lib/supabaseService';
import {
  initialCentres,
  initialCrops,
  initialTimeSlots,
  initialQueueItems,
  initialPastHistory,
  initialNotifications
} from '../mock/initialData';

const DemoContext = createContext();

// Comprehensive Bilingual Translation Dictionary
export const translations = {
  en: {
    // Brand & Header
    navBrand: 'KisanSetu',
    navTagline: 'Department of Consumer Affairs • Direct Crop Procurement',
    home: 'Home',
    mandi: 'Mandi Discovery',
    token: 'Token Pass',
    payment: 'Payments & History',
    farmerRole: 'Farmer View',
    operatorRole: 'Mandi Operator View',
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
    home: 'मुख्य पृष्ठ',
    mandi: 'मंडी खोजें',
    token: 'टोकन पास',
    payment: 'भुगतान व इतिहास',
    farmerRole: 'किसान दृश्य',
    operatorRole: 'मंडी ऑपरेटर दृश्य',
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

export const DemoProvider = ({ children }) => {
  // Navigation & Role State
  const [activeRole, setActiveRole] = useState('farmer'); // 'farmer' | 'operator' | 'admin'
  const [farmerTab, setFarmerTab] = useState('dashboard'); // 'dashboard' | 'centres' | 'queue' | 'history'

  // Language & Accessibility State
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Supabase Auth State
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
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

  // Dynamic Congestion Demo Condition
  const [demoCondition, setDemoConditionState] = useState('NORMAL');
  
  // Alert Dismissal State
  const [dismissedRerouteAlert, setDismissedRerouteAlert] = useState(false);

  // Active Selected Booking
  const activeBooking = queueItems.find(q => q.token === 'SNP-014') || queueItems[3];

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

  // Compute recommended centre dynamically based on live telemetry load score
  const getRecommendedCentre = (centresList = centres) => {
    if (!centresList || centresList.length === 0) return initialCentres[0];
    
    const scored = centresList.map(c => {
      const score = (c.estWaitMinutes * 0.4) + (c.capacityPercent * 0.4) - (c.availableSlots * 0.5) - (c.activeCounters * 1.5) + (c.distanceKm * 0.2);
      return { ...c, score };
    });

    scored.sort((a, b) => a.score - b.score);
    return scored[0];
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
            queueCount: 14,
            estWaitMinutes: 31,
            capacityPercent: 62,
            availableSlots: 11,
            status: 'NORMAL',
            recommended: true,
            recommendationReason: 'Optimal queue clearance & available capacity (~31 min wait).'
          };
        }
        return c;
      }));

      addNotification(
        '⚠️ Mandi Congestion Alert',
        'Sonipat Main Yard is experiencing heavy truck backlog (~67 min wait). Panipat Mandi (~31 min wait) is currently recommended.',
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
  const switchBookingCentre = (newCentreId) => {
    const targetCentre = centres.find(c => c.id === newCentreId);
    if (!targetCentre) return;

    setQueueItems(prev => prev.map(item => {
      if (item.token === 'SNP-014') {
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

    addNotification(
      'Mandi Rerouted Successfully!',
      `Token SNP-014 switched to ${targetCentre.name}. Estimated wait time reduced to ~${targetCentre.estWaitMinutes} mins.`,
      'success',
      'farmer'
    );
  };

  // Book New Slot
  const bookSlot = async ({ centreId, cropName, slotTime, expectedQty }) => {
    const centre = centres.find(c => c.id === centreId) || centres[0];
    const newTokenNum = `SNP-0${queueItems.length + 11}`;
    
    // Write to Supabase Realtime Service
    await createSlotBooking({
      centreId: centre.id,
      cropName: cropName || 'Paddy (Grade A)',
      slotTime: slotTime || '11:30 AM - 12:00 PM',
      expectedQty: Number(expectedQty) || 40,
      token: newTokenNum,
      farmerName: user?.user_metadata?.full_name || 'Ramesh Singh (YOU)',
      mobile: user?.email || '+91 98765 43210'
    });

    const newBooking = {
      token: newTokenNum,
      farmerName: user?.user_metadata?.full_name || 'Ramesh Singh (YOU)',
      mobile: user?.email || '+91 98765 43210',
      aadhaarLast4: '4821',
      crop: cropName || 'Paddy (Grade A)',
      expectedQty: Number(expectedQty) || 40,
      actualQty: null,
      moisturePercent: null,
      qualityGrade: null,
      counter: 'Assigned on arrival',
      slotTime: slotTime || '11:30 AM - 12:00 PM',
      centreId: centre.id,
      centreName: centre.name,
      status: 'WAITING',
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bookingId: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ratePerQuintal: 2200,
      paymentStatus: 'PENDING'
    };

    setQueueItems(prev => [...prev, newBooking]);

    setCentres(prev => prev.map(c => {
      if (c.id === centreId) {
        return {
          ...c,
          queueCount: c.queueCount + 1,
          availableSlots: Math.max(0, c.availableSlots - 1)
        };
      }
      return c;
    }));

    addNotification(
      'Slot Booked Successfully!',
      `Token ${newTokenNum} generated for ${centre.name} (${slotTime}).`,
      'success',
      'farmer'
    );

    setFarmerTab('queue');
  };

  // Check-In Farmer
  const checkInFarmer = (tokenStr) => {
    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        return { ...item, status: 'CHECKED_IN' };
      }
      return item;
    }));

    addNotification(
      'Farmer Checked-In',
      `Token ${tokenStr} marked as Checked In at gate control.`,
      'info',
      'operator'
    );

    if (tokenStr === 'SNP-014') {
      addNotification(
        'Check-in Confirmed',
        'You have successfully checked in at Sonipat Main Procurement Centre gate.',
        'success',
        'farmer'
      );
    }
  };

  // Call Next Farmer
  const callNextFarmer = (tokenStr = 'SNP-014', counterName = 'Counter 2') => {
    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        return { ...item, status: 'PROCESSING', counter: counterName };
      }
      return item;
    }));

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
  const completeProcurement = ({ tokenStr = 'SNP-014', actualQty = 38.5, moisturePercent = 12.4, qualityGrade = 'Grade A' }) => {
    const qty = Number(actualQty);
    const rate = 2200;
    const totalPayout = Math.round(qty * rate);
    const formulaStr = `${qty} quintals × ₹${rate.toLocaleString()}/quintal = ₹${totalPayout.toLocaleString()}`;

    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        return {
          ...item,
          status: 'COMPLETED',
          actualQty: qty,
          moisturePercent: Number(moisturePercent),
          qualityGrade,
          completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          paymentStatus: 'PENDING_DISBURSAL',
          totalAmount: totalPayout,
          formula: formulaStr
        };
      }
      return item;
    }));

    const newHistoryItem = {
      id: `HIST-2026-${Math.floor(10 + Math.random() * 90)}`,
      season: 'Kharif 2026',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      centre: 'Sonipat Main Procurement Centre',
      crop: 'Paddy (Grade A)',
      expectedQty: 40.0,
      actualQty: qty,
      ratePerQuintal: rate,
      totalAmount: totalPayout,
      formula: formulaStr,
      qualityGrade,
      moisturePercent: Number(moisturePercent),
      procurementStatus: 'COMPLETED',
      paymentStatus: 'PENDING_DISBURSAL',
      dbtReference: 'DBT-UTIB000984210 (Pending)',
      bankAccount: 'State Bank of India (****4092)'
    };

    setPastHistory(prev => [newHistoryItem, ...prev]);

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
  const disbursePayment = (tokenStr = 'SNP-014') => {
    let disbursedAmount = 84700;
    let farmerName = 'Ramesh Singh';

    setQueueItems(prev => prev.map(item => {
      if (item.token === tokenStr) {
        disbursedAmount = item.totalAmount || 84700;
        farmerName = item.farmerName.replace(' (YOU)', '');
        return { ...item, paymentStatus: 'DISBURSED' };
      }
      return item;
    }));

    setPastHistory(prev => prev.map(h => {
      if (h.paymentStatus === 'PENDING_DISBURSAL') {
        return {
          ...h,
          paymentStatus: 'DISBURSED',
          dbtReference: 'DBT-UTIB000984210'
        };
      }
      return h;
    }));

    addNotification(
      '₹ MSP Payment Disbursed!',
      `Direct Benefit Transfer of ₹${disbursedAmount.toLocaleString()} credited to SBI A/C ****4092. Ref: DBT-UTIB000984210.`,
      'success',
      'farmer'
    );

    addNotification(
      'DBT Payment Released',
      `Released payment of ₹${disbursedAmount.toLocaleString()} for ${farmerName} (${tokenStr}).`,
      'info',
      'admin'
    );
  };

  // Demo Login Quick Role Switcher & Authentication
  const loginWithRole = (role, email = '') => {
    setActiveRole(role);
    const mockUser = {
      id: `usr-${role}-${Date.now()}`,
      email: email || `${role}@kisansetu.gov.in`,
      user_metadata: {
        full_name: role === 'farmer' ? 'Ramesh Singh' : role === 'operator' ? 'Rajesh Kumar (Yard Incharge)' : 'S. K. Sharma (DoCA Admin)',
        role: role
      }
    };
    setUser(mockUser);
    setIsLoginOpen(false);

    const roleName = role === 'farmer' ? 'Farmer' : role === 'operator' ? 'Mandi Operator' : 'DoCA Admin';
    addNotification('Authentication Successful', `Signed in as ${mockUser.user_metadata.full_name} (${roleName}).`, 'success', role);
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    addNotification('Signed Out', 'You have been safely signed out.', 'info', activeRole);
  };

  // Reset demo state
  const resetDemoState = () => {
    setCentres(initialCentres);
    setTimeSlots(initialTimeSlots);
    setQueueItems(initialQueueItems);
    setPastHistory(initialPastHistory);
    setNotifications(initialNotifications);
    setFarmerTab('dashboard');
    setDemoConditionState('NORMAL');
    setDismissedRerouteAlert(false);
    addNotification('Demo State Reset', 'Restored initial mock dataset & normal load conditions.', 'info', activeRole);
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
        demoCondition,
        setDemoCondition,
        dismissedRerouteAlert,
        setDismissedRerouteAlert,
        getRecommendedCentre,
        switchBookingCentre,
        bookSlot,
        checkInFarmer,
        callNextFarmer,
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
