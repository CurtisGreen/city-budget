import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const acfrPdfUrl = (id: string, year: number) =>
  `https://archive.org/download/city-budget-acfr-${id}/${id}-acfr-FY${year}.pdf`;