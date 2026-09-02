import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const AccordionItem = ({
  id,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = 'bg-agri-gold/20 text-agri-green-dark border-agri-gold/40',
  children,
  isOpen,
  onToggle,
  compact = false
}) => {
  return (
    <div className="border border-agri-green/15 rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-200 hover:border-agri-green/30">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`w-full flex items-center justify-between text-left transition-colors hover:bg-agri-ivory/50 focus:outline-none focus:ring-2 focus:ring-agri-gold/50 rounded-xl ${
          compact ? 'px-3.5 py-2.5 sm:px-4 sm:py-3' : 'px-4 py-3.5 sm:px-5 sm:py-4'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3 pr-2">
          {Icon && (
            <div className={`rounded-lg bg-agri-green/10 text-agri-green shrink-0 ${compact ? 'p-1.5' : 'p-2'}`}>
              <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h4 className={`font-heading font-bold text-agri-text ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
                {title}
              </h4>
              {badgeText && (
                <span className={`font-bold px-2 py-0.5 rounded-full border ${compact ? 'text-[9px]' : 'text-[10px]'} ${badgeColor}`}>
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className={`text-agri-text-muted mt-0.5 ${compact ? 'text-[11px]' : 'text-xs'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="p-1 rounded-lg bg-agri-ivory text-agri-text-muted transition-transform duration-300 shrink-0">
          <ChevronDown
            className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-transform duration-300 ${isOpen ? 'rotate-180 text-agri-green' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className={`border-t border-agri-green/10 bg-[#FFFDF9] animate-in fade-in slide-in-from-top-1 duration-200 ${
          compact ? 'px-3.5 pb-3 sm:px-4 sm:pb-3.5 pt-2 text-xs' : 'px-4 pb-4 sm:px-5 sm:pb-5 pt-1'
        }`}>
          {children}
        </div>
      )}
    </div>
  );
};

export const Accordion = ({
  items = [],
  allowMultiple = false,
  defaultOpenIds = null,
  compact = false,
  className = ''
}) => {
  const [openIds, setOpenIds] = useState(() => {
    if (defaultOpenIds !== null) return defaultOpenIds;
    return [items[0]?.id || 'item-0'];
  });

  const handleToggle = (id) => {
    if (allowMultiple) {
      setOpenIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`${compact ? 'space-y-2' : 'space-y-3'} ${className}`}>
      {items.map((item, idx) => {
        const itemId = item.id || `accordion-item-${idx}`;
        const isOpen = openIds.includes(itemId);

        return (
          <AccordionItem
            key={itemId}
            id={itemId}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            badgeText={item.badgeText}
            badgeColor={item.badgeColor}
            compact={compact}
            isOpen={isOpen}
            onToggle={handleToggle}
          >
            {typeof item.content === 'string' ? (
              <p className={`text-agri-text leading-relaxed ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                {item.content}
              </p>
            ) : (
              item.content
            )}
          </AccordionItem>
        );
      })}
    </div>
  );
};
