import React, {useState, useEffect} from "react";
import styles from "./styles.module.scss";
import {ICalendarItem} from "../../models/ICalendarItem";
import {IEventCounter} from "../../models/IEventCounter";
import {IDayLocked} from "../../models/IDayLocked";
import {IDonutDataset} from "../../models/IDonutDataset";
import { classNames } from "primereact/utils";
import ItrDonut from "./donut";
import ItrEventsList from "./event-list";

const ItrCalendar = ({hall, year, month} : any) => {
   const [items, setItems] = useState<ICalendarItem[]>();
   const [disableDates, setDisableDates] = useState<Date[]>([]);
   const [donut, setDonut] = useState<IDonutDataset[]>([])

   const eventCouner = async () =>{
      const fetch = async (): Promise<IEventCounter[]> => {
         const _year = year??0;
         const _month = month??-1;
         try {
            //const { data, status } = await EventService.counter(hall, _year, _month -1);
            //return data;
            return [];
         } catch (e: any){
            console.log(e);
            return [];
         }
      }
      return year === undefined || month === undefined ? [] : await fetch();
   }

   const daysLocked = async () => {
      const fetch = async (): Promise<IDayLocked[]> => {
         const _year = year??0;
         const _month = month??-1;
         try {
            //const { data, status } = await LockedService.locked_days({hall_id: hall, year: year, month: month});
            //return data;
            return [];
         } catch (e: any){
            console.log(e);
            return [];
         }
      }
      return year === undefined || month === undefined ? [] : await fetch();
   }

   const getDonuts = async () => {
      const fetch = async (): Promise<IDonutDataset[]> => {
         const _year = year??0;
         const _month = month??-1;
         try {
            //const { data, status } = await EventService.donuts(hall, year as number, month as number -1);
            //return data;
            return [];
         } catch (e: any){
            console.log(e);
            return [];
         }
      }
      return year === undefined || month === undefined ? [] : await fetch();
   }

   useEffect(() => {
      eventCouner().then((data) => {
         daysLocked().then((days)=>{
            const dates = days.filter((i) => i.is_locked).map((i) => {return new Date(year as number, month as number -1, i.day)});
            setDisableDates(dates);
            setItems(prepareDates(data, days));
            getDonuts().then((dnt) => {
                  setDonut(dnt);
            })
         })
      });
   }, [hall, year, month]);

   const addDays = (date: Date, days: number) => {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
   }

   const addMonths = (date: Date, months: number) => {
      let result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
   }

   const prepareDates = (cnt: IEventCounter[], days: IDayLocked[]): ICalendarItem[] => {
      if (typeof year !== "number" || typeof month !== "number") {
         return [];
      }
      let _now = addDays(new Date(), -1);
      let date = new Date(year, month - 1, 1);
      let firstDay = date.getDay();
      let startDate = firstDay > 0 ? addDays(date, firstDay * -1 +1) : addDays(date, -6);
      let result  = Array.from(Array(42).keys()).map((d) => {
         let result = {
            id: crypto.randomUUID(),
            year: startDate.getFullYear(),
            month: startDate.getMonth(),
            day: startDate.getDate(),
            isOutside: startDate.getMonth() !== month-1,
            isWeekend: startDate.getDay() === 0 || startDate.getDay() === 6,
            count: startDate.getMonth() !== (month -1) ? 0 : cnt.find((i) => i.day === startDate.getDate())?.cnt??0,
            isPast: (startDate < _now) && (startDate.getMonth() === month -1),
            locked: startDate.getMonth() !== (month -1) ? false : days.find((i) => i.day === startDate.getDate())?.is_locked??false
         };
         startDate = addDays(startDate, 1);
         return result
      });
      return result;
   }

   return (
      <div className={classNames(styles.itrCalendar, 'grid mt-2')}>
         <div className="col-2"></div>
         <div className="col-8">
         <div className={styles.calendarGrid}>
                  <div className={classNames(styles.calendarCell, styles.weekDay)}>Понедельник</div>
                  <div className={classNames(styles.calendarCell, styles.weekDay)}>Вторник</div>
                  <div className={classNames(styles.calendarCell, styles.weekDay)}>Среда</div>
                  <div className={classNames(styles.calendarCell, styles.weekDay)}>Четверг</div>
                  <div className={classNames(styles.calendarCell, styles.weekDay)}>Пятница</div>
                  <div className={classNames(styles.calendarCell, styles.weekDay, 'text-red-400')}>Суббота</div>
                  <div className={classNames(styles.calendarCell, styles.weekDay, 'text-red-400')}>Воскресенье</div>
                  {items?.map((item, index) => {
                     return <div key={`cell${index}`}
                              data-year={item.year}
                              data-month={item.month}
                              data-day={item.day}
                              className={classNames(styles.calendarCell,
                                 item.isOutside ? styles.dayOutside : '',
                                 {'dayOutside text-gray-600': item.isOutside},
                                 {'text-red-400': item.isWeekend && !item.isOutside},
                                 {'text-red-800': item.isWeekend && item.isOutside},
                                 {'text-gray-700': item.isPast || item.locked},
                                 {'line-through': item.locked}
                              )}
                              onDoubleClick={() => {
                              if (!item.isOutside && !item.isPast && !item.locked) {
                                    //createEvent(item.day);
                              }
                           }}
                        >
                        <div className={classNames(styles.dayCell)}>{item.day}</div>
                        {!item.isOutside ?
                           <div>
                              <ItrDonut data={donut.find((i) => i.day === item.day)?.data} year={year} month={month as number-1} day={item.day}/>
                              <ItrEventsList id={item.id} count={item.count} />
                           </div>:''
                        }
                        </div>
                  })}
               </div>
            </div>
         <div className="col-2"></div>
      </div>
   );
}

export default ItrCalendar;