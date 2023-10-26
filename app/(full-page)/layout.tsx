'use client'
import { Metadata } from 'next';
import React from 'react';
import {SessionProvider} from "next-auth/react";

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
