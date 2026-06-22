// // app/providers.tsx
// 'use client' 

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { cashTTL } from '../constants'
// import { useState } from 'react'

// export function Providers({ children }: { children: React.ReactNode }) {
//   // Создаем QueryClient один раз при монтировании
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: cashTTL,
//             gcTime: cashTTL * 2,
//             retry: 1,
//             throwOnError: (error) => {
//               console.error('Global error handler:', error)
//               return false
//             },
//           },
//         },
//       })
//   )

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//     </QueryClientProvider>
//   )
// }

// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cashTTL } from '../constants'
import { useState } from 'react'
import { ThemeProvider } from '../context/ThemeContext'  // ← импортируем ThemeProvider

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: cashTTL,
            gcTime: cashTTL * 2,
            retry: 1,
            throwOnError: (error) => {
              console.error('Global error handler:', error)
              return false
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>  {/* ← Оборачиваем в ThemeProvider */}
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}