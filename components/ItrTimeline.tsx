import {forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState} from "react";
import {ICardRef} from "@/models/ICardRef";
import {ITimelineRef} from "@/models/ITimelineRef";

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
      <div className="itr-timeline">
            <div className="time-grid">
               <div className="time-hands">
                  { Array.from(Array(8).keys()).map((item, i) => (<div key={`hands${i}`} className="time-hands-cell">{(i).toString().padStart(2, '0')}:00-{(i+1).toString().padStart(2, '0')}:00</div>)) }
               </div>
               <div className="time-items">
                  { Array.from(Array(96).keys()).map((item, i) => (<div key={i} style={{backgroundColor: `${data[i]}`}} className="itr-grid-cell"></div>)) }
               </div>
            </div>
            <div className="time-grid">
               <div className="time-hands">
                  { Array.from(Array(8).keys()).map((item, i) => (<div key={`hands${i+8}`} className="time-hands-cell">{(i+8).toString().padStart(2, '0')}:00-{(i+9).toString().padStart(2, '0')}:00</div>)) }
               </div>
               <div className="time-items">
                  { Array.from(Array(96).keys()).map((item, i) => (<div key={i+96} style={{backgroundColor: `${data[i+96]}`}} className="itr-grid-cell"></div>)) }
               </div>
            </div>
            <div className="time-grid">
               <div className="time-hands">
                  { Array.from(Array(8).keys()).map((item, i) => (<div key={`hands${i+16}`} className="time-hands-cell">{(i+16).toString().padStart(2, '0')}:00-{(i+17).toString().padStart(2, '0')}:00</div>)) }
               </div>
               <div className="time-items">
                  { Array.from(Array(96).keys()).map((item, i) => (<div key={i+192} style={{backgroundColor: `${data[i+192]}`}} className="itr-grid-cell"></div>)) }
               </div>
            </div>
      </div>
   );
}

export default forwardRef(ItrTimeline);