'use client'
import {TreeNode} from "primereact/treenode";
import ItrGrid from "@/components/ItrGrid";
import React, {useEffect, useRef, useState} from "react";
import {ColumnGroup} from "primereact/columngroup";
import {Row} from "primereact/row";
import {Column} from "primereact/column";
import {IGridRef} from "@/models/IGridRef";
import DateHelper from "@/services/date.helpers";
import {User} from "@/models/User";
import {Division} from "@/models/Division";
import {ConfirmDialog} from "primereact/confirmdialog";
import ItrCard from "@/components/ItrCard";
import {Toast} from "primereact/toast";
import {ICardRef} from '@/models/ICardRef'
import {FormikErrors, useFormik} from "formik";
import RecordState from "@/models/enums/record-state";
import { TabView, TabPanel } from 'primereact/tabview';
import {InputText} from 'primereact/inputtext';
import {classNames} from "primereact/utils";
import {Calendar} from "primereact/calendar";
import {TreeSelect} from "primereact/treeselect";
import {appRoles} from "@/prisma/roles/index";
import { Checkbox } from "primereact/checkbox";
import { InputSwitch } from "primereact/inputswitch";


const Users = () => {
   const emptyUser: User = {name: '', begin_date: new Date, roles: null};
   const [columnFields] = useState(["name", "division.name", "email", "begin_date", "end_date"]);
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const [cardHeader, setCardHeader] = useState('');
   const editor = useRef<ICardRef>(null);
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [divisions, setDivisions] = useState<TreeNode[]>([]);
   const [currentUserRoles, setCurrentUserRoles] = useState<any>({});


//#region GRID
   const periodColumn = (
      <ColumnGroup>
         <Row>
            <Column header="" rowSpan={2}/>
            <Column header="Фамилия Имя Отчество" rowSpan={2} sortable field="name"/>
            <Column header="Подразделение" rowSpan={2} sortable field="division.name"/>
            <Column header="Учетная запись" rowSpan={2} sortable field="email"/>
            <Column header="Период действия" colSpan={2}/>
            <Column header="" rowSpan={2}/>
         </Row>
         <Row>
            <Column header="Дата начала" sortable field="begin_date"/>
            <Column header="Дата окончания" sortable field="end_date"/>
         </Row>
      </ColumnGroup>
   );

   const beginDateTemplate = (rowData: User) => {
      return DateHelper.formatDate(rowData.begin_date);
   };

   const endDateTemplate = (rowData: User) => {
      return DateHelper.formatDate(rowData.end_date);
   };

   const gridColumns = [
         <Column
            key={0}
            field="name"
            sortable
            header="Фамилия Имя Отчество"
            style={{ width: '20%' }}>
         </Column>,
         <Column
            key={1}
            field="division.name"
            sortable
            header="Подразделение"
            style={{ width: '45%' }}>
         </Column>,
         <Column
            key={2}
            field="email"
            sortable
            header="Учетная запись"
            style={{ width: '15%' }}>
         </Column>,
         <Column
            key={3}
            body={beginDateTemplate}
            style={{ width: '10%' }}>
         </Column>,
         <Column
            key={4}
            body={endDateTemplate}
            style={{ width: '10%' }}>
         </Column>
      ];
//#endregion

//#region Card
   const getDivisionsTree = () => {
      const prepareData = (data: any) : TreeNode[] => {
         const result: TreeNode[] = [];
         //@ts-ignore
         data?.map((item, index) => {
            result.push({
                  id: item.data.id?.toString(),
                  key: item.data.id,
                  label: item.data.name,
                  icon: `pi pi-fw ${item.children?.length === 0 ? "pi-briefcase" : "pi-folder"}`,
                  children: prepareData(item.children)
            });
         });
         return result;
      }
      const fetchData = async () => {
         try {
            const res = await fetch('/api/division/read', {
               cache: "no-store"
            });
            if (!res.ok) {
               throw new Error('Failed to fetch data for divisions');
            }
            await res.json().then((item) => {
               if (item.status === 'success') {
                  let treeNodes = prepareData(item.result);
                  setDivisions(treeNodes);
               }
            });
         } catch (e){
            console.log(e);
         }
      }
      fetchData();
   }

   const user = useFormik<User>({
      initialValues: emptyUser,
      validate: (data) => {
         let errors: FormikErrors<User> = {};
         if (!data.name){
            errors.name = "Наименование подразделения должно быть заполнено!";
         }
         return errors;
      },
      onSubmit: () => {
         user.resetForm();
      }
   });

   const checkBox = (entry: any) => {
      return (
         <div className="flex justify-content-between mb-3">
            <div>{entry.name}</div>
            <InputSwitch checked={entry.active} onChange={(e) => switchChecked(e.value, entry)}/>
         </div>
      )
   }

   const switchChecked = (checked: boolean | null | undefined, entry: any) => {
      debugger;
      let _roles = currentUserRoles.map((item: any) => {
         return item;
      });
      // if (checked) {
      //    _roles[entry[0]] = entry[1];
      // } else {
      //    delete _roles[entry[0]];
      // }
      setCurrentUserRoles(_roles);
   }

   const card = () => {
      return (
         <form onSubmit={saveUser}>
               <div className="card p-fluid">
                  <TabView>
                     <TabPanel header="Основные данные">
                        <div className="p-fluid formgrid grid">
                           <div className="field col-12">
                              <label htmlFor="name">Фамилия, имя и отчество</label>
                              <div className="p-inputgroup">
                                 <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                 </span>
                                 <InputText id="name"  placeholder="Фамилия, имя и отчество"
                                                   className={classNames({"p-invalid": submitted && !user.values.name})}
                                                   value={user.values.name}
                                                   onChange={(e) => user.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
                              </div>
                           </div>
                           <div className="field col-12">
                              <label htmlFor="email">Адрес электронной почты</label>
                              <div className="p-inputgroup">
                                 <span className="p-inputgroup-addon">
                                    <i className="pi pi-envelope"></i>
                                 </span>
                                 <InputText id="name"  placeholder="Адрес электронной почты"
                                                   className={classNames({"p-invalid": submitted && !user.values.email})}
                                                   value={user.values.email}
                                                   onChange={(e) => user.setFieldValue('email', e.target.value)} required autoFocus type="email"/>
                              </div>
                           </div>
                           <div className="field col-12">
                              <label htmlFor="contacts">Контактная информация</label>
                              <div className="p-inputgroup">
                                 <span className="p-inputgroup-addon">
                                    <i className="pi pi-phone"></i>
                                 </span>
                                 <InputText id="contacts"  placeholder="Контактная информация"
                                                   className={classNames({"p-invalid": submitted && !user.values.contacts})}
                                                   value={user.values.contacts}
                                                   onChange={(e) => user.setFieldValue('contacts', e.target.value)} required autoFocus type="text"/>
                              </div>
                           </div>
                           <div className="field col-12">
                              <label htmlFor="contacts">Подразделение</label>
                              <TreeSelect
                                    id="division" className={classNames({"p-invalid": submitted && !user.values.division_id})}
                                    required options={divisions} value={user.values.division_id?.toString()} onChange={(e) => user.setFieldValue('division_id', e.target.value)} />
                           </div>
                           <div className="field col-12 md:col-6">
                              <label htmlFor="begin_date">Дата начала действия</label>
                              <Calendar id="begin_date" className={classNames({"p-invalid": submitted && !user.values.begin_date})} value={new Date(user.values.begin_date)} onChange={(e) => user.setFieldValue('begin_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar/>
                           </div>
                           <div className="field col-12 md:col-6">
                              <label htmlFor="end_date">Дата окончания действия</label>
                              <Calendar id="end_date" value={user.values.end_date !== null ? new Date(user.values.end_date as Date) : null} onChange={(e) => user.setFieldValue('end_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar/>
                           </div>
                        </div>
                     </TabPanel>
                     <TabPanel header="Роли">
                        {
                           //@ts-ignore
                           user.values?.roles?.map((entry) => checkBox(entry))
                        }
                     </TabPanel>
                  </TabView>
               </div>
         </form>
      );
   }
//#endregion

//#region CRUD
   const createUser = () => {
   }

   const updateUser = (data: User) => {
      setCardHeader('Редактирование пользователя');
      getDivisionsTree();
      user.setValues(data);
      setCurrentUserRoles(data.roles);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteUser = () => {

   }

   const saveUser = async () => {

   }
//#endregion
   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Пользователи системы</h3>
               <ItrGrid
                  id="userGrid"
                  read={'/api/users/read'}
                  create={createUser}
                  update={updateUser}
                  drop={deleteUser}
                  tableStyle={{minWidth: '50rem'}}
                  showClosed={true}
                  columnFields={columnFields}
                  headerColumnGroup={periodColumn}
                  columns={gridColumns}
                  ref={grid}
               />
               <ItrCard
                  header={cardHeader}
                  dialogStyle={{ width: '35vw' }}
                  save={saveUser}
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

export default Users;
