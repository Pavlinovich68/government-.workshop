/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import {useSession} from "next-auth/react";
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
   const {data: session, status, update} = useSession();

   const checkRoles = (accessRoles) => {
      const userRoles = session?.user?.roles;
      if (!userRoles) {
         return false;
      }
      const roles = Object.keys(userRoles);
      const intersection = accessRoles.filter(x => roles.includes(x));
      return intersection.length > 0
   }

   const reserveHoll = () => {
      const items = session?.user?.halls?.map((i) => { return {
         label: i.short_name,
         icon: 'pi pi-fw pi-calendar',
         to: `/workplace/halls/${i.id}`
      }})
      return items;
   }

   const reserveConf = () => {
      return [];
   }

   const model = [
      {
         label: 'Бронирование',
         items: [
            {
               label: 'Совещательные залы',
               visible: checkRoles(['admin', 'reserve-holl']),
               items: reserveHoll(),
            },
            {
               label: 'Комнаты ВКС',
               visible: checkRoles(['admin', 'reserve-conf']),
               items: reserveConf()
            }
         ]
      },
      {
         label: 'Инструменты',
         visible: checkRoles(['admin']),
         items: [
            {
               label: 'Справочники',
               visible: checkRoles(['admin']),
               items: [
                  {
                     label: 'Подразделения',
                     icon: 'pi pi-fw pi-sitemap',
                     to: '/workplace/references/divisions'
                  },
                  {
                     visible: checkRoles(['admin']),
                     label: 'Здания',
                     icon: 'pi pi-fw pi-building',
                     to: '/workplace/references/buildings'
                  },
                  {
                     label: 'Совещательные залы',
                     icon: 'pi pi-fw pi-volume-up',
                     to: '/workplace/references/hall'
                  }
               ]
            },
            {
               label: 'Администрирование',
               visible: checkRoles(['admin']),
               items: [
                  {
                     label: 'Пользователи',
                     visible: checkRoles(['admin']),
                     icon: 'pi pi-fw pi-user',
                     to: '/workplace/admin/users'
                  }
               ]
            }
         ]
      }
   ];

// TODO Меню
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
