/**
 * Server-Side Validation Utilities for Annagati API
 */

export const sanitizeMobile = (val) => {
  if (!val) return '';
  return String(val).replace(/\D/g, '').slice(0, 10);
};

export const isValidMobile = (val) => {
  if (!val) return false;
  const cleaned = sanitizeMobile(val);
  return /^[6-9]\d{9}$/.test(cleaned);
};

export const sanitizePersonName = (val) => {
  if (!val) return '';
  return String(val)
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 60);
};

export const isValidPersonName = (val) => {
  if (!val) return false;
  const trimmed = String(val).trim();
  if (trimmed.length < 2 || trimmed.length > 60) return false;
  return /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(trimmed);
};

export const isValidAadhaarLast4 = (val) => {
  if (!val) return false;
  return /^\d{4}$/.test(String(val).trim());
};

export const ALLOWED_BOOKING_TYPES = ['ONLINE', 'WALK_IN', 'ASSISTED'];
export const isValidBookingType = (val) => {
  if (!val) return true; // defaults to ONLINE
  return ALLOWED_BOOKING_TYPES.includes(String(val).toUpperCase());
};

export const ALLOWED_OPERATOR_CHANNELS = ['online', 'physical'];
export const isValidOperatorChannel = (val) => {
  if (!val) return true; // defaults to online
  return ALLOWED_OPERATOR_CHANNELS.includes(String(val).toLowerCase());
};

export const ALLOWED_BOOKING_STATUSES = [
  'WAITING',
  'CHECKED_IN',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
  'DRYING_REQUIRED',
  'NO_SHOW'
];
export const isValidBookingStatus = (val) => {
  if (!val) return false;
  return ALLOWED_BOOKING_STATUSES.includes(String(val).toUpperCase());
};

