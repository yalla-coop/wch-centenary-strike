export function formatTitleYear(eventData) {
  if (eventData.year === '') {
    return eventData.title
  } else if (Number(eventData.year) < 0) {
    return `${eventData.title}, ${Math.abs(eventData.year)} BCE`
  } else {
    return `${eventData.title}, ${eventData.year}`
  }
}

export function dateString(date) {
  return date.toLocaleDateString(navigator.language, {month: 'long', day: 'numeric'})
}
