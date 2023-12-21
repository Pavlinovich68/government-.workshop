import React from "react";
import styles from "./styles.module.scss";
import { classNames } from "primereact/utils";

const ItrEventsList = ({id, count}: any) => {
   return (
      count > 0 ?
      <div key={id} className={classNames("p-badge p-component p-badge-no-gutter bg-orange-500 hover:bg-orange-700", styles.eventsButton)}>{count}</div>
      : <></>
   );
}

export default ItrEventsList;