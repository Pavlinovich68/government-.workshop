import { IEventCard } from "@/models/IEventCard";
import React from "react";
import { Avatar } from 'primereact/avatar';
import { classNames } from "primereact/utils";
import styles from "./calendar/styles.module.scss";

const ItrEventCard = ({item} : any) => {
   return (
      <div className={classNames('card', styles.itrEventCard)}>
         <Avatar icon="pi pi-user" size="large" shape="circle" className='itr-avatar' image={item.logo}/>
         <div>{item.comment}</div>
         <div>{item.timeInterval}</div>
      </div>
   );
}

export default ItrEventCard;