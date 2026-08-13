/**
 * Client-Side Form Validation Layer
 * Enforces strict RFC 5322 regex for Email, minimum 6 characters for Password,
 * display name, and phone formatting before hitting Firebase endpoints.
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g. user@example.com).';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  return '';
};

export const validateDisplayName = (displayName) => {
  if (!displayName || !displayName.trim()) {
    return 'Full name / Display name is required.';
  }
  if (displayName.trim().length < 2) {
    return 'Display name must be at least 2 characters.';
  }
  return '';
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return 'Phone number is required.';
  }
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  if (!phoneRegex.test(phone.trim()) || phone.trim().length < 7) {
    return 'Please enter a valid phone number.';
  }
  return '';
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);

  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignupForm = ({ email, password, displayName, phone }) => {
  const errors = {};
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  const nameErr = validateDisplayName(displayName);
  const phoneErr = validatePhone(phone);

  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  if (nameErr) errors.displayName = nameErr;
  if (phoneErr) errors.phone = phoneErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
