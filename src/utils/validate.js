export function validateUsername(username) {
  if (!username) {
    return '请输入用户名'
  }
  if (username.length < 3) {
    return '用户名至少3个字符'
  }
  if (username.length > 20) {
    return '用户名不能超过20个字符'
  }
  return ''
}

export function validatePassword(password) {
  if (!password) {
    return '请输入密码'
  }
  if (password.length < 6) {
    return '密码至少6个字符'
  }
  if (password.length > 20) {
    return '密码不能超过20个字符'
  }
  return ''
}

export function validatePhone(phone) {
  if (!phone) {
    return '请输入手机号'
  }
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(phone)) {
    return '请输入正确的手机号'
  }
  return ''
}

export function validateEmail(email) {
  if (!email) {
    return '请输入邮箱'
  }
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailReg.test(email)) {
    return '请输入正确的邮箱'
  }
  return ''
}

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `请输入${fieldName}`
  }
  return ''
}

export function calculatePasswordStrength(password) {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  
  return strength
}

export function getPasswordStrengthText(strength) {
  if (strength === 0) return { text: '未设置', color: 'text-gray-400' }
  if (strength <= 2) return { text: '弱', color: 'text-red-500' }
  if (strength <= 3) return { text: '中等', color: 'text-orange-500' }
  return { text: '强', color: 'text-green-500' }
}
