import React, {forwardRef, Ref, useState, useEffect, useRef, useImperativeHandle} from "react";
import styles from "./styles.module.scss";
import {ICalendarItem} from "@/models/ICalendarItem";
import {IEventCounter} from "@/models/IEventCounter";
import {IDayLocked} from "@/models/IDayLocked";
import {IDonutDataset} from "@/models/IDonutDataset";
import { classNames } from "primereact/utils";
import ItrDonut from "./donut";
import ItrEventsList from "./event-list";
import ItrCard from "@/components/ItrCard";
import {TabPanel, TabView, TabViewTabChangeEvent} from "primereact/tabview";
import {Slider} from "primereact/slider";
import {InputText} from "primereact/inputtext";
import {useFormik} from "formik";
import { IEvent } from "@/models/IEvent";
import {useSession} from "next-auth/react";
import {Calendar} from "primereact/calendar";
import ItrTimeline from "@/components/calendar/ItrTimeline";
import { ICardRef } from "@/models/ICardRef";
import {ConfirmDialog} from "primereact/confirmdialog";
import { ICalendarRef } from "@/models/ICalendarRef";
import RecordState from "@/models/enums/record-state";
import CrudHelper from "@/services/crud.helper.js"
import CRUD from "@/models/enums/crud-type";
import {Toast} from "primereact/toast";

