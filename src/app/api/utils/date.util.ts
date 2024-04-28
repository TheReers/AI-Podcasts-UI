import { format, addDays, addHours, addSeconds,  } from 'date-fns';

export function formatDate(date: Date, formatString: string) {
    return format(date, formatString);
}

export const addDaysToDate = (date: Date, days: number) => {
    return addDays(date, days);
}

export const addHoursToDate = (date: Date, hours: number) => {
    return addHours(date, hours);
}

export const addSecondsToDate = (date: Date, seconds: number) => {
    return addSeconds(date, seconds);
}

export const dateIsGreaterThanOther = (date1: Date, date2: Date) => {
    return date1 > date2
}

export const dateHasPassed = (date: Date) => {
    return dateIsGreaterThanOther(new Date(), date)
}
