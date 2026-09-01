import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, Wheat, UserCheck, ShieldCheck, Wrench, LogOut, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginModal = () => {
  const { isLoginOpen, setIsLoginOpen, user, loginWithRole, logout, t } = useDemo();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoginOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithRole('farmer', email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-agri-green/20 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-agri-green text-white p-5 flex items-center justify-between border-b border-agri-green-dark">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                {t('loginTitle', 'Sign in to KisanSetu')}
              </h3>
              <p className="text-[11px] text-agri-ivory/80">
                {t('loginSubtitle', 'Department of Consumer Affairs Procurement Portal')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {user ? (
            /* Logged in state view */
            <div className="bg-agri-ivory p-4 rounded-xl border border-agri-gold/40 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-agri-green text-white flex items-center justify-center font-bold text-lg">
                  {user.user_metadata?.full_name?.[0] || 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-agri-text">
                    {user.user_metadata?.full_name || 'Ramesh Singh'}
                  </h4>
                  <p className="text-xs text-agri-text-muted">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold bg-agri-gold/20 text-agri-green-dark px-2 py-0.5 rounded border border-agri-gold/40">
                    Role: {user.user_metadata?.role || 'Farmer'}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout', 'Sign Out')}</span>
              </button>
            </div>
          ) : (
            /* Credentials Form & Quick Role Switcher */
            <>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-agri-text mb-1">
                    {t('emailLabel', 'Mobile / Email Address')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@kisansetu.gov.in"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-agri-text mb-1">
                    {t('passwordLabel', 'Password')}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-agri-green hover:bg-agri-green-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
                >
                  <span>{t('signInButton', 'Sign In')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-agri-text-muted uppercase">
                  {t('demoQuickLogin', 'Quick Demo Role Access')}
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Demo Role Switch Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => loginWithRole('farmer')}
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 text-center transition-all flex flex-col items-center space-y-1"
                >
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px] font-bold">{t('farmerRole', 'Farmer')}</span>
                </button>

                <button
                  onClick={() => loginWithRole('operator')}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl border border-blue-200 text-center transition-all flex flex-col items-center space-y-1"
                >
                  <Wrench className="w-5 h-5 text-blue-600" />
                  <span className="text-[11px] font-bold">{t('operatorRole', 'Operator')}</span>
                </button>

                <button
                  onClick={() => loginWithRole('admin')}
                  className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 text-center transition-all flex flex-col items-center space-y-1"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  <span className="text-[11px] font-bold">{t('adminRole', 'Admin')}</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
