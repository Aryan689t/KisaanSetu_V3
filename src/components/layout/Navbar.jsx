import React, { useState } from 'react';
import { useDemo, DEMO_PROFILES } from '../../context/DemoContext';
import { Bell, Wheat, LayoutDashboard, MapPin, Clock, ReceiptText, Settings, UserCheck, Wrench, UserPlus } from 'lucide-react';
import { NotificationDrawer } from '../ui/NotificationDrawer';
import { FarmerMobileNav } from './FarmerMobileNav';
import { OnboardingModal } from '../farmer/OnboardingModal';
import { LoginModal } from '../ui/LoginModal';

export const Navbar = () => {
  const {
    activeRole,
    farmerTab,
    setFarmerTab,
    notifications,
    lang,
    setLang,
    setIsOnboardingOpen,
    setIsLoginOpen,
    user,
    t
  } = useDemo();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read && (n.forRole === activeRole || n.forRole === 'all')).length;

  // Dynamically resolve active demo identity for current activeRole
  const defaultProfile = DEMO_PROFILES?.[activeRole] || DEMO_PROFILES.farmer;
  const isMatchingUserSession = user && user.user_metadata?.role === activeRole;

  const displayName = isMatchingUserSession 
    ? (user.user_metadata?.full_name || defaultProfile.name)
    : defaultProfile.name;

  const displayEmail = isMatchingUserSession 
    ? (user.email || defaultProfile.email)
    : defaultProfile.email;

  const displayRoleTitle = isMatchingUserSession 
    ? (user.user_metadata?.roleTitle || defaultProfile.roleTitle)
    : defaultProfile.roleTitle;

  const displayInitials = isMatchingUserSession 
    ? (user.user_metadata?.initials || defaultProfile.initials)
    : defaultProfile.initials;

  return (
    <>
      <OnboardingModal />
      <LoginModal />

      {/* Top Header */}
      <header className="bg-agri-green text-white border-b border-agri-green-dark shadow-agri-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Branding Logo & DoCA Department Badge */}
            <div className="flex items-center space-x-3">
              <div
                onClick={() => setIsOnboardingOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-agri-gold flex items-center justify-center text-agri-green-dark shadow-sm border border-agri-gold-light/40 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                title="Open Language & Role Onboarding Settings"
              >
                <Wheat className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white">
                    {t('navBrand', 'KisanSetu')}
                  </span>
                  <span className="text-[10px] font-bold bg-agri-green-dark/80 text-agri-gold px-2 py-0.5 rounded border border-agri-gold/30 hidden xs:inline-block font-mono">
                    DoCA Mandi
                  </span>
                </div>
                <p className="text-[11px] text-agri-ivory/80 font-medium hidden sm:block">
                  {t('navTagline', 'Department of Consumer Affairs • Direct Crop Procurement')}
                </p>
              </div>
            </div>

            {/* Desktop Navigation / Context Bar based on activeRole */}
            {activeRole === 'farmer' && (
              <nav className="hidden md:flex items-center space-x-1 sm:space-x-1.5 bg-agri-green-dark/50 p-1.5 rounded-xl border border-agri-green-light/20 shrink-0">
                <button
                  onClick={() => setFarmerTab('dashboard')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all select-none ${
                    farmerTab === 'dashboard'
                      ? 'bg-[#FFFDF7] text-agri-green shadow-sm'
                      : 'text-agri-ivory/80 hover:text-white hover:bg-agri-green/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap leading-none">{t('home', 'Home')}</span>
                </button>

                <button
                  onClick={() => setFarmerTab('centres')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all select-none ${
                    farmerTab === 'centres'
                      ? 'bg-[#FFFDF7] text-agri-green shadow-sm'
                      : 'text-agri-ivory/80 hover:text-white hover:bg-agri-green/60'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap leading-none">{t('mandi', 'Mandi')}</span>
                </button>

                <button
                  onClick={() => setFarmerTab('queue')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all select-none ${
                    farmerTab === 'queue'
                      ? 'bg-[#FFFDF7] text-agri-green shadow-sm'
                      : 'text-agri-ivory/80 hover:text-white hover:bg-agri-green/60'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap leading-none">{t('token', 'Token')}</span>
                </button>

                <button
                  onClick={() => setFarmerTab('history')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all select-none ${
                    farmerTab === 'history'
                      ? 'bg-[#FFFDF7] text-agri-green shadow-sm'
                      : 'text-agri-ivory/80 hover:text-white hover:bg-agri-green/60'
                  }`}
                >
                  <ReceiptText className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap leading-none">{t('payment', 'Payments')}</span>
                </button>
              </nav>
            )}

            {activeRole === 'operator' && (
              <div className="hidden md:flex items-center space-x-2 bg-agri-green-dark/60 px-3.5 py-1.5 rounded-xl border border-blue-400/30 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="font-bold text-white">Sonipat Main Yard • Operator Station</span>
              </div>
            )}

            {activeRole === 'walkin' && (
              <div className="hidden md:flex items-center space-x-2 bg-agri-green-dark/60 px-3.5 py-1.5 rounded-xl border border-amber-400/30 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="font-bold text-white">APMC Mandi Gate 1 • Walk-In & Spot Token Desk</span>
              </div>
            )}

            {/* Language & Accessibility Control Bar */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              
              {/* English / Hindi Pill Switcher */}
              <div className="flex items-center bg-agri-green-dark/70 p-0.5 rounded-lg border border-agri-gold/30">
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                    lang === 'en' ? 'bg-agri-gold text-agri-green-dark shadow-sm' : 'text-agri-ivory/80 hover:text-white'
                  }`}
                >
                  EN
                </button>

                <button
                  onClick={() => setLang('hi')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                    lang === 'hi' ? 'bg-agri-gold text-agri-green-dark shadow-sm' : 'text-agri-ivory/80 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Settings / Onboarding Trigger */}
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="p-1.5 text-agri-ivory hover:text-white rounded-lg hover:bg-agri-green-dark/60 transition-colors"
                title="Settings & Language Setup"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Notification Bell */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 text-agri-ivory hover:text-white rounded-xl hover:bg-agri-green-dark/60 transition-colors touch-target"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-agri-gold text-agri-green-dark text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Account / Login Trigger */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="pl-2 sm:pl-2.5 border-l border-agri-green-light/30 flex items-center space-x-2 text-left hover:opacity-90 transition-opacity cursor-pointer"
                title="Account Settings & Authentication"
              >
                <div className="w-8 h-8 rounded-full bg-agri-gold/20 text-agri-gold flex items-center justify-center font-bold text-xs border border-agri-gold/40 shrink-0">
                  {displayInitials}
                </div>
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-bold leading-tight text-white">
                      {displayName}
                    </p>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/15 text-agri-gold border border-agri-gold/30">
                      {displayRoleTitle}
                    </span>
                  </div>
                  <p className="text-[10px] text-agri-ivory/70 leading-tight font-sans">
                    {displayEmail}
                  </p>
                </div>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR FOR FARMER */}
      {activeRole === 'farmer' && <FarmerMobileNav />}

      {/* Notification Slide-out Panel */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
