'use client'
import React, {useEffect, useRef, useState} from "react";
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'

const Divisions = () => {
   const [divisions, setDivisions] = useState([]);

   useEffect(() => {
      // Получение данных по подразделениям

   }, []);

   const togglerTemplate = (node, options) => {
      if (!node) {
         return;
      }

      const expanded = options.expanded;
      const iconClassName = classNames('p-treetable-toggler-icon pi pi-fw', {
         'pi-caret-right': !expanded,
         'pi-caret-down': expanded
      });

      return (
         <button type="button" className="p-treetable-toggler p-link" style={options.buttonStyle} tabIndex={-1} onClick={options.onClick}>
            <span className={iconClassName} aria-hidden="true"></span>
         </button>
      );
   };

   const actionTemplate = () => {
      return (
         <div className="flex flex-wrap gap-2">
            <Button type="button" icon="pi pi-search" rounded></Button>
            <Button type="button" icon="pi pi-pencil" severity="success" rounded></Button>
         </div>
      );
   };

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Подразделения</h3>
               <TreeTable value={divisions} togglerTemplate={togglerTemplate} tableStyle={{ minWidth: '50rem' }} rowHover="true" stripedRows="true">
                  <Column field="name" header="Наименование структурного подразделения" expander style={{width: '70%'}}></Column>
                  <Column field="contacts" header="Контактная информация"></Column>
                  <Column body={actionTemplate} headerClassName="w-10rem" />
               </TreeTable>
            </div>
         </div>
      </div>
   );
};

export default Divisions;
