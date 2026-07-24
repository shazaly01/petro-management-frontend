//src\utils\formatters.js
/**
 * ملف أدوات التنسيق (Formatters)
 * src/utils/formatters.js
 */

/**
 * يقوم بتنسيق القيمة الرقمية وإضافة "ج.س" يدوياً مع إخفاء الكسور للأرقام الصحيحة.
 * @param {number | string | null | undefined} value - القيمة الرقمية.
 * @returns {string} - السلسلة المنسقة، مثال: "1,500,000 ج.س"
 */
export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return 'N/A'
  }

  const numValue = Number(value)

  if (isNaN(numValue)) {
    return '0 ج.س'
  }

  const options = {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }

  if (numValue % 1 === 0) {
    options.maximumFractionDigits = 0
    options.minimumFractionDigits = 0
  }

  const formattedNumber = new Intl.NumberFormat('en-US', options).format(numValue)

  return `${formattedNumber} ج.س`
}

/**
 * يقوم بتنسيق الأرقام العامة (مثل الأعداد واللترات) وفصل الآلاف بأرقام إنجليزية.
 * @param {number | string | null | undefined} value - القيمة الرقمية.
 * @returns {string} - الرقم المنسق، مثال: "1,500"
 */
export function formatNumber(value) {
  if (value === null || value === undefined || value === '') {
    return '0'
  }

  const numValue = Number(value)

  if (isNaN(numValue)) {
    return '0'
  }

  return new Intl.NumberFormat('en-US').format(numValue)
}

/**
 * يقوم بتنسيق سلسلة التاريخ إلى صيغة ميلادية رقمية (يوم/شهر/سنة).
 * @param {string | null | undefined} dateString - سلسلة التاريخ.
 * @returns {string} - السلسلة المنسقة.
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }

  return date.toLocaleDateString('en-GB', options)
}
