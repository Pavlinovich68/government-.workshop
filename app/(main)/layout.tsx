import { Metadata } from 'next';
import Layout from '../../layout/layout';
import {Providers} from "@/components/Providers";

interface AppLayoutProps {
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

export default function AppLayout({ children }: AppLayoutProps) {
    return <Providers><Layout>{children}</Layout></Providers>;
}
