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
       fetchData().then((data) => {
           if (data.status === 'success'){
                setPageNo(1);
                setPageSize(data.data.pageSize);
                setRecordCount(data.data.recordCount);
                setRecords(data.data.result)
           }
       })
    });



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

    const fetchData = async () => {
        const response  = await fetch('/api/users/read', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                pageSize: 10,
                pageNo: 1,
                orderBy: null,
                searchStr: null
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

                    >

                    </DataTable>
                    <ConfirmDialog />
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
};

export default Users;
