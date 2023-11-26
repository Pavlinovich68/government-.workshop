'use client'
import React, {useEffect, useRef, useState} from "react";
import {TreeTable} from 'primereact/treetable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {ICardRef} from '../../../../../models/ICardRef'
import {FormikErrors, useFormik} from "formik";
import {Hall} from "../../../../../models/Hall";
import RecordState from "@/models/enums/record-state";
import {Toast} from "primereact/toast";
import {ConfirmDialog} from "primereact/confirmdialog";
import ItrCard from "@/components/ItrCard";
import { Tooltip } from 'primereact/tooltip';
import {classNames} from "primereact/utils";
import { ConfirmPopup } from 'primereact/confirmpopup';
import {TreeSelect} from "primereact/treeselect";
import {TreeNode} from "primereact/treenode";
import { InputNumber } from "primereact/inputnumber";


async function getData() {
   const res = await fetch('/api/hall/read', {
      cache: "no-store"
   });

   if (!res.ok) {
      throw new Error('Failed to fetch data for hall');
   }

   const result = await res.json();

   return result.result;
}

const Hall = () => {
   const emptyHall: Hall = {name: '', short_name: ''};
   const toast = useRef<Toast>(null);
   const [halls, setHalls] = useState([]);
   const [globalFilter, setGlobalFilter] = useState<string>('');
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [visibleConfirm, setVisibleConfirm] = useState(false);

   useEffect(() => {
      const reader = async () => {
         const result = await getData();
         return result;
      }
      reader().then((innerData) => {
         setHalls(innerData)
      });
   }, []);

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
               <div className="p-fluid formgrid grid">
                  <div className="field col-12">
                     <label htmlFor="name">Наименование зала</label>
                     <InputText id="name"  placeholder="Наименование"
                                          className={classNames({"p-invalid": submitted && !hall.values.name})}
                                          value={hall.values.name}
                                          onChange={(e) => hall.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
                  </div>
                  <div className="field col-12 md:col-12">
                     <label htmlFor="short_name">Короткое наименование</label>
                     <InputText id="short_name"  placeholder="Короткое наименование"
                                       className={classNames({"p-invalid": submitted && !hall.values.short_name})}
                                       value={hall.values.short_name}
                                       onChange={(e) => hall.setFieldValue('short_name', e.target.value)} required autoFocus type="text"/>
                  </div>
                  <div className="field col-12 md:col-6">
                     <label htmlFor="capacity"></label>
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
   const createHall = (data: Hall | null) => {
      setCardHeader('Создание нового зала');
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const editHall = (data: Hall) => {
      setCardHeader('Редактирование зала');
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteHall = async (data: Hall) => {
      const res = await fetch("/api/hall/delete", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            id: data.id
         }),
      });

      const reader = async () => {
         const result = await getData();
         return result;
      }
      reader().then((innerData) => {
         setHalls(innerData)
      });
   }

   const saveHall = async () => {
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
         if (recordState === RecordState.new) {
            const res = await fetch("/api/division/create", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  name: division.values.name,
                  short_name: division.values.short_name,
                  contacts: division.values.contacts,
                  parent_id: division.values.parent_id
               }),
            });
         } else {
            const res = await fetch("/api/division/update", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  id: division.values.id,
                  name: division.values.name,
                  short_name: division.values.short_name,
                  contacts: division.values.contacts
               }),
            });
         }
         const reader = async () => {
            const result = await getData();
            return result;
         }
         reader().then((innerData) => {
            setDivisions(innerData)
         });
         if (editor.current) {
            editor.current.visible(false);
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
      }
   }
   //#endregion

   const actionTemplate = (item: any) => {
      return (
         <div className="flex flex-wrap gap-2">
            <Button type="button" icon="pi pi-pencil" severity="info" rounded tooltip="Редактировать" tooltipOptions={{position: "bottom"}} onClick={() => editDivision(item?.data)}></Button>
            <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новое" tooltipOptions={{position: "bottom"}} onClick={() => createDivision(item?.data)}></Button>
            <Button ref={dropButton} type="button" icon="pi pi-trash" severity="danger" rounded tooltip="Удалить" tooltipOptions={{position: "bottom"}} onClick={() => setVisibleConfirm(true)}></Button>
            <ConfirmPopup
               visible={visibleConfirm}
               onHide={() => setVisibleConfirm(false)}
               message="Вы действительно хотите удалить текущую запись?"
               icon="pi pi-exclamation-triangle"
               //@ts-ignore
               target={dropButton.current}
               acceptLabel="Да"
               rejectLabel="Нет"
               accept={() => deleteDivision(item?.data)}/>
         </div>
      );
   };

   const getHeader = () => {
      return (
         <div className="grid">
            <div className="col-6">
               <div className="flex justify-content-start">
                  <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новое" tooltipOptions={{position: "bottom"}} onClick={() => createDivision(null)}></Button>
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
               <h3>Подразделения</h3>
               <TreeTable value={divisions} tableStyle={{ minWidth: '50rem' }} globalFilter={globalFilter} resizableColumns showGridlines header={header} filterMode="strict">
                  <Column field="name" header="Наименование структурного подразделения" expander style={{width: '60%'}}></Column>
                  <Column field="short_name" header="Короткое наименование" style={{width: '15rem'}}></Column>
                  <Column field="contacts" header="Контактная информация"></Column>
                  <Column body={actionTemplate} style={{width: "165px"}} />
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

export default Hall;
