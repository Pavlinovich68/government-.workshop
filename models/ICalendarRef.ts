import { ICalendarItem } from "./ICalendarItem";

export interface ICalendarRef {
   createEvent: (item: ICalendarItem) => void;
   days: () => ICalendarItem[] | undefined;
}