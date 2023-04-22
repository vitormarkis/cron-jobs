import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

export const getCronTime = (when: string) => {
  const d = dayjs.tz(when, "America/Sao_Paulo")

  const min = String(d.get("minutes")).padStart(2, "0")
  const hour = String(d.get("hours")).padStart(2, "0")
  const date = d.get("date")
  const month = d.get("month") + 1
  const wd = d.day()

  return `00 ${min} ${hour} ${date} ${month} ${wd}`
}

console.log(getCronTime("2023-04-28"))
