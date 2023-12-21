export interface    ICalendarItem {
   id: string,
   year: number,
   month: number,
   day: number,
   isWeekend: boolean,
   isOutside: boolean,
   isPast: boolean,
   count: number,
   locked: boolean
}