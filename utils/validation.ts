/**
 * Validation utilities for CV form fields
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: true }; // Empty is valid (optional field)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }

  return { isValid: true };
}

/**
 * Validate phone number
 * Accepts various formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: true }; // Empty is valid (optional field)
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Check if it's a valid international format or local format
  const phoneRegex = /^[\+]?[0-9]{7,15}$/;
  if (!phoneRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Invalid phone number format',
    };
  }

  return { isValid: true };
}

/**
 * Validate URL (for LinkedIn, GitHub, etc.)
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: true }; // Empty is valid (optional field)
  }

  try {
    // Try to parse as URL
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);

    // Check if it has a valid protocol
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'URL must use http or https protocol',
      };
    }

    // Check if it has a hostname
    if (!urlObj.hostname) {
      return {
        isValid: false,
        error: 'Invalid URL format',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format',
    };
  }
}

/**
 * Validate LinkedIn URL specifically
 */
export function validateLinkedInUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: true };
  }

  const urlValidation = validateUrl(url);
  if (!urlValidation.isValid) {
    return urlValidation;
  }

  // Check if it's a LinkedIn URL
  const lowerUrl = url.toLowerCase();
  if (!lowerUrl.includes('linkedin.com')) {
    return {
      isValid: false,
      error: 'Must be a LinkedIn URL',
    };
  }

  return { isValid: true };
}

/**
 * Validate GitHub URL specifically
 */
export function validateGitHubUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: true };
  }

  const urlValidation = validateUrl(url);
  if (!urlValidation.isValid) {
    return urlValidation;
  }

  // Check if it's a GitHub URL
  const lowerUrl = url.toLowerCase();
  if (!lowerUrl.includes('github.com')) {
    return {
      isValid: false,
      error: 'Must be a GitHub URL',
    };
  }

  return { isValid: true };
}

/**
 * Validate date format
 * Accepts: YYYY, MM/YYYY, Month YYYY, etc.
 */
export function validateDate(date: string): ValidationResult {
  if (!date) {
    return { isValid: true };
  }

  // Allow "Present" or "Current"
  if (date.toLowerCase() === 'present' || date.toLowerCase() === 'current') {
    return { isValid: true };
  }

  // Check various date formats
  const formats = [
    /^\d{4}$/,                           // YYYY
    /^\d{1,2}\/\d{4}$/,                  // MM/YYYY or M/YYYY
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/i,  // Month YYYY
    /^\d{4}-\d{2}$/,                     // YYYY-MM
  ];

  const isValidFormat = formats.some(regex => regex.test(date.trim()));

  if (!isValidFormat) {
    return {
      isValid: false,
      error: 'Invalid date format. Use YYYY, MM/YYYY, or Month YYYY',
    };
  }

  return { isValid: true };
}

/**
 * Validate that required fields are not empty
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
}

/**
 * Validate personal info section
 */
export function validatePersonalInfo(personalInfo: {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  address: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  // Name is required
  const nameValidation = validateRequired(personalInfo.name, 'Name');
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  // Job title is required
  const jobTitleValidation = validateRequired(personalInfo.jobTitle, 'Job Title');
  if (!jobTitleValidation.isValid) {
    errors.jobTitle = jobTitleValidation.error!;
  }

  // Email validation (optional but must be valid if provided)
  const emailValidation = validateEmail(personalInfo.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  // Phone validation (optional but must be valid if provided)
  const phoneValidation = validatePhone(personalInfo.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }

  // LinkedIn validation
  const linkedinValidation = validateLinkedInUrl(personalInfo.linkedin);
  if (!linkedinValidation.isValid) {
    errors.linkedin = linkedinValidation.error!;
  }

  // GitHub validation
  const githubValidation = validateGitHubUrl(personalInfo.github);
  if (!githubValidation.isValid) {
    errors.github = githubValidation.error!;
  }

  return errors;
}

/**
 * Validate experience entry
 */
export function validateExperience(experience: {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const jobTitleValidation = validateRequired(experience.jobTitle, 'Job Title');
  if (!jobTitleValidation.isValid) {
    errors.jobTitle = jobTitleValidation.error!;
  }

  const companyValidation = validateRequired(experience.company, 'Company');
  if (!companyValidation.isValid) {
    errors.company = companyValidation.error!;
  }

  const startDateValidation = validateDate(experience.startDate);
  if (!startDateValidation.isValid) {
    errors.startDate = startDateValidation.error!;
  }

  const endDateValidation = validateDate(experience.endDate);
  if (!endDateValidation.isValid) {
    errors.endDate = endDateValidation.error!;
  }

  return errors;
}

/**
 * Validate education entry
 */
export function validateEducation(education: {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const schoolValidation = validateRequired(education.school, 'School');
  if (!schoolValidation.isValid) {
    errors.school = schoolValidation.error!;
  }

  const degreeValidation = validateRequired(education.degree, 'Degree');
  if (!degreeValidation.isValid) {
    errors.degree = degreeValidation.error!;
  }

  const startDateValidation = validateDate(education.startDate);
  if (!startDateValidation.isValid) {
    errors.startDate = startDateValidation.error!;
  }

  const endDateValidation = validateDate(education.endDate);
  if (!endDateValidation.isValid) {
    errors.endDate = endDateValidation.error!;
  }

  return errors;
}

/**
 * Check if CV data is complete enough to export
 */
export function validateCvForExport(cvData: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!cvData.personalInfo.name) {
    errors.push('Name is required');
  }

  if (!cvData.personalInfo.jobTitle) {
    errors.push('Job title is required');
  }

  if (!cvData.personalInfo.email && !cvData.personalInfo.phone) {
    errors.push('At least one contact method (email or phone) is required');
  }

  if (!cvData.summary || cvData.summary.trim() === '') {
    errors.push('Professional summary is required');
  }

  if (!cvData.experience || cvData.experience.length === 0) {
    errors.push('At least one work experience entry is required');
  }

  if (!cvData.skills || cvData.skills.length === 0) {
    errors.push('At least one skill is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
