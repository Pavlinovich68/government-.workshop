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
import ItrGrid from "@/components/ItrGrid";

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

    const gridColumns = (): JSX.Element[]  => {
        return [
            // eslint-disable-next-line react/jsx-key
            <Column
                field="name"
                sortable
                header="Фамилия Имя Отчество"
                style={{ width: '20%' }}>
            </Column>,
            // eslint-disable-next-line react/jsx-key
            <Column
                field="division.name"
                sortable
                header="Подразделение"
                style={{ width: '45%' }}>
            </Column>,
            // eslint-disable-next-line react/jsx-key
            <Column
                field="email"
                sortable
                header="Учетная запись"
                style={{ width: '15%' }}>
            </Column>,
            // eslint-disable-next-line react/jsx-key
            <Column
                body={beginDateTemplate}
                style={{ width: '10%' }}>
            </Column>,
            // eslint-disable-next-line react/jsx-key
            <Column
                body={endDateTemplate}
                style={{ width: '10%' }}>
            </Column>
        ];
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h3>Пользователи системы</h3>
                    <ItrGrid
                        id="usersGrid"
                        //create={createUser}
                        //read={UserService.read}
                        //update={editUser}
                        //drop={deleteUser}
                        columnFields={columnFields}
                        tableStyle={{minWidth: '50rem'}}
                        columns={gridColumns()}
                        showClosed={true}
                        headerColumnGroup={gridHeader}
                        ref={grid}
                    />
                    <ConfirmDialog />
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    );
};

export default Users;
