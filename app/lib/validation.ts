/**
 * Check if email already exists in the database
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  // Validation is now done server-side via API
  // This is a placeholder - signup will catch duplicates
  return false;
}

/**
 * Check if phone number already exists in the database
 */
export async function checkPhoneExists(phone: string): Promise<boolean> {
  // Phone validation is now done server-side via API
  // This is a placeholder - signup will catch duplicates
  return false;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (basic)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/; // At least 10 characters
  return phoneRegex.test(phone);
}
