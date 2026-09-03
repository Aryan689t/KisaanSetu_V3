import React from 'react';

export const StatusBadge = ({ status, type = 'centre' }) => {
  let label = status;
  let classes = 'bg-gray-100 text-gray-800 border-gray-200';

  if (type === 'centre') {
    if (status === 'NORMAL') {
      label = 'NORMAL LOAD';
      classes = 'bg-agri-green-soft text-agri-green-dark border-agri-green-border font-bold';
    } else if (status === 'MODERATE') {
      label = 'MODERATE QUEUE';
      classes = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
    } else if (status === 'CONGESTED') {
      label = 'HIGH CONGESTION';
      classes = 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
    }
  } else if (type === 'queue') {
    if (status === 'WAITING') {
      label = 'In Queue';
      classes = 'bg-amber-50 text-amber-900 border-amber-200 font-semibold';
    } else if (status === 'CHECKED_IN') {
      label = 'Checked-In Gate';
      classes = 'bg-blue-50 text-blue-900 border-blue-200 font-semibold';
    } else if (status === 'PROCESSING') {
      label = 'At Inspection Counter';
      classes = 'bg-agri-gold-light text-agri-gold-dark border-agri-gold font-bold';
    } else if (status === 'COMPLETED') {
      label = 'Procurement Completed';
      classes = 'bg-agri-green-soft text-agri-status-success border-agri-green-border font-bold';
    }
  } else if (type === 'payment') {
    if (status === 'PENDING') {
      label = 'Awaiting Weighment';
      classes = 'bg-gray-100 text-gray-700 border-gray-300';
    } else if (status === 'PENDING_DISBURSAL') {
      label = 'Approved / Payout Pending';
      classes = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
    } else if (status === 'DISBURSED') {
      label = 'DBT Payment Disbursed';
      classes = 'bg-agri-green-soft text-agri-status-success border-agri-green-border font-bold';
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border shadow-agri-sm ${classes}`}>
      {label}
    </span>
  );
};
