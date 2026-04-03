// Helper functions for calendar modifiers
export function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}
export const modifiers = {
  pastWeekend: date => isPastDate(date) && isWeekend(date),
  pastWeekday: date => isPastDate(date) && !isWeekend(date),
  futureWeekend: date => !isPastDate(date) && isWeekend(date),
  futureWeekday: date => !isPastDate(date) && !isWeekend(date),
};
export const modifiersClassNames = {
  pastWeekend: "pastWeekend",
  pastWeekday: "pastWeekday",
  futureWeekend: "futureWeekend",
  futureWeekday: "futureWeekday",
};
