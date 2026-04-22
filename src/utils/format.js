import { format, parseISO, isValid } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(date, formatStr = 'yyyy-MM-dd') {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsedDate)) return ''
  return format(parsedDate, formatStr, { locale: zhCN })
}

export function formatDateTime(date, formatStr = 'yyyy-MM-dd HH:mm:ss') {
  return formatDate(date, formatStr)
}

export function formatTime(date, formatStr = 'HH:mm:ss') {
  return formatDate(date, formatStr)
}

export function formatRelativeTime(date) {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsedDate)) return ''
  
  const now = new Date()
  const diff = now.getTime() - parsedDate.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

export function getCurrentDate() {
  return format(new Date(), 'yyyy年MM月dd日')
}

export function getCurrentWeekDay() {
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekDays[new Date().getDay()]
}

export function getCurrentDateTime() {
  return format(new Date(), 'yyyy年MM月dd日 HH:mm:ss')
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return ''
  return Number(num).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return ''
  return Number(amount).toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  })
}

export function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined) return ''
  return `${(Number(value) * 100).toFixed(decimals)}%`
}

export function truncateText(text, maxLength = 50, suffix = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}

export function maskPhone(phone) {
  if (!phone) return ''
  if (phone.length !== 11) return phone
  return phone.substring(0, 3) + '****' + phone.substring(7)
}

export function maskEmail(email) {
  if (!email) return ''
  const [username, domain] = email.split('@')
  if (!username || !domain) return email
  const maskedUsername = username.length > 2 
    ? username.substring(0, 2) + '***' 
    : username
  return `${maskedUsername}@${domain}`
}
