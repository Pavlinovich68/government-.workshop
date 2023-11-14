import React, {forwardRef, Ref, useImperativeHandle, useState, useRef} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ICardRef} from "../models/ICardRef";
import { ConfirmPopup } from 'primereact/confirmpopup';

const ItrCard = ({header, dialogStyle, body, save, hiddenSave = false} : any, ref: Ref<ICardRef>) => {
   const [editorVisible, setEditorVisible] = useState<boolean>(false);
   const saveButton = useRef(null);
   const [visibleConfirm, setVisibleConfirm] = useState(false);


   const visible = (visible: boolean) => {
      setEditorVisible(visible);
   };

   useImperativeHandle(ref, () => ({visible}));

   const dialogFooter = (
      <div className="itr-dialog-footer">
         <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={() => setEditorVisible(false)}/>
         <Button ref={saveButton} label="Сохранить" icon="pi pi-check" autoFocus onClick={() => setVisibleConfirm(true)} type="submit" visible={!hiddenSave} />
         <ConfirmPopup
            visible={visibleConfirm}
            onHide={() => setVisibleConfirm(false)}
            message="Вы действительно хотите сохранить изменения?"
            icon="pi pi-exclamation-triangle"
            //@ts-ignore
            target={saveButton.current}
            acceptLabel="Да"
            rejectLabel="Нет"
            accept={save}/>
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