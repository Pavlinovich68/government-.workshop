export interface    ICalendarItem {
   id: string,
   year: number | undefined,
   month: number | undefined,
   day: number,
   isWeekend: boolean,
   isOutside: boolean,
   isPast: boolean,
   count: number,
   locked: boolean
}