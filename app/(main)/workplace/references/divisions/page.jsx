'use client'
import React, {useEffect, useRef, useState} from "react";
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ICardRef } from '../../../../../models/ICardRef'
import {useFormik} from "formik";
import {Division} from "../../../../../models/Division";

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
   //const emptyDivision: Division = {id: 0, name: "", short_name: "", contacts: "", childrens: []};
   const [emptyDivision, setEmptyDivision] = useState<Division>({});
   const [divisions, setDivisions] = useState([]);
   const [globalFilter, setGlobalFilter] = useState('');
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');

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
   const division = useFormik<IDivision>({
      initialValues: emptyDivision,
      validate: (data) => {
         let errors = {};
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
   //#endregion
   //#region CRUD
   const createDivision = () => {
      setCardHeader('Создание нового подразделения');
      division.setValues(emptyDivision);

   }
   //#endregion

   const actionTemplate = () => {
      return (
         <div className="flex flex-wrap gap-2">
            <Button type="button" icon="pi pi-pencil" severity="success" rounded></Button>
         </div>
      );
   };

   const getHeader = () => {
      return (
         <div className="flex justify-content-end">
            <div className="p-input-icon-left">
               <i className="pi pi-search"></i>
               <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Поиск" />
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
                  <Column field="name" header="Наименование структурного подразделения" expander style={{width: '70%'}}></Column>
                  <Column field="contacts" header="Контактная информация"></Column>
                  <Column body={actionTemplate} headerClassName="w-5rem" />
               </TreeTable>
            </div>
         </div>
      </div>
   );
};

export default Divisions;
