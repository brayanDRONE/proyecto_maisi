/**
 * Validadores para formularios
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateRUT = (rut) => {
  // RUT chileno simple: XXX.XXX.XXX-X
  const re = /^\d{1,3}\.\d{3}\.\d{3}-[\dK]$/
  return re.test(rut)
}

export const validatePhone = (phone) => {
  const re = /^\+?[0-9\s\-()]{10,}$/
  return re.test(phone)
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength
}
