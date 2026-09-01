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
  onToggle
}) => {
  return (
    <div className="border border-agri-green/15 rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-200 hover:border-agri-green/30">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between text-left transition-colors hover:bg-agri-ivory/50 focus:outline-none focus:ring-2 focus:ring-agri-gold/50 rounded-xl"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3.5 pr-2">
          {Icon && (
            <div className="p-2 rounded-lg bg-agri-green/10 text-agri-green shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h4 className="font-heading font-bold text-sm sm:text-base text-agri-text">
                {title}
              </h4>
              {badgeText && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-agri-text-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="p-1 rounded-lg bg-agri-ivory text-agri-text-muted transition-transform duration-300 shrink-0">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-agri-green' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-agri-green/10 bg-[#FFFDF9] animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export const Accordion = ({ items = [], allowMultiple = false, className = '' }) => {
  const [openIds, setOpenIds] = useState([items[0]?.id || 'item-0']);

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
    <div className={`space-y-3 ${className}`}>
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
            isOpen={isOpen}
            onToggle={handleToggle}
          >
            {typeof item.content === 'string' ? (
              <p className="text-xs sm:text-sm text-agri-text leading-relaxed">
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
