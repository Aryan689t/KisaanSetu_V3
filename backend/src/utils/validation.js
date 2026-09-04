/**
 * Server-Side Validation Utilities for KisanSetu API
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
