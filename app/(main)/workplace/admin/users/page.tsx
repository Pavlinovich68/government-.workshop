'use client'
import ItrGrid from "@/components/ItrGrid";
import React, {useEffect, useRef, useState} from "react";

const Users = () => {

   const read = () => {
   }
   //#region CRUD
   const createUser = () => {
   }

   const updateUser = () => {
   }

   const deleteUser = () => {

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
               />
            </div>
         </div>
      </div>
   );
};

export default Users;
