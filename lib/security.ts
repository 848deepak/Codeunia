// Security utility functions

/**
 * Sanitizes input to prevent XSS attacks
 * @param input - The input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove HTML tags and encode special characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns Validation result with errors
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Generates a CSRF token
 * @returns A random CSRF token
 */
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Validates email format
 * @param email - The email to validate
 * @returns Whether the email is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Rate limiting helper
 * @param key - The key to track rate limiting
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns Whether the request should be allowed
 */
export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');
  
  // Remove old attempts outside the window
  const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (validAttempts.length >= maxAttempts) {
    return false;
  }
  
  validAttempts.push(now);
  localStorage.setItem(`rateLimit_${key}`, JSON.stringify(validAttempts));
  return true;
}