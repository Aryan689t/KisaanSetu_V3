import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, Bell, CheckCircle2, Info, AlertTriangle, Check } from 'lucide-react';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsRead, activeRole } = useDemo();

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(n => n.forRole === activeRole || n.forRole === 'all');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-agri-ivory-surface h-full shadow-2xl border-l border-agri-green/20 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-agri-green text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-agri-gold" />
            <h3 className="font-heading font-semibold text-base">Notifications & SMS Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-agri-ivory hover:text-white hover:bg-agri-green-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-agri-ivory border-b border-agri-ivory-muted flex items-center justify-between text-xs">
          <span className="text-agri-text-muted font-medium">
            Showing alerts for <strong className="text-agri-green capitalize">{activeRole}</strong>
          </span>
          <button
            onClick={markNotificationsRead}
            className="text-agri-green hover:text-agri-green-dark font-bold flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-agri-text-muted">
              <Bell className="w-10 h-10 mx-auto text-agri-text-light mb-2 opacity-50" />
              <p className="text-sm font-medium">No recent notifications</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => {
              let icon = <Info className="w-4 h-4 text-blue-600" />;
              let border = 'border-l-4 border-blue-600';
              let bg = 'bg-blue-50/50';

              if (notif.type === 'success') {
                icon = <CheckCircle2 className="w-4 h-4 text-agri-status-success" />;
                border = 'border-l-4 border-agri-status-success';
                bg = 'bg-agri-green-soft/60';
              } else if (notif.type === 'warning') {
                icon = <AlertTriangle className="w-4 h-4 text-agri-status-warning" />;
                border = 'border-l-4 border-agri-status-warning';
                bg = 'bg-amber-50/80';
              }

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-r-lg border border-agri-ivory-muted paper-surface shadow-agri-sm ${border} ${
                    !notif.read ? 'ring-1 ring-agri-gold/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {icon}
                      <h4 className="text-xs font-bold text-agri-text">{notif.title}</h4>
                    </div>
                    <span className="text-[10px] text-agri-text-muted">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-agri-text-muted mt-1.5 leading-relaxed font-sans">
                    {notif.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-agri-ivory border-t border-agri-ivory-muted text-[11px] text-agri-text-muted text-center">
          📱 SMS Alerts sent to registered Indian mobile (+91 98765 43210)
        </div>

      </div>
    </div>
  );
};
