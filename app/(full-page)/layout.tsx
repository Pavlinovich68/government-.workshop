'use client'
import React, {createContext} from 'react';
import {SessionProvider} from "next-auth/react";
import Store from "@/store/store";

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            <SessionProvider>
                    {children}
            </SessionProvider>
        </React.Fragment>
    );
}
