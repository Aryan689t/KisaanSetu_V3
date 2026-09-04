/**
 * Global Validation & Sanitization Utilities for KisanSetu
 */

/**
 * Sanitizes a mobile number string:
 * - Keeps ONLY digits (0-9)
 * - Maximum 10 digits
 */
export const sanitizeMobile = (val) => {
  if (!val) return '';
  return String(val).replace(/\D/g, '').slice(0, 10);
};

/**
 * Validates whether a mobile number is a complete, valid 10-digit number.
 * Supports standard 10-digit mobile numbers (6-9 start prefix).
 */
export const isValidMobile = (val) => {
  if (!val) return false;
  const cleaned = sanitizeMobile(val);
  return /^[6-9]\d{9}$/.test(cleaned);
};

/**
 * Sanitizes a person's name:
 * - Keeps ONLY alphabetic letters (a-z, A-Z) and spaces
 * - Collapses consecutive spaces into single space
 * - Maximum 60 characters
 */
export const sanitizePersonName = (val) => {
  if (!val) return '';
  return String(val)
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 60);
};

/**
 * Validates whether a person's name contains only valid characters,
 * is at least 2 characters long (trimmed), and contains no numbers or symbols.
 */
export const isValidPersonName = (val) => {
  if (!val) return false;
  const trimmed = String(val).trim();
  if (trimmed.length < 2 || trimmed.length > 60) return false;
  return /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(trimmed);
};

/**
 * Sanitizes Aadhaar last 4 digits:
 * - Keeps ONLY digits (0-9)
 * - Maximum 4 digits
 */
export const sanitizeAadhaarLast4 = (val) => {
  if (!val) return '';
  return String(val).replace(/\D/g, '').slice(0, 4);
};

/**
 * Validates Aadhaar last 4 digits (exactly 4 numeric digits)
 */
export const isValidAadhaarLast4 = (val) => {
  if (!val) return false;
  return /^\d{4}$/.test(String(val).trim());
};
