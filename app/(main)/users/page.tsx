'use client'
import React, {useRef, useState} from "react";
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

const Users = () => {
    const emptyUser: IUser = {name: '', begin_date: new Date(), roles: []}
    const toast = useRef(null);
    const grid = useRef<IGridRef>(null);
    const editor = useRef<ICardRef>(null);
    const [columnFields] = useState(["last_name", "division.name", "email", "begin_date", "end_date"]);
    const [cardHeader, setCardHeader] = useState('');
    const [recordStyle, setRecordStyle] = useState<RecordState>(RecordState.ready);
    const [submitted, setSubmitted] = useState(false);
    const [divisions, setDivisions] = useState<TreeNode[]>([]);


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

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h3>Пользователи системы</h3>
                    <ConfirmDialog />
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
};

export default Users;
