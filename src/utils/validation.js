// Form Validation Rules
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    minLength: 6,
    message: "Password must be at least 6 characters",
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    complexityMessage: "Password must contain uppercase, lowercase, and numbers",
  },
  phone: {
    pattern: /^[\d\-\+\(\)\s]{10,}$/,
    message: "Please enter a valid phone number",
  },
  url: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: "Please enter a valid URL",
  },
};

// Validate Email
export const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!VALIDATION_RULES.email.pattern.test(email)) {
    return VALIDATION_RULES.email.message;
  }
  return null;
};

// Validate Password
export const validatePassword = (password, strict = false) => {
  if (!password) return "Password is required";
  if (password.length < VALIDATION_RULES.password.minLength) {
    return VALIDATION_RULES.password.message;
  }
  if (strict && !VALIDATION_RULES.password.pattern.test(password)) {
    return VALIDATION_RULES.password.complexityMessage;
  }
  return null;
};

// Validate Passwords Match
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

// Validate Name
export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (name.trim().length > 100) return "Name must not exceed 100 characters";
  return null;
};

// Validate Course Code
export const validateCourseCode = (code) => {
  if (!code) return "Course code is required";
  if (code.trim().length < 2) return "Course code must be at least 2 characters";
  if (code.trim().length > 20) return "Course code must not exceed 20 characters";
  return null;
};

// Validate Course Name
export const validateCourseName = (name) => {
  if (!name) return "Course name is required";
  if (name.trim().length < 3) return "Course name must be at least 3 characters";
  if (name.trim().length > 200) return "Course name must not exceed 200 characters";
  return null;
};

// Validate Room Number
export const validateRoomNumber = (roomNumber) => {
  if (!roomNumber) return "Room number is required";
  if (roomNumber.trim().length < 2) return "Room number must be at least 2 characters";
  if (roomNumber.trim().length > 20) return "Room number must not exceed 20 characters";
  return null;
};

// Validate Capacity
export const validateCapacity = (capacity) => {
  if (!capacity) return "Capacity is required";
  const num = parseInt(capacity);
  if (isNaN(num)) return "Capacity must be a number";
  if (num < 1) return "Capacity must be at least 1";
  if (num > 1000) return "Capacity must not exceed 1000";
  return null;
};

// Validate Credits
export const validateCredits = (credits) => {
  if (!credits) return "Credits is required";
  const num = parseInt(credits);
  if (isNaN(num)) return "Credits must be a number";
  if (num < 1) return "Credits must be at least 1";
  if (num > 6) return "Credits must not exceed 6";
  return null;
};

// Validate Level
export const validateLevel = (level) => {
  if (!level) return "Level is required";
  const num = parseInt(level);
  if (isNaN(num)) return "Level must be a number";
  if (num < 100 || num > 500) return "Level must be between 100 and 500";
  return null;
};

// Generic field validation
export const validateField = (fieldName, value, options = {}) => {
  const validators = {
    email: validateEmail,
    password: validatePassword,
    name: validateName,
    courseCode: validateCourseCode,
    courseName: validateCourseName,
    roomNumber: validateRoomNumber,
    capacity: validateCapacity,
    credits: validateCredits,
    level: validateLevel,
  };

  const validator = validators[fieldName];
  if (validator) {
    return validator(value, options.strict);
  }
  return null;
};

// Validate entire form
export const validateForm = (formData, schema) => {
  const errors = {};
  Object.keys(schema).forEach((field) => {
    const error = validateField(field, formData[field], schema[field]);
    if (error) errors[field] = error;
  });
  return Object.keys(errors).length > 0 ? errors : null;
};

// Format error message for UI
export const formatErrorMessage = (error) => {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return "An error occurred. Please try again.";
};

// Format success message
export const formatSuccessMessage = (action, itemName = "") => {
  const messages = {
    create: `✅ ${itemName} created successfully!`,
    update: `✅ ${itemName} updated successfully!`,
    delete: `✅ ${itemName} deleted successfully!`,
    add: `✅ ${itemName} added successfully!`,
    save: `✅ ${itemName} saved successfully!`,
    submit: `✅ ${itemName} submitted successfully!`,
    enroll: `✅ Successfully enrolled in ${itemName}!`,
    withdraw: `✅ Successfully withdrawn from ${itemName}!`,
  };
  return messages[action] || `✅ ${action} completed!`;
};

// Clean form data (trim strings, remove empty fields)
export const cleanFormData = (formData) => {
  const cleaned = {};
  Object.keys(formData).forEach((key) => {
    const value = formData[key];
    if (typeof value === "string") {
      cleaned[key] = value.trim();
    } else if (value !== null && value !== undefined && value !== "") {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

// Debounce function for search
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Delay function for async operations
export const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// Format date
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format time
export const formatTime = (time) => {
  if (!time) return "N/A";
  const [hours, minutes] = time.split(":");
  return `${parseInt(hours) % 12 || 12}:${minutes} ${parseInt(hours) >= 12 ? "PM" : "AM"}`;
};

// Format date and time
export const formatDateTime = (dateTime) => {
  return `${formatDate(dateTime)} ${formatTime(dateTime)}`;
};
