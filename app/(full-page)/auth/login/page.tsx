/* eslint-disable @next/next/no-img-element */
'use client';
import React, {useRef, useState} from 'react';
import type {FormEventHandler} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {$app_variables} from "../../../../app.variables";
import {signIn, useSession} from "next-auth/react";
import {ProgressBar} from "primereact/progressbar";

const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [rest, setRest] = useState<string>('')
    const shift = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    const session = useSession();
    const router = useRouter();

    /*if (session.status == "loading"){

    }*/
    if (session.status == "authenticated"){
        router?.push("/")
    }


    console.log(session);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        signIn('credentials', { email, password });
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
