'use client'
import React, {useEffect, useRef, useState} from "react";
import {TreeTable} from 'primereact/treetable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {ICardRef} from '../../../../../models/ICardRef'
import {FormikErrors, useFormik} from "formik";
import {Division} from "../../../../../models/Division";
import RecordState from "@/models/enums/record-state";
import {Toast} from "primereact/toast";
import {ConfirmDialog} from "primereact/confirmdialog";
import ItrCard from "@/components/ItrCard";
import { Tooltip } from 'primereact/tooltip';

async function getData() {
   const res = await fetch('http://localhost:3000/api/division/read', {
      cache: "no-store"
   });

   if (!res.ok) {
      throw new Error('Failed to fetch data for divisions');
   }

   const result = await res.json();

   return result.result;
}

const Divisions = () => {
   const emptyDivision: Division = {};
   const toast = useRef<Toast>(null);
   const [divisions, setDivisions] = useState([]);
   const [globalFilter, setGlobalFilter] = useState<string>('');
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);

   useEffect(() => {
      const reader = async () => {
         const result = await getData();
         return result;
      }
      reader().then((innerData) => {
         setDivisions(innerData)
      });
   }, []);

   //#region Card
   const division = useFormik<Division>({
      initialValues: emptyDivision,
      validate: (data) => {
         let errors: FormikErrors<Division> = {};
         if (!data.name){
            errors.name = "Наименование подразделения должно быть заполнено!";
         }
         if (!data.short_name){
            errors.short_name = "Короткое наименование подразделения должно быть заполнено!";
         }
         return errors;
      },
      onSubmit: () => {
         division.resetForm();
      }
   });

   const card = () => {
      return (
          <form onSubmit={saveDivision}>

          </form>
      );
   }
   //#endregion
   //#region CRUD
   const createDivision = () => {
      setCardHeader('Создание нового подразделения');
      division.setValues(emptyDivision);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const editDivision = (data: Division) => {
      setCardHeader('Редактирование подразделения');
      division.setValues(data);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const saveDivision = async () => {
      setSubmitted(true);
      if (!division.isValid) {
         const errors = Object.values(division.errors);
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
         //recordState == RecordState.new ? await ... : await ...;
         // tree reload
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
      }
   }
   //#endregion

   const actionTemplate = (item: any) => {
      return (
         <div className="flex flex-wrap gap-2">
            <Button type="button" icon="pi pi-pencil" severity="info" rounded tooltip="Редактировать" tooltipOptions={{position: "bottom"}} onClick={() => editDivision(item?.data)}></Button>
            <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новое" tooltipOptions={{position: "bottom"}} onClick={() => createDivision()}></Button>
         </div>
      );
   };

   const getHeader = () => {
      return (
         <div className="flex justify-content-end">
            <div className="p-input-icon-left">
               <i className="pi pi-search"></i>
               <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Поиск" />
            </div>
         </div>
      );
   };

   let header = getHeader();

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Подразделения</h3>
               <TreeTable value={divisions} tableStyle={{ minWidth: '50rem' }} globalFilter={globalFilter} resizableColumns showGridlines header={header} filterMode="strict">
                  <Column field="name" header="Наименование структурного подразделения" expander style={{width: '60%'}}></Column>
                  <Column field="short_name" header="Короткое наименование" style={{width: '15rem'}}></Column>
                  <Column field="contacts" header="Контактная информация"></Column>
                  <Column body={actionTemplate} style={{width: "120px"}} />
               </TreeTable>
               <ItrCard
                   header={cardHeader}
                   dialogStyle={{ width: '50vw' }}
                   save={saveDivision}
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

export default Divisions;
