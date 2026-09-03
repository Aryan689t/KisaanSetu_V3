import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { FarmerAuth } from '../auth/FarmerAuth';
import { OperatorAuth } from '../auth/OperatorAuth';
import { AdminAuth } from '../auth/AdminAuth';
import { LandingPage } from '../landing/LandingPage';

export const LoginGate = () => {
  const { loginWithRole, lang, setLang } = useDemo();
  const [portalView, setPortalView] = useState(null); // null | 'farmer-auth' | 'operator-auth' | 'admin-auth'

  if (portalView === 'farmer-auth') {
    return <FarmerAuth onBack={() => setPortalView(null)} />;
  }

  if (portalView === 'operator-auth') {
    return <OperatorAuth onBack={() => setPortalView(null)} />;
  }

  if (portalView === 'admin-auth') {
    return <AdminAuth onBack={() => setPortalView(null)} />;
  }

  return (
    <LandingPage onSelectPortal={(portalName) => setPortalView(portalName)} />
  );
};
