import {forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState} from "react";
import styles from "./styles.module.scss";

const ItrTimeline = ({items}: any, ref: Ref<string[]>) => {
   const [data, setData] = useState<string[]>([]);

   const colors = (colors: string[]) => {
      setData(colors)
   };

   //@ts-ignore
   useImperativeHandle(ref, () => ({colors}));

   useEffect(() => {
      setData(items);
   }, [items]);

   return (
      <div className={styles.itrTimeline}>
            <div className={styles.timeGrid}>
               <div className={styles.timeHands}>
                  { Array.from(Array(8).keys()).map((item, i) => (<div key={`hands${i}`} className={styles.timeHandsCell}>{(i).toString().padStart(2, '0')}:00-{(i+1).toString().padStart(2, '0')}:00</div>)) }
               </div>
               <div className={styles.timeItems}>
                  { Array.from(Array(96).keys()).map((item, i) => (<div key={i} style={{backgroundColor: `${data[i]}`}} className={styles.itrGridCell}></div>)) }
               </div>
            </div>
            <div className={styles.timeGrid}>
               <div className={styles.timeHands}>
                  { Array.from(Array(8).keys()).map((item, i) => (<div key={`hands${i+8}`} className={styles.timeHandsCell}>{(i+8).toString().padStart(2, '0')}:00-{(i+9).toString().padStart(2, '0')}:00</div>)) }
               </div>
               <div className={styles.timeItems}>
                  { Array.from(Array(96).keys()).map((item, i) => (<div key={i+96} style={{backgroundColor: `${data[i+96]}`}} className={styles.itrGridCell}></div>)) }
               </div>
            </div>
            <div className={styles.timeGrid}>
               <div className={styles.timeHands}>
                  { Array.from(Array(8).keys()).map((item, i) => (<div key={`hands${i+16}`} className={styles.timeHandsCell}>{(i+16).toString().padStart(2, '0')}:00-{(i+17).toString().padStart(2, '0')}:00</div>)) }
               </div>
               <div className={styles.timeItems}>
                  { Array.from(Array(96).keys()).map((item, i) => (<div key={i+192} style={{backgroundColor: `${data[i+192]}`}} className={styles.itrGridCell}></div>)) }
               </div>
            </div>
      </div>
   );
}

export default forwardRef(ItrTimeline);