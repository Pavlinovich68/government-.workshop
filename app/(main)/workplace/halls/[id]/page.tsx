'use client'
import React, {useRef, useState, useEffect} from "react";
import {Hall} from "@/models/Hall";
import {useSession} from "next-auth/react";
import { Toolbar } from 'primereact/toolbar';
import {Button} from "primereact/button";
import ItrCalendar from "@/components/calendar/page";
import { ICalendarRef } from "@/models/ICalendarRef";
import { Toast } from "primereact/toast";

const addMonths = (date: Date, months: number) => {
   let result = new Date(date);
   result.setMonth(result.getMonth() + months);
   return result;
}
const HallPage = ({ params }: { params: { id: number }}) => {
   const monthDict = {
      0: "Январь",
      1: "Февраль",
      2: "Март",
      3: "Апрель",
      4: "Май",
      5: "Июнь",
      6: "Июль",
      7: "Август",
      8: "Сентябрь",
      9: "Октябрь",
      10: "Ноябрь",
      11: "Декабрь"
   };
   const [hall, setHall] = useState<Hall>();
   const {data: session, status, update} = useSession();
   const [year, setYear] = useState<number>();
   const [month, setMonth] = useState<number>();
   const [monthName, setMonthName] = useState<string>();
   const calendar = useRef<ICalendarRef>(null);
   const toast = useRef<Toast>(null);

   useEffect(() => {
      //@ts-ignore
      const item = session?.user.halls.find((i: any) => i.id === parseInt(params.id));
      setHall(item);
      let currentDate = new Date();
      setYear(currentDate.getFullYear());
      setMonth(currentDate.getMonth()+1);
      //@ts-ignore
      setMonthName(`${monthDict[currentDate.getMonth()]} ${currentDate.getFullYear()} года`);
   }, [status]);

   const startContent = (
      <React.Fragment>
         <Button icon="pi pi-angle-double-left" className="mr-3" rounded severity="info"
                  tooltip="Предыдущий месяц" tooltipOptions={{ position: 'top' }}
                  onClick={() => {
                     let currentDate = new Date(year as number, month as number -1, 1);
                     currentDate = addMonths(currentDate, -1);
                     setYear(currentDate.getFullYear());
                     setMonth(currentDate.getMonth() +1);
                      // @ts-ignore
                     setMonthName(`${monthDict[currentDate.getMonth()]} ${currentDate.getFullYear()} года`);
                  }}
         />
         <Button icon="pi pi-plus" severity="success" rounded
                  tooltip="Добавить мероприятие" tooltipOptions={{ position: 'top' }}
                  onClick={(e) => {
                     if (calendar.current && calendar.current.days !== undefined) {
                        const allItems = calendar.current.days();
                        const available = allItems?.filter(i => !i.isOutside && !i.isPast && !i.locked);
                        let first = available?.reduce((min, current) => current.day < min.day ? current : min, available[0]);
                        if (first) {
                           calendar.current.createEvent(first);
                        } else {
                           //@ts-ignore
                           toast.current.show({
                              severity:'warn',
                              summary: 'Выберите другой месяц',
                              content: (<div className="flex flex-column">
                                          <div className="text-center mb-2">
                                             <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                                             <p className="flex align-items-left m-0">
                                                В текущем месяце нет доступных для бронирования дат!
                                             </p>
                                          </div>
                              </div>),
                              life: 5000
                           });
                        }
                     }
                  }}
         />
      </React.Fragment>
   );

   const centerContent = (
      <React.Fragment>
         <h4>{monthName}</h4>
      </React.Fragment>
   );

   const endContent = (
      <React.Fragment>
         <Button icon="pi pi-angle-double-right" rounded severity="info"
                  tooltip="Следующий месяц" tooltipOptions={{ position: 'top' }}
                  onClick={() => {
                     let currentDate = new Date(year as number, month as number -1, 1);
                     currentDate = addMonths(currentDate, 1);
                     setYear(currentDate.getFullYear());
                     setMonth(currentDate.getMonth() +1);
                     // @ts-ignore
                     setMonthName(`${monthDict[currentDate.getMonth()]} ${currentDate.getFullYear()} года`);
                  }}
         />
      </React.Fragment>
   );
   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3 className="mb-0">{hall?.name}</h3>
               <div className="mb-3 font-italic">{hall?.address}</div>
               <Toolbar start={startContent} center={centerContent} end={endContent}/>
               <ItrCalendar hall={hall} year={year} month={month} ref={calendar}/>
            </div>
         </div>
         <Toast ref={toast}/>
      </div>
   );
};

export default HallPage;
