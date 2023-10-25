/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, {useContext, useRef, useState} from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import {$app_variables} from "../../../../app.variables";

const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [rest, setRest] = useState<string>('')
    const shift = useRef<HTMLDivElement>(null);

    const rightToLeft = () => {
        shift.current?.classList.add('itr-right-panel-active');
    }

    const leftToRight = () => {
        shift.current?.classList.remove('itr-right-panel-active');
    }

    const innerCss = `
        .itr-right-panel-active {
            background-color: orange;
        }`

    return (
        <React.Fragment>
            <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
                <div ref={shift} className="itr-login-form">
                    <div className="itr-form-container itr-sign-up-container">
                        <form action="#">
                            <h1>Восстановление пароля</h1>
                            <input type="email" placeholder="Адрес электронной почты" value={rest} onChange={e => setRest(e.target.value)}/>
                            <button disabled={!rest} >Отправить</button>
                        </form>
                    </div>
                    <div className="itr-form-container itr-sign-in-container">
                        <form action="#">
                            <h1>Вход в систему</h1>
                            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                            <button disabled={!email || !password} >Войти</button>
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
                </div>
            </div>
        </React.Fragment>
    );
};

export default LoginPage;
