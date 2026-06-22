// app/character/[id]/page.tsx
'use client'  

import { useParams, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { charactersApi } from '../../../helpers/charactersApi'
import { Loader } from '../../../components/Loader/Loader'
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary'
import Link from 'next/link'

export default function CharacterPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params?.id as string

  // Возвращаемся на страницу с сохранением query параметров
  const backUrl = `/?${searchParams?.toString() || ''}`

  const { data: character, isLoading } = useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersApi.getCharacterById(id),
  })

  if (isLoading) {
    return <Loader />
  }

  if (!character) {
    return <div>Character not found</div>
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <Link 
          href={backUrl}
          className="inline-block mb-4 text-purple-600 hover:text-purple-800"
        >
          ← Back to search
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <img 
            src={character.imageUrl} 
            alt={character.name}
            className="w-64 h-64 object-cover rounded-lg mx-auto"
          />
          <h1 className="text-3xl font-bold mt-4">{character.name}</h1>
          {/* ... остальные поля */}
        </div>
      </div>
    </ErrorBoundary>
  )
}