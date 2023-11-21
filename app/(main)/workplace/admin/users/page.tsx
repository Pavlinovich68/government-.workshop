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
   const emptyUser: User = {name: '', begin_date: new Date, end_date: null, roles: []};
   const [columnFields] = useState(["name", "division.name", "email", "begin_date", "end_date"]);
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const [cardHeader, setCardHeader] = useState('');
   const editor = useRef<ICardRef>(null);
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [divisions, setDivisions] = useState<TreeNode[]>([]);
   // При закрытии карточки через отмену восстанавливаем роли отсюда
   const [savedUserRoles, setSavedUserRoles] = useState<any>({});
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
         <div key={`role-outerDiv-${entry.role}`} className="flex justify-content-between mb-3">
            <div key={`role-innerDiv-${entry.role}`}>{entry.name}</div>
            <InputSwitch key={`role-${entry.role}`} checked={entry.active} onChange={(e) => switchChecked(e.value, entry)} tooltip="Выберите для доступности роли"/>
         </div>
      )
   }

   const switchChecked = (checked: boolean | null | undefined, entry: any) => {
      let _roles = currentUserRoles.map((item: any) => {
         if (item.role === entry.role) {
            item.active = checked;
         }
         return item;
      });
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
                                                   onChange={(e) => user.setFieldValue('name', e.target.value)} required autoFocus type="text" tooltip="Фамилия, имя и отчество"/>
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
                                                   onChange={(e) => user.setFieldValue('email', e.target.value)} required autoFocus type="email" tooltip="Адрес электронной почты"/>
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
                                                   onChange={(e) => user.setFieldValue('contacts', e.target.value)} required autoFocus type="text" tooltip="Контактная информация"/>
                              </div>
                           </div>
                           <div className="field col-12">
                              <label htmlFor="contacts">Подразделение</label>
                              <TreeSelect
                                    id="division" className={classNames({"p-invalid": submitted && !user.values.division_id})}
                                    required options={divisions} value={user.values.division_id?.toString()} onChange={(e) => user.setFieldValue('division_id', e.target.value)}  tooltip="Подразделение"/>
                           </div>
                           <div className="field col-12 md:col-6">
                              <label htmlFor="begin_date">Дата начала действия</label>
                              <Calendar id="begin_date" className={classNames({"p-invalid": submitted && !user.values.begin_date})} value={new Date(user.values.begin_date)} onChange={(e) => user.setFieldValue('begin_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата начала действия"/>
                           </div>
                           <div className="field col-12 md:col-6">
                              <label htmlFor="end_date">Дата окончания действия</label>
                              <Calendar id="end_date" value={user.values.end_date !== null ? new Date(user.values.end_date as Date) : null} onChange={(e) => user.setFieldValue('end_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата окончания действия"/>
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
   const saveUserRoles = (currentRoles: any) => {
      let _roles = [];
      for(const role of currentRoles){
         _roles.push({role: role.role, name: role.name, active: role.active});
      }
      setSavedUserRoles(_roles);
   }
   const createUser = () => {
      emptyUser.roles = Object.entries(appRoles).map((role) => {
         return {
            role: role[0],
            name: role[1],
            active: false
         }
      });
      setCardHeader('Создание нового пользователя');
      getDivisionsTree();
      user.setValues(emptyUser);
      setCurrentUserRoles(emptyUser.roles);
      saveUserRoles(emptyUser.roles);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateUser = (data: User) => {
      setCardHeader('Редактирование пользователя');
      getDivisionsTree();
      user.setValues(data);
      setCurrentUserRoles(data.roles);
      saveUserRoles(data.roles);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteUser = () => {

   }

   const saveUser = async () => {
      setSubmitted(true);
      if (!user.isValid) {
         const errors = Object.values(user.errors);
         //@ts-ignore
         toast.current.show({
            severity:'error',
            summary: 'Ошибка сохранения',
            content: (<div className="flex flex-column">
                        <div className="text-center mb-2">
                           <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                           <h3 className="text-red-500">Ошибка сохранения</h3>
                        </div>
                  {errors.map((item, i) => {
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
         if (recordState === RecordState.new) {
            const res = await fetch("/api/users/create", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(user.values),
            });

            const returnedData = await res.json();

            if (returnedData.status === 'error'){
               throw new Error(returnedData.message);
            }
         } else {
            const res = await fetch("/api/users/update", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(user.values),
            });

            const returnedData = await res.json();

            if (returnedData.status === 'error'){
               throw new Error(returnedData.message);
            }
         }
         if (grid.current) {
               grid.current.reload();
         }
      } catch (e: any) {
         // @ts-ignore
         toast.current.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         throw e;
      }
      if (editor.current) {
         editor.current.visible(false);
      }
   }

   const cancelUser = async () => {
      for (const role of user.values.roles) {
         //@ts-ignore
         let _role = savedUserRoles.find(r => r.role === role.role);
         if (_role) {
            role.active = _role.active;
         }
      }
      setCurrentUserRoles(savedUserRoles);
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
                  cancel={cancelUser}
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
