export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export function getUserInfo() {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}

export function setUserInfo(userInfo) {
  if (userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  } else {
    localStorage.removeItem('userInfo')
  }
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

export function isLoggedIn() {
  return !!getToken()
}

export function hasPermission(permission) {
  const userInfo = getUserInfo()
  if (!userInfo || !userInfo.permissions) {
    return false
  }
  return userInfo.permissions.includes(permission)
}
