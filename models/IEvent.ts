export interface IEvent {
   id?: number,
   name?: string,
   begin_date: Date,
   year: number,
   month: number,
   day: number,
   value: [number, number],
   hall_id: number,
   owner_id: number,
   color?: string
}