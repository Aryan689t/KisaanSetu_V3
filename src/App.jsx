import React, { useState, useEffect } from 'react';
import { DemoProvider, useDemo } from './context/DemoContext';
import { Navbar } from './components/layout/Navbar';
import { SubtleDemoBar } from './components/layout/SubtleDemoBar';
import { Footer } from './components/layout/Footer';
import { LoginGate } from './components/layout/LoginGate';
import { FarmerAuth } from './components/auth/FarmerAuth';
import { OperatorAuth } from './components/auth/OperatorAuth';
import { AdminAuth } from './components/auth/AdminAuth';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { CentreDiscovery } from './components/farmer/CentreDiscovery';
import { LiveQueueTracker } from './components/farmer/LiveQueueTracker';
import { FarmerHistory } from './components/farmer/FarmerHistory';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { KisanAIChat } from './components/KisanAIChat';

const MainContent = () => {
  const { activeRole, farmerTab } = useDemo();

  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full ${activeRole === 'farmer' ? 'pb-24 md:pb-8' : ''}`}>
      {activeRole === 'farmer' && (
        <>
          {farmerTab === 'dashboard' && <FarmerDashboard />}
          {farmerTab === 'centres' && <CentreDiscovery />}
          {farmerTab === 'queue' && <LiveQueueTracker />}
          {farmerTab === 'history' && <FarmerHistory />}
        </>
      )}

      {activeRole === 'operator' && <OperatorDashboard />}

      {activeRole === 'admin' && <AdminDashboard />}
    </main>
  );
};

const AppRoutes = () => {
  const { user } = useDemo();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (user && window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
      setCurrentPath('/');
    }
  }, [user]);

  // Protected Auth Gate: Force Dedicated Auth Portals or Selector Screen for unauthenticated visitors
  if (!user) {
    if (currentPath.includes('farmer-auth')) {
      return <FarmerAuth onBack={() => { window.history.pushState({}, '', '/'); setCurrentPath('/'); }} />;
    }
    if (currentPath.includes('operator-auth')) {
      return <OperatorAuth onBack={() => { window.history.pushState({}, '', '/'); setCurrentPath('/'); }} />;
    }
    if (currentPath.includes('admin-auth')) {
      return <AdminAuth onBack={() => { window.history.pushState({}, '', '/'); setCurrentPath('/'); }} />;
    }
    return <LoginGate />;
  }

  // Authenticated Portal View
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-agri-text selection:bg-agri-gold/30 font-sans relative">
      <SubtleDemoBar />
      <Navbar />
      <MainContent />
      <Footer />
      <KisanAIChat />
    </div>
  );
};

export default function App() {
  return (
    <DemoProvider>
      <AppRoutes />
    </DemoProvider>
  );
}
