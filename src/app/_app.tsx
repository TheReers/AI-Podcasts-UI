import React from 'react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export type AppProps = {
    Component: React.ComponentType
    pageProps: {
        session: Session
        [key: string]: any
    }

}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
