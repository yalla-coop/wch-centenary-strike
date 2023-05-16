export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const getMonthName = (n) => {
  return monthNames[n]
}

export const getMonthOptions = () => {
  return Array(12).fill(0).map(((v,i) => { return {title: getMonthName(i), value: i+1} }))
}
