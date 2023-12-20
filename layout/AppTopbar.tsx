/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import Image from "next/image";
import {signOut} from "next-auth/react";
import {useSession} from "next-auth/react";
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';


const getAvatar = async (id: number) => {
   const res = await fetch(`/api/attachment/read?id=${id}`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      }
   });
   const data = await res.json();
   if (data.status === 'success') {
      return await data.data.body;
   }
}

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
   const {data: session, status, update} = useSession();
   const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
   const menubuttonRef = useRef(null);
   const topbarmenuRef = useRef(null);
   const topbarmenubuttonRef = useRef(null);
   const [avatar, setAvatar] = useState('');

   //@ts-ignore
   if (session?.user?.avatar) {
      //@ts-ignore
      getAvatar(session.user?.avatar).then((i) => {
         setAvatar(i);
      });
   }

   useImperativeHandle(ref, () => ({
      menubutton: menubuttonRef.current,
      topbarmenu: topbarmenuRef.current,
      topbarmenubutton: topbarmenubuttonRef.current
   }));

   const profileCard = () => {
      return (
         <form onSubmit={saveProfile}>
            <div className="card p-fluid">
            </div>
         </form>
      );
   }

   const saveProfile = async () => {

   }

   const op = useRef(null);

   return (
      <div className="layout-topbar">
         <button  type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle} title='Menubar'>
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

         <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar} title='Dropdown'>
            <i className="pi pi-ellipsis-v" />
         </button>

         <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
            <button type="button" className="p-link layout-topbar-button">
               <i className="pi pi-bell"></i>
               <span>События</span>
            </button>
            <button type="button" className="p-link layout-topbar-button" onClick={(e) => {
               //@ts-ignore
                  op.current.toggle(e);
               }}>
               {avatar ? <Avatar image={avatar} size="large" shape="circle" className='itr-avatar'/> :
               <Avatar icon="pi pi-user" size="large" shape="circle" className='itr-avatar'/>}
            </button>
         </div>
         <OverlayPanel ref={op} showCloseIcon dismissable={false} style={{width:"25rem"}}>
            <div className='flex flex-row flex wrap'>
               <div className="flex flex-column mr-2">
                  {avatar ? <Avatar image={avatar} size="large" shape="circle" className='itr-avatar'/> :
                  <Avatar icon="pi pi-user" size="large" shape="circle" className='itr-avatar'/>}
               </div>
               <div className="flex flex-column">
                  <span className="font-bold">{session?.user.name}</span>
                  <div className="flex align-items-center gap-2 text-xs">
                     <span className="font-italic">{session?.user.email}</span>
                  </div>
               </div>
            </div>
            <div className='flex flex-row align-items-center wrap mt-3'>
               <div className="flex flex-column mr-2 text-2xl">
                  <i className='pi pi-sliders-v'></i>
               </div>
               <div className="flex flex-column">
                  <a className="flex align-items-center ml-2 mr-8">
                     <span className="no-underline hover:underline">Настройки</span>
                  </a>
               </div>
            </div>
            <div className='flex flex-row align-items-center flex wrap mt-3'>
               <div className="flex flex-column mr-2 text-2xl">
                  <i className='pi pi-question-circle'></i>
               </div>
               <div className="flex flex-column">
                  <a className="flex align-items-center ml-2 mr-8">
                     <span className="no-underline hover:underline">Руководство пользователя</span>
                  </a>
               </div>
            </div>
            <hr/>
            <div className='justify-content-center flex flex-row wrap mt-3'>
               <Button type="button" label="Выйти из системы" icon="pi pi-sign-out" outlined  onClick={() => {signOut({callbackUrl: "/login"})}}/>
            </div>
         </OverlayPanel>
      </div>
   );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
