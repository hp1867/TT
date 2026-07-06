import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

export function currency(n: number, code = 'AUD') {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 2,
  }).format(n);
}
