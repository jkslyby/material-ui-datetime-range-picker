import warning from 'warning';
import sortBy from 'lodash.sortby';
import find from 'lodash.find';

const dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];
const monthLongList = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export function dateTimeFormat(locale, options) {
  warning(locale === 'en-US', `Material-UI: The ${locale} locale is not supported by the built-in DateTimeFormat.
  Use the \`DateTimeFormat\` prop to supply an alternative implementation.`);

  this.format = function(date) {
    if (options.month === 'short' && options.weekday === 'short' && options.day === '2-digit') {
      return `${dayList[date.getDay()]}, ${monthList[date.getMonth()]} ${date.getDate()}`;
    } else if (options.year === 'numeric' && options.month === 'numeric' && options.day === 'numeric') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    } else if (options.year === 'numeric' && options.month === 'long') {
      return `${monthLongList[date.getMonth()]} ${date.getFullYear()}`;
    } else if (options.weekday === 'narrow') {
      return dayAbbreviation[date.getDay()];
    } else if (options.year === 'numeric') {
      return date.getFullYear().toString();
    } else if (options.day === 'numeric') {
      return date.getDate();
    } else {
      warning(false, 'Material-UI: Wrong usage of DateTimeFormat');
    }
  };
}

export function getYear(d) {
  return d.getFullYear();
}

export function setYear(d, year) {
  const newDate = cloneDate(d);
  newDate.setFullYear(year);
  return newDate;
}

export function addDays(d, days) {
  const newDate = cloneDate(d);
  newDate.setDate(d.getDate() + days);
  return newDate;
}

export function addMonths(d, months) {
  const newDate = cloneDate(d);
  newDate.setMonth(d.getMonth() + months);
  return newDate;
}

export function addYears(d, years) {
  const newDate = cloneDate(d);
  newDate.setFullYear(d.getFullYear() + years);
  return newDate;
}

export function cloneDate(d) {
  return new Date(d.getTime());
}

export function cloneAsDate(d) {
  const clonedDate = cloneDate(d);
  clonedDate.setHours(0, 0, 0, 0);
  return clonedDate;
}

export function getDaysInMonth(d) {
  const resultDate = getFirstDayOfMonth(d);

  resultDate.setMonth(resultDate.getMonth() + 1);
  resultDate.setDate(resultDate.getDate() - 1);

  return resultDate.getDate();
}

export function getFirstDayOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getFirstDayOfWeek() {
  const now = new Date();
  return new Date(now.setDate(now.getDate() - now.getDay()));
}

export function getWeekArray(d, firstDayOfWeek) {
  const dayArray = [];
  const daysInMonth = getDaysInMonth(d);
  const weekArray = [];
  let week = [];

  for (let i = 1; i <= daysInMonth; i++) {
    dayArray.push(new Date(d.getFullYear(), d.getMonth(), i));
  }

  const addWeek = (week) => {
    const emptyDays = 7 - week.length;
    for (let i = 0; i < emptyDays; ++i) {
      week[weekArray.length ? 'push' : 'unshift'](null);
    }
    weekArray.push(week);
  };

  dayArray.forEach((day) => {
    if (week.length > 0 && day.getDay() === firstDayOfWeek) {
      addWeek(week);
      week = [];
    }
    week.push(day);
    if (dayArray.indexOf(day) === dayArray.length - 1) {
      addWeek(week);
    }
  });

  return weekArray;
}

export function localizedWeekday(DateTimeFormat, locale, day, firstDayOfWeek) {
  const weekdayFormatter = new DateTimeFormat(locale, {weekday: 'narrow'});
  const firstDayDate = getFirstDayOfWeek();

  return weekdayFormatter.format(addDays(firstDayDate, day + firstDayOfWeek));
}

// Convert date to ISO 8601 (YYYY-MM-DD) date string, accounting for current timezone
export function formatIso(date) {
  return (new Date(`${date.toDateString()} 12:00:00 +0000`)).toISOString().substring(0, 10);
}

