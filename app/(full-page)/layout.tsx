import { Metadata } from 'next';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Рабочие совещания',
    description: 'Рабочие совещания Правительства и органов исполнительной власти Челябинской области.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'Рабочие совещания',
        url: '',
        description: 'Рабочие совещания Правительства и органов исполнительной власти Челябинской области.'
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}
