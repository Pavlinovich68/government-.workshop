'use client'
import React, {useRef, useState} from "react";


const Hall = ({ params }: { params: { id: number }}) => {
   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>{params.id}</h3>
            </div>
         </div>
      </div>
   );
};

export default Hall;