export function isEqualDate(d1, d2) {
  return d1 && d2 &&
    (d1.getFullYear() === d2.getFullYear()) &&
    (d1.getMonth() === d2.getMonth()) &&
    (d1.getDate() === d2.getDate());
}

export function isEqualDateTime(d1, d2) {
  return d1 && d2 &&
    (d1.getFullYear() === d2.getFullYear()) &&
    (d1.getMonth() === d2.getMonth()) &&
    (d1.getDate() === d2.getDate()) &&
    (d1.getHours() === d2.getHours());
}

export function isDateBetweenDateTime(dateToCheck, startDate, endDate) {
  const startOfDate = (new Date(dateToCheck.getTime())).setHours(0, 0, 0, 0);
  const endOfDate = (new Date(dateToCheck.getTime())).setHours(23, 59, 59, 999);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (!(startOfDate < start.getTime()) && !(endOfDate > end.getTime()));
}

export function isDateTimeBetweenDateTime(dateToCheck, startDate, endDate) {
  const date = new Date(dateToCheck.getTime());
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (date >= start.getTime() && date <= end.getTime());
  // return (!(date < start.getTime()) && !(date > end.getTime()));
}

export function isDateInRanges(ranges, day) {
  let inRange = false;
  if (ranges) {
    ranges.forEach((range) => {
      if (isDateBetweenDateTime(day, range.start, range.end)) {
        inRange = true;
      }
    });
  }
  return inRange;
}

export function isDateTimeInRanges(ranges, day) {
  let inRange = false;
  if (ranges) {
    ranges.forEach((range) => {
      if (isDateTimeBetweenDateTime(day, range.start, range.end)) {
        inRange = true;
      }
    });
  }
  return inRange;
}

export function isDateTimeInRangesExclusive(ranges, day) {
  let inRange = false;
  if (ranges) {
    ranges.forEach((range) => {
      if (isDateTimeBetweenDateTimeExclusive(day, range.start, range.end)) {
        inRange = true;
      }
    });
  }
  return inRange;
}

export function isDateTimeBetweenDateTimeExclusive(dateToCheck, startDate, endDate) {
  const date = new Date(dateToCheck.getTime());
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (date > start.getTime() && date < end.getTime());
  // return (!(date < start.getTime()) && !(date > end.getTime()));
}

export function closestRangeAfterStart(ranges, start) {
  if (ranges && start) {
    ranges = sortBy(ranges, (range) => {
      return range.start.getTime();
    });
    return find(ranges, (range) => {
      return range.start.getTime() > start.getTime();
    });
  }
  return null;
}

export function isBeforeDate(d1, d2) {
  const date1 = cloneAsDate(d1);
  const date2 = cloneAsDate(d2);

  return (date1.getTime() < date2.getTime());
}

export function isBeforeDateTime(d1, d2) {
  return (d1.getTime() < d2.getTime());
}

export function isAfterDate(d1, d2) {
  const date1 = cloneAsDate(d1);
  const date2 = cloneAsDate(d2);

  return (date1.getTime() > date2.getTime());
}

export function isAfterDateTime(d1, d2) {
  return (d1.getTime() > d2.getTime());
}

export function isBetweenDates(dateToCheck, startDate, endDate) {
  return (!(isBeforeDate(dateToCheck, startDate)) &&
          !(isAfterDate(dateToCheck, endDate)));
}

export function monthDiff(d1, d2) {
  let m;
  m = (d1.getFullYear() - d2.getFullYear()) * 12;
  m += d1.getMonth();
  m -= d2.getMonth();
  return m;
}

export function yearDiff(d1, d2) {
  return ~~(monthDiff(d1, d2) / 12);
}

export const defaultUtils = {
  getYear,
  setYear,
  addDays,
  addMonths,
  addYears,
  getFirstDayOfMonth,
  getWeekArray,
  monthDiff,
};
