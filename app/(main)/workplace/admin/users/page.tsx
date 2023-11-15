'use client'
import ItrGrid from "@/components/ItrGrid";
import React, {useEffect, useRef, useState} from "react";
import {ColumnGroup} from "primereact/columngroup";
import {Row} from "primereact/row";
import {Column} from "primereact/column";
import {IGridRef} from "@/models/IGridRef";
import DateHelper from "@/services/date.helpers";
import {User} from "@/models/User";

const Users = () => {
   const [columnFields] = useState(["last_name", "division.name", "email", "begin_date", "end_date"]);
   const grid = useRef<IGridRef>(null);
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

//#region CRUD
   const createUser = () => {
   }

   const updateUser = () => {
   }

   const deleteUser = () => {

   }

   const read = () => {
   }
//#endregion
   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Пользователи системы</h3>
               <ItrGrid
                  id="userGrid"
                  read={read}
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
            </div>
         </div>
      </div>
   );
};

export default Users;
