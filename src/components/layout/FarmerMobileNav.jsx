import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Home, MapPin, Ticket, CreditCard } from 'lucide-react';

export const FarmerMobileNav = () => {
  const { farmerTab, setFarmerTab, lang } = useDemo();

  const navItems = [
    {
      id: 'dashboard',
      label: lang === 'hi' ? 'मुख्य' : 'Home',
      icon: Home
    },
    {
      id: 'centres',
      label: lang === 'hi' ? 'मंडी' : 'Mandi',
      icon: MapPin
    },
    {
      id: 'queue',
      label: lang === 'hi' ? 'टोकन' : 'Token',
      icon: Ticket
    },
    {
      id: 'history',
      label: lang === 'hi' ? 'भुगतान' : 'Payment',
      icon: CreditCard
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#143621] text-white border-t border-agri-gold/30 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] px-2 py-1.5 backdrop-blur-md bg-opacity-95"
      aria-label="Farmer Mobile Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = farmerTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setFarmerTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 touch-target min-h-[48px] active:scale-95 ${
                isActive
                  ? 'bg-agri-gold text-agri-green-dark font-extrabold shadow-md transform -translate-y-0.5'
                  : 'text-agri-ivory/80 hover:text-white hover:bg-white/10 font-medium'
              }`}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] leading-none tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
