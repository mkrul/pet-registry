/**
 * Normalizes a phone number to 10 digits by removing all non-digit characters
 * and handling US country code (1) prefix
 * @param {string} phoneNumber - The phone number to normalize
 * @returns {string} - Normalized 10-digit phone number
 */
export function normalizePhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // If it starts with 1, remove it (US country code)
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return digitsOnly.slice(1);
  }

  return digitsOnly;
}

/**
 * Formats a 10-digit phone number as (XXX) XXX-XXXX
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber || phoneNumber.length !== 10) return phoneNumber;

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
}

/**
 * Validates if a phone number is a valid 10-digit US phone number
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidPhoneNumber(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);
  return normalized.length === 10 && /^\d{10}$/.test(normalized);
}
