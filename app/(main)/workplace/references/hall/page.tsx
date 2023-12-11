'use client'
import React, {useRef, useState} from "react";
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {ICardRef} from '@/models/ICardRef'
import {FormikErrors, useFormik} from "formik";
import {Hall} from "@/models/Hall";
import RecordState from "@/models/enums/record-state";
import {Toast} from "primereact/toast";
import {ConfirmDialog} from "primereact/confirmdialog";
import ItrCard from "@/components/ItrCard";
import {classNames} from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import ItrGrid from "@/components/ItrGrid";
import {Column} from "primereact/column";
import {IGridRef} from "@/models/IGridRef";
import CrudHelper from "@/services/crud.helper.js"
import CRUD from "@/models/enums/crud-type";


const Hall = () => {
   const controllerName = 'hall';
   const emptyHall: Hall = {name: '', short_name: '', capacity: 10};
   const [columnFields] = useState(["name", "short_name", "capacity"]);
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [globalFilter, setGlobalFilter] = useState<string>('');

//#region Grid
const gridColumns = [
   <Column
      key={0}
      field="name"
      sortable
      header="Наименование"
      style={{ width: '50%' }}>
   </Column>,
   <Column
      key={1}
      field="short_name"
      sortable
      header="Короткое наименование"
      style={{ width: '35%' }}>
   </Column>,
   <Column
      key={2}
      field="capacity"
      sortable
      header="Вместимость"
      style={{ width: '15%' }}>
   </Column>
];
//#endregion

//#region Card
   const hall = useFormik<Hall>({
      initialValues: emptyHall,
      validate: (data) => {
         let errors: FormikErrors<Hall> = {};
         if (!data.name){
            errors.name = "Наименование зала должно быть заполнено!";
         }
         if (!data.short_name){
            errors.short_name = "Короткое наименование зала должно быть заполнено!";
         }
         if (!data.capacity){
            errors.capacity = "Вместимость зала должна быть указана!";
         }
         return errors;
      },
      onSubmit: () => {
         hall.resetForm();
      }
   });

   const card = () => {
      return (
         <form onSubmit={saveHall}>
            <div className="card p-fluid">
               <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
               <div className="p-fluid formgrid grid">
                  <div className="field col-12">
                     <label htmlFor="name">Наименование зала</label>
                     <InputText id="name"  placeholder="Наименование"
                                          className={classNames({"p-invalid": submitted && !hall.values.name})}
                                          value={hall.values.name}
                                          onChange={(e) => hall.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
                  </div>
                  <div className="field col-6 md:col-6">
                     <label htmlFor="short_name">Короткое наименование</label>
                     <InputText id="short_name"  placeholder="Короткое наименование"
                                       className={classNames({"p-invalid": submitted && !hall.values.short_name})}
                                       value={hall.values.short_name}
                                       onChange={(e) => hall.setFieldValue('short_name', e.target.value)} required autoFocus type="text"/>
                  </div>
                  <div className="field col-6 md:col-6">
                     <label htmlFor="capacity">Вместимость зала</label>
                     <InputNumber id="capacity" placeholder="Вместимость зала"
                                       className={classNames({"p-invalid": submitted && !hall.values.capacity})}
                                       value={hall.values.capacity}
                                       onValueChange={(e) => hall.setFieldValue('capacity', e.value)} required autoFocus mode="decimal" showButtons min={0} max={1000}/>
                  </div>
               </div>
            </div>
         </form>
      );
   }
   //#endregion

//#region CRUD
   const createHall = () => {
      setCardHeader('Создание нового зала');
      hall.setValues(emptyHall);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateHall = (data: Hall) => {
      setCardHeader('Редактирование зала');
      hall.setValues(data);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteHall = async (data: any) => {
      return await CrudHelper.crud(controllerName, CRUD.delete, { id: data });
   }

   const saveHall = async () => {
      setSubmitted(true);
      if (!hall.isValid) {
         const errors = Object.values(hall.errors);
         toast.current?.show({
            severity: 'error',
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
         setIsLoading(true);
         const res = recordState === RecordState.new ?
            await CrudHelper.crud(controllerName, CRUD.create, {
               name: hall.values.name,
               short_name: hall.values.short_name,
               capacity: hall.values.capacity
            }) :
            await CrudHelper.crud(controllerName, CRUD.update, {
               id: hall.values.id,
               name: hall.values.name,
               short_name: hall.values.short_name,
               capacity: hall.values.capacity
            });

         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
            setIsLoading(false);
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            if (grid.current) {
               grid.current.reload();
            }
            setIsLoading(false);
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }
//#endregion

   const getHeader = () => {
      return (
         <div className="grid">
            <div className="col-6">
               <div className="flex justify-content-start">
                  <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новый" tooltipOptions={{position: "bottom"}} onClick={() => createHall()}></Button>
               </div>
            </div>
            <div className="col-6">
               <div className="flex justify-content-end">
                  <div className="p-input-icon-left">
                     <i className="pi pi-search"></i>
                     <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Поиск" />
                  </div>
               </div>
            </div>
         </div>
      );
   };

   let header = getHeader();

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Совещательные залы</h3>
               <ItrGrid
                  controller={controllerName}
                  create={createHall}
                  update={updateHall}
                  drop={deleteHall}
                  tableStyle={{minWidth: '50rem'}}
                  showClosed={false}
                  columnFields={columnFields}
                  columns={gridColumns}
                  ref={grid}
               />
               <ItrCard
                  header={cardHeader}
                  dialogStyle={{ width: '50vw' }}
                  save={saveHall}
                  body={card()}
                  ref={editor}
               />
               <ConfirmDialog />
               <Toast ref={toast} />
            </div>
         </div>
      </div>
   );
};

export default Hall;
