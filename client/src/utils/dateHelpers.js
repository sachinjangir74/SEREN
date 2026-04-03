// Helper functions for calendar day logic
export function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getDayClass(date) {
  if (isPastDate(date)) {
    return isWeekend(date)
      ? "text-red-300"
      : "text-gray-400";
  } else {
    return isWeekend(date)
      ? "text-red-600 font-bold"
      : "text-black font-semibold";
  }
}
