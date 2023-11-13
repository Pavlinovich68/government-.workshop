import React, {forwardRef, Ref, useImperativeHandle, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ICardRef} from "../models/ICardRef";

const ItrCard = ({header, dialogStyle, body, save, hiddenSave = false} : any, ref: Ref<ICardRef>) => {
   const [editorVisible, setEditorVisible] = useState<boolean>(false);


   const visible = (visible: boolean) => {
      setEditorVisible(visible)
   };

   useImperativeHandle(ref, () => ({visible}));

   const dialogFooter = (
      <div className="itr-dialog-footer">
         <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={() => setEditorVisible(false)}/>
         <Button label="Сохранить" icon="pi pi-check" autoFocus onClick={() => save()} type="submit" visible={!hiddenSave} />
      </div>
   );
   return (
      <Dialog
         className="itr-dialog"
         header={header}
         visible={editorVisible}
         style={dialogStyle}
         footer={dialogFooter}
         onHide={()=> setEditorVisible(false)}>
         {body}
      </Dialog>
   );
}

export default forwardRef(ItrCard);