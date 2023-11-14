'use client'
import React, {useEffect, useRef, useState} from "react";
import {DataTable, DataTableSortMeta, DataTableStateEvent} from "primereact/datatable";

const Users = () => {
   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Пользователи системы</h3>
            </div>
         </div>
      </div>
   );
};

export default Users;
