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
import {classNames} from "primereact/utils";
import { ConfirmPopup } from 'primereact/confirmpopup';
import CrudHelper from "@/services/crud.helper.js"
import CRUD from "@/models/enums/crud-type";
import { TabView, TabPanel } from 'primereact/tabview';
import { PickList } from "primereact/picklist";
import { Hall } from "@/models/Hall";

const Divisions = () => {
   const controllerName = "division";
   const emptyDivision: Division = {};
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [divisions, setDivisions] = useState([]);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [visibleConfirm, setVisibleConfirm] = useState(false);
   const [globalFilter, setGlobalFilter] = useState<string>('');
   const [deletedDivision, setDeletedDivision] = useState<Division>(emptyDivision);
   const [allHalls, setAllHalls] = useState([]);
   const [selectedHalls, setSelectedHalls] = useState([]);

   useEffect(() => {
      CrudHelper.crud(controllerName, CRUD.read, {}).then((result)=>{
         setDivisions(result.data);
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
            <div className="card p-fluid">
               <TabView>
                  <TabPanel header="Основные данные">
                     <div className="p-fluid formgrid grid">
                        <div className="field col-12">
                           <label htmlFor="name">Наименование подразделения</label>
                           <InputText id="name"  placeholder="Наименование"
                                                className={classNames({"p-invalid": submitted && !division.values.name})}
                                                value={division.values.name}
                                                onChange={(e) => division.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
                        </div>
                        <div className="field col-12 md:col-6">
                           <label htmlFor="short_name">Короткое наименование</label>
                           <InputText id="short_name"  placeholder="Короткое наименование"
                                             className={classNames({"p-invalid": submitted && !division.values.short_name})}
                                             value={division.values.short_name}
                                             onChange={(e) => division.setFieldValue('short_name', e.target.value)} required autoFocus type="text"/>
                        </div>
                        <div className="field col-12 md:col-6">
                           <label htmlFor="contacts">Контактная информация</label>
                           <InputText id="contacts" placeholder="Контактная информация"
                                             value={division.values.contacts}
                                             onChange={(e) => division.setFieldValue('contacts', e.target.value)} required autoFocus type="text"/>
                        </div>
                     </div>
                  </TabPanel>
                  <TabPanel header="Доступные залы">
                     <PickList source={allHalls} target={selectedHalls} onChange={onHallsChange} itemTemplate={hallsItemTemplate}
                        filterBy="short_name" breakpoint="800px" sourceHeader={"Все залы"} targetHeader={"Доступные"} sourceStyle={{height: "24rem"}}
                        targetStyle={{height: "24rem"}} sourceFilterPlaceholder="Поиск..." targetFilterPlaceholder="Поиск..."
                     />
                  </TabPanel>
               </TabView>
            </div>
         </form>
      );
   }

   const onHallsChange = (event: any) => {
      setAllHalls(event.source);
      setSelectedHalls(event.target);
   }

   const hallsItemTemplate = (item: Hall) => {
      return (
         <div className="flex flex-wrap p-2 align-items-center gap-3">
            <div className="flex-1 flex flex-column gap-2">
               <span className="font-bold">{item.short_name}</span>
            </div>
         </div>
      );
   }
   //#endregion

   //#region CRUD
   const hallList = async() => {
      const res = await fetch(`/api/hall/list`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      return await res.json();
   }

   const createDivision = (data: Division | null) => {
      setCardHeader('Создание нового подразделения');
      emptyDivision.parent_id = data?.id;
      division.setValues(emptyDivision);
      hallList().then((result)=>{
         setAllHalls(result.data);
      });
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const editDivision = (data: Division) => {
      setCardHeader('Редактирование подразделения');
      division.setValues(data);
      hallList().then((result)=>{
         setAllHalls(result.data);
      });
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteDivision = async () => {
      if (deletedDivision) {
         CrudHelper.crud(controllerName, CRUD.delete, {id: deletedDivision.id}).then((result) => {
            CrudHelper.crud(controllerName, CRUD.read, {}).then((result)=>{
               setDivisions(result.data);
            });
         });
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
               name: division.values.name,
               short_name: division.values.short_name,
               contacts: division.values.contacts,
               parent_id: division.values.parent_id
            }) :
            await CrudHelper.crud(controllerName, CRUD.update, {
               id: division.values.id,
               name: division.values.name,
               short_name: division.values.short_name,
               contacts: division.values.contacts
            });

         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
            setIsLoading(false);
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            CrudHelper.crud(controllerName, CRUD.read, {}).then((result)=>{
               setDivisions(result.data);
            });
            setIsLoading(false);
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }
   //#endregion

   const actionTemplate = (item: any) => {
      return (
         <div className="flex flex-wrap gap-2">
            <Button type="button" icon="pi pi-pencil" severity="info" rounded tooltip="Редактировать" tooltipOptions={{position: "bottom"}} onClick={() => editDivision(item?.data)}></Button>
            <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новое" tooltipOptions={{position: "bottom"}} onClick={() => createDivision(item?.data)}></Button>
            <Button type="button" icon="pi pi-trash" severity="danger" rounded tooltip="Удалить" tooltipOptions={{position: "bottom"}} onClick={() => {setVisibleConfirm(true); setDeletedDivision(item?.data)}}></Button>
            <ConfirmPopup
               visible={visibleConfirm}
               onHide={() => setVisibleConfirm(false)}
               message="Вы действительно хотите удалить текущую запись?"
               icon="pi pi-exclamation-triangle"
               acceptLabel="Да"
               rejectLabel="Нет"
               accept={() => deleteDivision()}/>
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

export default Divisions;
