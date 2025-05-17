'use client';

import {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import auth from "@/Auth"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [version, setVersion] = useState(0);

    const forceUpdate = () => setVersion(v => v + 1);

    useEffect(() => {
        const runAuth = async () => {
            if (pathname === '/callback') return;

            try {
                await auth.silentAuth();
                console.log("silent auth result", auth.isAuthenticated())
                forceUpdate()
            } catch (err: any) {
                if (err.error === 'login_required') return;
                console.error('Silent auth error:', err.error);
            }
        };

        runAuth();
    }, [pathname]);

    return <div key={version}>{children}</div>;
}