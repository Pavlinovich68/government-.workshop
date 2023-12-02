import {DataTable, DataTableSortMeta, DataTableStateEvent} from "primereact/datatable";
import gridTools from "../services/grid.tools";
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState, useRef} from "react";
import {Paginator} from "primereact/paginator";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Toolbar} from "primereact/toolbar";
import {Column} from "primereact/column";
import {confirmDialog} from "primereact/confirmdialog";
import { IGridRef } from "../types/IGridRef";
import {InputSwitch} from "primereact/inputswitch";
import CrudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import {Toast} from "primereact/toast";
import { IDataSourceResult } from "@/types/IDataSourceResult";

const ItrGrid = ({
   controller,
   create,
   update,
   drop,
   columns,
   columnFields,
   tableStyle,
   showClosed,
   headerColumnGroup} : any,
   ref: Ref<IGridRef>) => {

   const toast = useRef<Toast>(null);
   const [first, setFirst] = useState(0);
   const [orderBy, setOrderBy] = useState({});
   const [sort, setSort] = useState<DataTableSortMeta[]>([]);
   const [filter, setFilter] = useState('');
   const [pageSize, setPageSize] = useState(10);
   const [pageNo, setPageNo] = useState(1);
   const [recordCount, setRecordCount] = useState(0);
   const [records, setRecords] = useState<any>([]);
   const [allRecords, setAllRecords] = useState<boolean>(false);
   const [selectedRow, setSelectedRow] = useState(null);
   const [controllerName, setControllerName] = useState(controller);


   useEffect(() => {
      fetchData(10, 1, orderBy, filter, false).then((data: any) => {
         setPageNo(1);
         setPageSize(data.pageSize);
         setRecordCount(data.recordCount)
         setRecords(data.result);
         gridTools.cleanOrders(`${controller}Grid`);
      });
   }, []);

   const fetchData = async (pageSize: number, pageNo: number, orderBy: any, searchStr: string, showClosed: boolean) => {
      const res = await CrudHelper.crud(controllerName, CRUD.read, {
         pageSize: pageSize,
         pageNo: pageNo,
         orderBy: orderBy,
         searchStr: searchStr,
         showClosed: showClosed
      });
      if (res.status === 'success') {
         return res.data as IDataSourceResult;
      } else {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
      }
   }

   const onShowAll = (all: boolean) => {
      setAllRecords(all);
      fetchData(pageSize, pageNo, orderBy, filter, all).then((data: IDataSourceResult | undefined)=>{
         if (data){
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
   }

   const reload = () => {
      fetchData(pageSize, pageNo, orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
               setRecordCount(data.recordCount)
               setRecords(data.result);
         }
      });
   };

   useImperativeHandle(ref, () => ({reload}));
   const onSort = (event: DataTableStateEvent) => {
      if (event.multiSortMeta?.length === 0){
         return;
      }

      let sortMeta = event.multiSortMeta ?? [];

      let columnSort = sort.find(i => i.field === sortMeta[0].field);

      const prevSort = sort;
      if (!columnSort){
         prevSort.push(sortMeta[0]);
      } else {
         switch (columnSort.order){
            case 1: {
               columnSort.order = -1;
               break;
            }
            case 0: {
               columnSort.order = 1;
               break;
            }
            case -1: {
               const index = prevSort.indexOf(columnSort);
               if (index > -1){
                  prevSort.splice(index, 1);
               }
               break;
            }
         }
      }
      setSort(prevSort);
      let _orderBy: any[] = [];
      sort.forEach((item)=>{
         const words = item.field.split('.');
            let str = '{';
            if (item.order !== 0) {
               for (let i = 0; i < words.length; i++){
                  if (i < words.length-1){
                     str = `${str}"${words[i]}": {`
                  } else {
                     str = `${str}"${words[i]}": "${item.order === 1 ? 'asc' : 'desc'}"`
                  }
               }
               for (let i = 0; i < words.length-1; i++){
                  str = `${str}}`
               }
            }
            str += '}';
            _orderBy.push(JSON.parse(str));
      });
      setOrderBy(_orderBy);
      fetchData(pageSize, 1, _orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data){
            setPageNo(1);
            setPageSize(data.pageSize);
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
      gridTools.sortOrders(`${controller}Grid`, columnFields, prevSort);
   }

   const onRefreshCurrentPage = (event: any) => {
      fetchData(pageSize, pageNo, orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
   };

   const paginatorTemplate = {
      layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
      RowsPerPageDropdown: (options: any) => {
         const dropdownOptions = [
            { label: 5, value: 5 },
            { label: 10, value: 10 },
            { label: 20, value: 20 },
            { label: 120, value: 120 }
         ];

         return (
            <React.Fragment>
               <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                  Строк на странице:{' '}
               </span>
               <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
            </React.Fragment>
         );
      },
      CurrentPageReport: (options: any) => {
         return (
            <React.Fragment>
               <Button type="button" icon="pi pi-refresh" text onClick={onRefreshCurrentPage} tooltip="Обновить"  tooltipOptions={{position: "bottom"}}/>
            </React.Fragment>
         );
      }
   };
   const onPageChange = (event: any) => {
      setPageNo(event.page+1);
      setPageSize(event.rows);
      fetchData(event.rows, event.page +1, orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
            setFirst(event.page * pageSize +1);
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
   };

   const paginator =  <Paginator template={paginatorTemplate} first={first} rows={pageSize} totalRecords={recordCount} onPageChange={onPageChange} className="justify-content-end" />;

   const startContent = (
      <React.Fragment>
         <Button icon="pi pi-plus" rounded severity="success" aria-label="Bookmark"
            tooltip="Создать" tooltipOptions={{ position: 'top' }}
            onClick={() => create()}
         />
      </React.Fragment>
   );

   const onGlobalFilterChange = (e: any) => {
      const value = e.target.value;
      setFilter(value);
      fetchData(pageSize, 1, orderBy, value, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
            setPageNo(1);
            setPageSize(data.pageSize);
            setRecordCount(data.recordCount);
            setRecords(data.result);
         }
      });
   };
   const endContent = (
      <React.Fragment>
         {showClosed ? (
            <div className="flex flex-column itr-switch" style={{width: "14rem"}}>
               <label>Показать закрытые записи</label>
               <InputSwitch
                  checked={allRecords}
                  onChange={(e) => onShowAll(e.value ?? false)}
               />
            </div>
         ) : ''}
         <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={filter} onChange={onGlobalFilterChange} placeholder="Поиск" />
         </span>
      </React.Fragment>
   );
   const renderHeader = () => {
      return (
         <Toolbar start={startContent} end={endContent} />
      );
   };
   const header = renderHeader();

   const deleteRecord = async (id: any) => {
      await drop(id);
      fetchData(pageSize, pageNo, orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
   }

   const confirmDelete = (data: any) => {
      confirmDialog({
         message: `Вы уверены что хотите удалить запись?`,
         header: 'Удаление записи',
         icon: 'pi pi-exclamation-triangle text-red-500',
         acceptLabel: 'Да',
         rejectLabel: 'Нет',
         showHeader: true,
         accept: () => deleteRecord(data.id)
      });
   };

   const editRecordTemplate = (item: any) => {
      return <Button icon="pi pi-pencil" className="itr-row-button" rounded severity="info" aria-label="Редактировать"
               tooltip="Редактировать" tooltipOptions={{ position: 'top' }}
               onClick={() => update(item)}
      />
   }
   const deleteRecordTemplate = (item: any) => {
      return <Button icon="pi pi-trash" severity="danger" className="itr-row-button" rounded aria-label="Удалить"
               tooltip="Удалить" tooltipOptions={{ position: 'top' }}
               onClick={() => confirmDelete(item)}
      />
   }

   return <DataTable
      id={`${controller}Grid`}
      onSort={onSort}
      value={records}
      removableSort
      sortMode="multiple"
      showGridlines
      stripedRows
      tableStyle={tableStyle}
      footer={paginator}
      header={header}
      headerColumnGroup={headerColumnGroup}
      selectionMode="single" selection={selectedRow} onSelectionChange={(e) => setSelectedRow(e.value)}
   >
      <Column header="" body={editRecordTemplate} style={{ width: '1rem' }}/>
      {columns?.map((item: any) => item)}
      <Column header="" body={deleteRecordTemplate}  style={{ width: '1rem' }}/>
   </DataTable>;
}

export default forwardRef(ItrGrid);