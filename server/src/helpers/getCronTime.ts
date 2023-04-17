export function getCronTime(date: Date) {
  const min = date.getMinutes()
  const hour = date.getUTCHours()
  const day = date.getUTCDate()
  const mon = date.getMonth() + 1
  const weekday = date.getUTCDay()

  return `00 ${min} ${hour} ${day} ${mon} ${weekday}`
}