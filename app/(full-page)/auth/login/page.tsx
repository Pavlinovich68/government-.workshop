/* eslint-disable @next/next/no-img-element */
'use client';
import React, {useContext, useRef, useState} from 'react';
import type {FormEventHandler} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {$app_variables} from "../../../../app.variables";
import {signIn, useSession} from "next-auth/react";
import {Context} from "preact/compat";
import {AuthContext} from "@/layout/layout";
import {IDivision} from "@/models/IDivision";


const LoginPage = () => {
   const {store} = useContext(AuthContext);
   const [email, setEmail] = useState<string>('')
   const [password, setPassword] = useState<string>('')
   const [rest, setRest] = useState<string>('')
   const shift = useRef<HTMLDivElement>(null);
   const searchParams = useSearchParams();

   const session = useSession();
   const router = useRouter();

   if (session.status == "authenticated"){
      router?.push("/")
   }

   console.log('store', store)

   async function getUser(email: string) {
      const res = await fetch(`http://localhost:3000/api/users/${email}`, {
            cache: "no-store",
      });

      if (!res.ok) {
            throw new Error("Failed to fetch data");
      }

      return await res.json();
   }


   const handleSubmit = async (e: any) => {
      e.preventDefault();
      signIn('credentials', {
         email,
         password,
         redirect: false,
      });
      router?.push("/");
      //   const user = await getUser(email);
      //   if (user.status === 'success') {
      //       console.log('user', user);
      //       /*id?: number;
      //       email?: string,
      //           division?: IDivision,
      //           name: string,
      //           begin_date: Date,
      //           end_date?: Date
      //       roles: any[];*/
      //       const id = user.result.id;
      //       const name = user.result.name;
      //       const hash = user.result.password;

      //       await signIn('credentials', { id, name, email, password, hash });
      // }
   }

   const rightToLeft = () => {
      shift.current?.classList.add('itr-right-panel-active');
   }

   const leftToRight = () => {
      shift.current?.classList.remove('itr-right-panel-active');
   }



   return (
      <React.Fragment>
            <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
               {session.status !== "authenticated" ? <div ref={shift} className="itr-login-form">
                  <div className="itr-form-container itr-sign-up-container">
                        <form action="#">
                           <h1>Восстановление пароля</h1>
                           <input type="email" placeholder="Адрес электронной почты" value={rest} onChange={e => setRest(e.target.value)}/>
                           <button disabled={!rest} >Отправить</button>
                        </form>
                  </div>
                  <div className="itr-form-container itr-sign-in-container">
                        <form action="#" onSubmit={handleSubmit}>
                           <h1>Вход в систему</h1>
                           <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                           <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                           <button disabled={!email || !password} type='submit'>Войти</button>
                        </form>
                  </div>
                  <div className="itr-overlay-container">
                        <div className="itr-overlay">
                           <div className="itr-overlay-panel itr-overlay-left">
                              <img src={'/layout/images/logo.svg'} alt =""/>
                              <h1>{$app_variables.TITLE}</h1>
                              <p>На указанный адрес электронной почты будет выслано письмо со ссылкой на форму восстановления пароля</p>
                              <button className="itr-ghost" id="signIn" onClick={() => leftToRight()}>Войти в систему</button>
                           </div>
                           <div className="itr-overlay-panel itr-overlay-right">
                              <img src={'/layout/images/logo.svg'} alt =""/>
                              <h1>{$app_variables.TITLE}</h1>
                              <p>Для входа в систему введите адрес электронной почты и пароль</p>
                              <button className="itr-ghost" id="signUp" onClick={() => rightToLeft()}>Восстановить пароль</button>
                           </div>
                        </div>
                  </div>
               </div> : <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1'}}></i> }
            </div>
      </React.Fragment>
    );
};

export default LoginPage;
