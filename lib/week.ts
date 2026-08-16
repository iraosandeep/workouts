const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type WeekDay = {
  day: (typeof DAY_NAMES)[number];
  date: Date;
  isToday: boolean;
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Monday-to-Sunday days of the week containing `referenceDate`. */
export function getCurrentWeekDays(
  referenceDate: Date = new Date(),
): WeekDay[] {
  const startOfWeek = new Date(referenceDate);
  const daysSinceMonday = (startOfWeek.getDay() + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      day: DAY_NAMES[date.getDay()],
      date,
      isToday: isSameDay(date, referenceDate),
    };
  });
}

export type MonthDay = {
  date: Date;
  isToday: boolean;
};

/** Every real day (28-31) of the month containing `referenceDate`. */
export function getCurrentMonthDays(
  referenceDate: Date = new Date(),
): MonthDay[] {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return { date, isToday: isSameDay(date, referenceDate) };
  });
}

/** Stable per-day storage key, e.g. "2026-08-16". */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatWeekDayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Literal class names (not template-literal-constructed) so uniwind's static
// scanner can find and generate them — a `bg-day-${n}` template literal would
// never be picked up at build time.
const DAY_BACKGROUND_CLASSNAMES = [
  "bg-day-1",
  "bg-day-2",
  "bg-day-3",
  "bg-day-4",
  "bg-day-5",
  "bg-day-6",
  "bg-day-7",
] as const;

/** The Week screen's panel color for the day at Monday=0..Sunday=6. */
export function getDayColorClassName(
  mondayIndexedWeekdayIndex: number,
): string {
  return DAY_BACKGROUND_CLASSNAMES[
    mondayIndexedWeekdayIndex % DAY_BACKGROUND_CLASSNAMES.length
  ];
}
