/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import Image from "next/image";
import {signOut} from "next-auth/react";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
   const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
   const menubuttonRef = useRef(null);
   const topbarmenuRef = useRef(null);
   const topbarmenubuttonRef = useRef(null);

   useImperativeHandle(ref, () => ({
      menubutton: menubuttonRef.current,
      topbarmenu: topbarmenuRef.current,
      topbarmenubutton: topbarmenubuttonRef.current
   }));

   return (
      <div className="layout-topbar">
            <button  type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
               <i className="pi pi-bars" />
            </button>

            <Link href="/" className="layout-topbar-logo">
               <Image src={`/layout/images/logo.svg`}
                     alt="Logo"
                     width="0"
                     height="0"
                     sizes="100vw"
                     style={{ width: '32px', height: 'auto' }}
               />
               <span>Центр коммуникаций Правительства Челябинской области</span>
            </Link>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
               <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
               <button type="button" className="p-link layout-topbar-button">
                  <i className="pi pi-calendar"></i>
                  <span>Calendar</span>
               </button>
               <button type="button" className="p-link layout-topbar-button">
                  <i className="pi pi-user"></i>
                  <span>Profile</span>
               </button>
               <button type="button" className="p-link layout-topbar-button" onClick={() => {signOut({callbackUrl: "/login"})}}>
                  <i className="pi pi-sign-out"></i>
                  <span>Settings</span>
               </button>
            </div>
      </div>
   );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
