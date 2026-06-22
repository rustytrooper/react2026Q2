import type { Metadata } from 'next'
import '../index.css';
import { Providers } from './providers';
import { Header } from '../components/Header/Header';

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App is a...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        
      </head>
      <body>
         <Providers>
         <Header/>
        <div id="root">{children}</div>
      </Providers>
      </body>
    </html>
  )
}