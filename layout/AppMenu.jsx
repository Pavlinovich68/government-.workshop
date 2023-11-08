/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import {useSession} from "next-auth/react";
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
   const {data: session, status, update} = useSession();

   console.log('Session object in AppMenu:', session)

   const { layoutConfig } = useContext(LayoutContext);

   const checkRoles = (accessRoles) => {
      const userRoles = session?.user?.roles;
      if (!userRoles) {
         return false;
      }
      const roles = Object.keys(userRoles);
      const intersection = accessRoles.filter(x => roles.includes(x));
      return intersection.length > 0
   }

   const model = [
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
            visible: checkRoles(['admin']),
            items: [
               {
                  label: 'Подразделения',
                  icon: 'pi pi-fw pi-sitemap',
                  to: '/pages/references/divisions'
               },
               {
                  visible: checkRoles(['admin']),
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
                  return !item?.seperator ? (<AppMenuitem item={item} root={true} index={i} key={item.label} />) : <li className="menu-separator"></li>;
               })}
            </ul>
      </MenuProvider>
   );
};

export default AppMenu;
