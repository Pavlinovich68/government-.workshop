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
import {ICardRef} from '@/models/ICardRef';
import ItrCard from "@/components/ItrCard";


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
   const profileEditor = useRef<ICardRef>(null);

   console.log(session?.user);
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
            <a></a>
            {avatar ? <Avatar image={avatar} size="large" shape="circle" className='itr-avatar' onClick={()=>{if (profileEditor.current) { profileEditor.current.visible(true); }}}/> :
            <Avatar icon="pi pi-user" size="large" shape="circle" className='itr-avatar'/>}

            <button type="button" className="p-link layout-topbar-button" onClick={() => {signOut({callbackUrl: "/login"})}}>
               <i className="pi pi-sign-out"></i>
               <span>Выход</span>
            </button>
         </div>
         <ItrCard
            header="Профиль пользователя"
            dialogStyle={{ width: '20vw' }}
            save={saveProfile}
            body={profileCard()}
            ref={profileEditor}
         />
      </div>
   );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
