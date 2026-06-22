// import { ClientOnly } from './client'

// export default function Page() {
//   return <ClientOnly />
// }

// app/[[...slug]]/page.tsx
import { ClientOnly } from './client'

// Этот компонент будет рендерить App ТОЛЬКО для маршрутов,
// которые не найдены в app/
export default function CatchAllPage() {
  return <ClientOnly />
}