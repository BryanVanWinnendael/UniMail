import { Platforms } from "@/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

export const getDate = (date: string) => {
  const d = new Date(date)
  const day = d.getDate()
  const month = d.getMonth()
  const monthName = MONTHS[month]
  const year = d.getFullYear()
  
  const thisDay = new Date().getDate()
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()


  if (day === thisDay && thisMonth === d.getMonth() && thisYear === year){
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return time
  } 

  if (year === thisYear) {
    return `${day} ${monthName}`
  } else {
    return `${day} ${month} ${year}`
  }
}

export const PLATFORM_COLOR: { [key in Platforms]: {
  bg: string;
  text: string
} } = {
  "google": {
    "bg": "#c7fedf80",
    "text": "#46e5a4"
  },
  "outlook": {
    "bg": "#c7d2fe80",
    "text": "#4f46e5"
  },
}