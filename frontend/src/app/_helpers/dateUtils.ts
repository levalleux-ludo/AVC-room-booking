export const MILLISEC_PER_DAY = 24 * 3600 * 1000;

export function addDays(date: Date, nbDays: number): Date {
  return new Date(date.valueOf() + nbDays * MILLISEC_PER_DAY);
}

export function findNextDateByDayNum(from: Date, dayNum: number) {
  let dayFrom = from.getDay();
  while (dayFrom !== dayNum) {
    from = addDays(from, 1);
    dayFrom = from.getDay();
  }
  return from;
}

export function findDateByDayNumAndWeekNum(startDate: Date, dayNum: number, weekNum: number) {
  const firstDayInMonth = new Date(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    1
  );
  return new Date(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    (8 + dayNum - firstDayInMonth.getUTCDay()) % 7 + (weekNum - 1) * 7,
    startDate.getUTCHours(),
    startDate.getUTCMinutes(),
    startDate.getUTCSeconds(),
    startDate.getUTCMilliseconds()
  );
}


