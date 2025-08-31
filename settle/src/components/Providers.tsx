'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string | undefined
    return (
        <PrivyProvider
            appId={appId || ''}
            config={{
                appearance: {
                    theme: 'dark',
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    )
}
