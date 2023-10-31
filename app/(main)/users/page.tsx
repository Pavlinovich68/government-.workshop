'use client'
import React, {useEffect, useRef, useState} from "react";
import {IUser} from "@/models/IUser";
import {Toast} from "primereact/toast";
import {TreeNode} from "primereact/treenode";
import {IGridRef} from "@/types/IGridRef";
import RecordState from "@/models/enums/record-state";
import {ICardRef} from "@/types/ICardRef";
import {useFormik} from "formik";
import {Column} from "primereact/column";
import {ColumnGroup} from "primereact/columngroup";
import {Row} from "primereact/row";
import {ConfirmDialog} from "primereact/confirmdialog";
import {DataTable} from "primereact/datatable";
import {IDataSourceResult} from "@/types/IDataSourceResult";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";

const Users = () => {
    const emptyUser: IUser = {name: '', begin_date: new Date(), roles: []}
    const toast = useRef(null);
    const [pageSize, setPageSize] = useState(10);
    const [pageNo, setPageNo] = useState(1);
    const [recordCount, setRecordCount] = useState(0);
    const [records, setRecords] = useState<any>([]);


    useEffect(() => {
       fetchData(10, 1, null, '').then((data) => {
           if (data.status === 'success'){
                setPageNo(data.data.pageNo);
                setPageSize(data.data.pageSize);
                setRecordCount(data.data.recordCount);
                setRecords(data.data.result)
           }
       })
    }, []);



    const user = useFormik<IUser>({
        initialValues: emptyUser,
        validate: (data) => {
            let errors = {};
            if (!data.email){
                // @ts-ignore
                errors.email = "Логин обязателен для заполнения"
            }
            if (!data.name){
                // @ts-ignore
                errors.last_name = "Фамилия Имя и Отчество обязательно должны быть заполнены"
            }
            if (!data.begin_date){
                // @ts-ignore
                errors.begin_date = "Дата начала действия обязательно должна быть заполнена"
            }
            if (!data.division){
                // @ts-ignore
                errors.division = "Подразделение обязательно должно быть заполнео"
            }
            if (!data.roles || data.roles.length === 0){
                // @ts-ignore
                errors.roles = "Должна быть установлена минимум одна роль"
            }
            return errors;
        },
        onSubmit: (data) => {
            user.resetForm();
        }
    });


    //#region Grid
    const formatDate = (date?: Date) => {
        if (!date) {
            return '';
        }
        return new Date(date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const beginDateTemplate = (rowData: IUser) => {
        return formatDate(rowData.begin_date);
    };

    const endDateTemplate = (rowData: IUser) => {
        return formatDate(rowData.end_date);
    };
    //#endregion

    const fetchData = async (pageSize: number, pageNo: number, orderBy: any, searchStr: string) => {
        const response  = await fetch('/api/users/read', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                pageSize: pageSize,
                pageNo: pageNo,
                orderBy: orderBy,
                searchStr: searchStr
            })
        });

        return await response.json();
    }

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
                <>
                  <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                      {options.first} - {options.last} из {options.totalRecords}
                  </span>
                  <Button type="button" icon="pi pi-refresh" text onClick={onRefreshCurrentPage}/>
                </>
            );
        }
    };

    const onRefreshCurrentPage = (event: any) => {
        fetchData(pageSize, pageNo, null, '').then((data)=>{
            if (data.status === 'success'){
                setRecordCount(data.data.recordCount);
                setRecords(data.data.result)
            }
        });
    };

    const gridHeader = (
        <ColumnGroup>
            <Row>
                <Column header="" rowSpan={2}/>
                <Column header="Фамилия Имя Отчество" rowSpan={2} sortable field="last_name"/>
                <Column header="Подразделение" rowSpan={2} sortable field="division.name"/>
                <Column header="Учетная запись" rowSpan={2} sortable field="email"/>
                <Column header="Период действия" colSpan={2}/>
                <Column header="" rowSpan={2}/>
            </Row>
            <Row>
                <Column header="Дата начала" sortable field="begin_date"/>
                <Column header="Дата окончания" sortable field="end_date"/>
            </Row>
        </ColumnGroup>
    );

    const editRecordTemplate = (item: any) => {
        return <Button icon="pi pi-pencil" className="itr-row-button" rounded severity="info" aria-label="Редактировать"
                       tooltip="Редактировать" tooltipOptions={{ position: 'top' }}

        />
    }
    const deleteRecordTemplate = (item: any) => {
        return <Button icon="pi pi-trash" severity="danger" className="itr-row-button" rounded aria-label="Удалить"
                       tooltip="Удалить" tooltipOptions={{ position: 'top' }}

        />
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h3>Пользователи системы</h3>
                    <DataTable
                        id="userGrid"
                        value={records}
                        removableSort
                        sortMode="multiple"
                        showGridlines
                        stripedRows
                        tableStyle={{minWidth: '50rem'}}
                        headerColumnGroup={gridHeader}
                    >
                        <Column header="" body={editRecordTemplate} style={{ width: '1rem' }}/>
                        <Column field="name" sortable header="Фамилия Имя Отчество" style={{width: '20%'}}/>
                        <Column field="division.name" sortable header="Подразделение" style={{ width: '45%' }}/>
                        <Column field="email" sortable header="Учетная запись" style={{ width: '15%' }}/>
                        <Column body={beginDateTemplate} style={{ width: '10%' }}/>
                        <Column body={endDateTemplate} style={{ width: '10%' }}/>
                        <Column header="" body={deleteRecordTemplate}  style={{ width: '1rem' }}/>
                    </DataTable>
                    <ConfirmDialog />
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
};

export default Users;