const ItrCalendar = ({hall, year, month} : any, ref: Ref<ICalendarRef>) => {
   const controllerName = "event";
   const {data: session, status, update} = useSession();
   const toast = useRef<Toast>(null);
   //@ts-ignore
   const emptyEvent: IEvent = {name: '', begin_date: new Date(), year: 0, month: 0, day: 0, value: [510, 1050], hall_id: 0, owner_id: session?.user?.id as number};
   const [items, setItems] = useState<ICalendarItem[]>();
   const [disableDates, setDisableDates] = useState<Date[]>([]);
   const [donut, setDonut] = useState<IDonutDataset[]>([]);
   const [cardHeader, setCardHeader] = useState('');
   const [submitted, setSubmitted] = useState(false);
   const [monthName, setMonthName] = useState<string>();
   const [dayEvents, setDayEvents] = useState<string[]>();
   const [interval, setInterval] = useState<string>('');
   const colors = useRef(null);
   const editor = useRef<ICardRef>(null);
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);


   const createEvent = (item: ICalendarItem) => {
      createEventItem(item);
   };

   const days = () => {
      return items;
   };

   useImperativeHandle(ref, () => ({createEvent, days}));

   const eventCouner = async () =>{
      if (hall) {
         const model = {
            hall_id: hall?.id??-1,
            year: year??2000,
            month: month??1
         };
         const result = await fetch('/api/event/counter', {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(model),
         })

         return await result.json();
      } else {
         return {data: []};
      }
   }

   const daysLocked = async () => {
      if (hall) {
         const model = {
            hall_id: hall?.id??-1,
            year: year??2000,
            month: month??1
         };
         const result = await fetch('/api/locked/days', {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(model),
         })

         return await result.json();
      } else {
         return {data: []};
      }
   }

   const getDonuts = async () => {
      if (hall) {
         const model = {
            hall_id: hall?.id??-1,
            year: year??2000,
            month: month??1
         };
         const result = await fetch('/api/event/donuts', {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(model),
         })

         return await result.json();
      } else {
         return {data: []};
      }
   }

   useEffect(() => {
      eventCouner().then((data) => {
         daysLocked().then((days)=>{
            const dates = days.data.filter((i: any) => i.is_locked).map((i: any) => {return new Date(year as number, month as number -1, i.day)});
            setDisableDates(dates);
            setItems(prepareDates(data.data, days.data));
            getDonuts().then((dnt) => {
                  setDonut(dnt.data);
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

   const getDayEvents = async (day: number) => {
      const model = {
         hall_id: hall.id,
         year: year,
         month: month,
         day: day
      }
      const data = await fetch('/api/event/colors', {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(model),
      })

      return await data.json();
   }

//#region Card
   const event = useFormik<IEvent>({
      initialValues: emptyEvent,
      validate: (data) => {
         let errors = {};
         if (!data.name){
            // @ts-ignore
            errors.short_name = "Описание мероприятия обязательно должно быть указано!"
         }
         return errors;
      },
      onSubmit: () => {
         event.resetForm();
      }
   });

   const createEventItem = async (item: ICalendarItem) => {
      setRecordState(RecordState.new);
      emptyEvent.year = item.year??new Date().getFullYear();
      emptyEvent.month = item.month??new Date().getMonth();
      emptyEvent.day = item.day;
      emptyEvent.begin_date = new Date(emptyEvent.year, emptyEvent.month, emptyEvent.day);
      emptyEvent.name = '';
      emptyEvent.hall_id = hall?.id;
      //@ts-ignore
      emptyEvent.owner_id = session?.user.id;
      timeInterval(emptyEvent.value);
      event.setValues(emptyEvent);
      setCardHeader('Создание нового мероприятия');
      setSubmitted(false);
      const de = await getDayEvents(item.day);
      setDayEvents(de.data);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const checkTime = () => {
      const start = event.values.value[0] / 5;
      const length = (event.values.value[1] / 5) - start;
      const newArr = Array.from(Array(length).keys()).map((i) => i+start);
      const existsArr = dayEvents?.map((i, index) => i === '#969A9FFF' ? -1 : index).filter((i) => i >= 0);
      const result = newArr.filter((i) => existsArr?.includes(i));
      return result.length === 0;
   }

   const saveEvent= async () => {
      if (!checkTime()) {
         // @ts-ignore
         toast.current.show({
            severity:'error',
            summary: 'Пересечение по времени',
            content: (<div className="flex flex-column">
               <div className="text-center mb-2">
                  <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                  <h5 className="text-red-500">Заданный интервал пересекается с уже существующими мероприятиями!</h5>
               </div>
            </div>),
            life: 5000
         });
         return;
      }

      setSubmitted(true);
      if (!event.isValid) {
         const errors = Object.values(event.errors);
         // @ts-ignore
         toast.current.show({
            severity:'error',
            summary: 'Ошибка сохранения',
            content: (<div className="flex flex-column">
               <div className="text-center mb-2">
                  <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                  <h3 className="text-red-500">Ошибка сохранения</h3>
               </div>
               {errors.map((item) => {
                  return (
                        // eslint-disable-next-line react/jsx-key
                        <p className="flex align-items-left m-0">
                           {/* @ts-ignore */}
                           {item}
                        </p>)
               })
               }
            </div>),
            life: 5000
         });
         return;
      }

      try {
         const res = recordState === RecordState.new ?
            await CrudHelper.crud(controllerName, CRUD.create, {
               name: event.values.name,
               year: event.values.year,
               month: event.values.month,
               day: event.values.day,
               value: [event.values.value[0], event.values.value[1]],
               hall_id: event.values.hall_id,
               owner_id: event.values.owner_id
            }) :
            await CrudHelper.crud(controllerName, CRUD.update, {
               id: event.values.id,
               name: event.values.name,
               year: event.values.year,
               month: event.values.month,
               day: event.values.day,
               value: [event.values.value[0], event.values.value[1]],
               hall_id: event.values.hall_id,
               owner_id: event.values.owner_id
            });

         if (res.status === 'error'){
            //@ts-ignore
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
            //setIsLoading(false);
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
         }
      } catch (e: any) {
         // @ts-ignore
         toast.current.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         throw e;
      }
   }

   const timeInterval = (value: [number, number]) => {
      let startHours = Math.floor(value[0] / 60);
      let startMinutes = value[0] - startHours * 60;
      let finishHours = Math.floor(value[1] / 60);
      let finishMinutes = value[1] - finishHours * 60;
      let result = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')} - ${finishHours.toString().padStart(2, '0')}:${finishMinutes.toString().padStart(2, '0')}`;
      setInterval(result);
   }

   const card = () => {
      // @ts-ignore
      return (
         <form onSubmit={saveEvent}>
            <TabView>
               <TabPanel header="Основные данные">
                     <div className="grid p-fluid">
                        <div className="col-12">
                           <div className="grid formgrid">
                                 <div className="field col-12 mb-2">
                                    <label htmlFor="building">Наименование мероприятия</label>
                                    <InputText id="name" placeholder="Наименование мероприятия"
                                                className={classNames({"p-invalid": submitted && !event.values.name})}
                                                value={event.values.name}
                                                onChange={(e) => event.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
                                 </div>
                           </div>
                           <div className="grid formgrid">
                                 <div className="field col-5 mb-2">
                                    <label htmlFor="begin_date">Дата проведения мероприятия</label>
                                    <label className="calendar-label">{monthName}</label>
                                    <Calendar
                                       id="begin_date"
                                       className={classNames("itr-card-calendar p-calendar-sm", {"p-invalid": submitted && !event.values.begin_date})}
                                       value={event.values.begin_date}
                                       onChange={(e) => {
                                                const day = (e.target.value as Date).getDate();
                                                event.setFieldValue('begin_date', new Date((e.target.value as Date).toDateString()));
                                                getDayEvents(day).then((data) => {
                                                   debugger;
                                                   //@ts-ignore
                                                   colors.current = data;
                                                   //@ts-ignore
                                                   setDayEvents(data);
                                                });
                                             }
                                       }
                                       disabledDates={disableDates}
                                       dateFormat="dd MM yy"
                                       locale="ru"
                                       required inline/>
                                 </div>
                                 <div className="field col-7 mb-2">
                                    <label htmlFor="first_name" className="block">Временной интервал</label>
                                    <label className="block interval-text">{interval}</label>
                                    <Slider className="block" value={event.values.value} onChange={(e) => {
                                       event.setFieldValue('value', e.value);
                                       timeInterval(e.value as [number, number]);
                                    }} range min={0} max={1440} step={5}/>
                                    <ItrTimeline items={dayEvents} ref={colors}/>
                                 </div>
                           </div>
                        </div>
                     </div>
               </TabPanel>
            </TabView>
         </form>
   );
}
//#endregion

//#region CRUD

//#endregion

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
                                    createEventItem(item);
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
         <ItrCard
            header={cardHeader}
            dialogStyle={{ width: '56vw' }}
            save={saveEvent}
            body={card()}
            ref={editor}
         />
         <ConfirmDialog />
         <Toast ref={toast} />
      </div>
   );
}

export default forwardRef(ItrCalendar);