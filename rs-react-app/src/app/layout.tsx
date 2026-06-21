import type { Metadata } from 'next'

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
        {/* <meta charSet="UTF-8" /> */}
        {/* <link rel="icon" type="image/svg+xml" href="/src/assets/disney1.png" /> */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        {/* <title>Find disney characters</title> */}
      </head>
      <body>
        <div id="root">{children}</div>
        {/* <script type="module" src="/src/main.tsx"></script> */}
      </body>
    </html>
  )
}