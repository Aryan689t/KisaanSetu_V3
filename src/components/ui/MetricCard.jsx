import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, highlight = false, badgeText }) => {
  return (
    <div
      className={`p-4 rounded-xl paper-surface border transition-all ${
        highlight
          ? 'border-agri-gold bg-agri-gold-light/20 shadow-agri-md ring-1 ring-agri-gold/30'
          : 'border-agri-ivory-muted hover:border-agri-green-border shadow-agri-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-agri-text-muted uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg ${highlight ? 'bg-agri-gold text-agri-green-dark' : 'bg-agri-green-soft text-agri-green'}`}>
            <Icon className="w-4 h-4 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <h3 className="font-heading text-2xl font-bold text-agri-text tracking-tight">
          {value}
        </h3>
        {badgeText && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-agri-green-soft text-agri-green">
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-agri-text-muted mt-1 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
