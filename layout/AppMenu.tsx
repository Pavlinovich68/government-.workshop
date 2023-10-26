/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        /*{
            label: 'Календари',
            items: [{ label: 'Дашборд', icon: 'pi pi-fw pi-chart-bar', to: '/' }]
        },
        {
            label: '',
            seperator: true
        },
        {
            label: 'Администрирование',
            visible: true,//checkRoles(['admin']),
            items: [
                {
                    label: 'Пользователи',
                    icon: 'pi pi-fw pi-id-card',
                    to: '/pages/users'
                }
            ]
        },*/
        {
            label: 'Справочники',
            visible: true,//checkRoles(['admin', 'expert']),
            items: [
                {
                    label: 'Подразделения',
                    icon: 'pi pi-fw pi-sitemap',
                    to: '/pages/references/divisions'
                },
                {
                    label: 'Здания',
                    icon: 'pi pi-fw pi-building',
                    to: '/pages/references/buildings'
                },
                {
                    label: 'Совещательные залы',
                    icon: 'pi pi-fw pi-volume-up',
                    to: '/pages/references/halls'
                }
            ]
        },
        /*{
            label: 'Рабочая область',
            visible: true,//checkRoles(['admin', 'expert']),
            items: [
                {
                    label: 'Объекты строительства',
                    icon: 'pi pi-fw pi-building'
                }
            ]
        }*/
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
