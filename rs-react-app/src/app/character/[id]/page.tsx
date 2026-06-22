// // app/character/[id]/page.tsx
// 'use client'  

// import { useParams, useSearchParams } from 'next/navigation'
// import { useQuery } from '@tanstack/react-query'
// import { charactersApi } from '../../../helpers/charactersApi'
// import { Loader } from '../../../components/Loader/Loader'
// import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary'
// import Link from 'next/link'

// export default function CharacterPage() {
//   const params = useParams()
//   const searchParams = useSearchParams()
//   const id = params?.id as string

//   // Возвращаемся на страницу с сохранением query параметров
//   const backUrl = `/?${searchParams?.toString() || ''}`

//   const { data: character, isLoading } = useQuery({
//     queryKey: ['character', id],
//     queryFn: () => charactersApi.getCharacterById(id),
//   })

//   if (isLoading) {
//     return <Loader />
//   }

//   if (!character) {
//     return <div>Character not found</div>
//   }

//   return (
//     <ErrorBoundary>
//       <div className="container mx-auto p-4">
//         <Link 
//           href={backUrl}
//           className="inline-block mb-4 text-purple-600 hover:text-purple-800"
//         >
//           ← Back to search
//         </Link>

//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <img 
//             src={character.imageUrl} 
//             alt={character.name}
//             className="w-64 h-64 object-cover rounded-lg mx-auto"
//           />
//           <h1 className="text-3xl font-bold mt-4">{character.name}</h1>
//           {/* ... остальные поля */}
//         </div>
//       </div>
//     </ErrorBoundary>
//   )
// }

// app/characters/[id]/page.tsx
'use client'  // ← пока клиентский (использует useQuery)

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { charactersApi } from '../../../helpers/charactersApi';
import { Loader } from '../../../components/Loader/Loader';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import Link from 'next/link';
import Image from 'next/image';

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Получаем id из URL
  const id = params?.id as string;

  // Сохраняем query параметры для возврата
  const queryString = searchParams?.toString() || '';
  const backUrl = `/${queryString ? `?${queryString}` : ''}`;

  // Запрашиваем данные персонажа
  const { 
    data: character, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersApi.getCharacterById(id),
    enabled: !!id,  // ← запрос только если есть id
  });

  // Обработка загрузки
  if (isLoading) {
    return <Loader />;
  }

  // Обработка ошибки
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error loading character</h1>
        <p className="mt-2 text-gray-600">Please try again later</p>
        <Link 
          href="/"
          className="inline-block mt-4 text-purple-600 hover:text-purple-800"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  // Обработка "не найдено"
  if (!character) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Character not found</h1>
        <Link 
          href="/"
          className="inline-block mt-4 text-purple-600 hover:text-purple-800"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        {/* Кнопка возврата */}
        <Link 
          href={backUrl}
          className="inline-flex items-center mb-6 text-purple-600 hover:text-purple-800 transition-colors"
        >
          {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg> */}
          Back to search
        </Link>

        {/* Карточка персонажа */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="md:flex">
            {/* Изображение */}
            <div className="md:w-1/3 flex justify-center items-center p-6 bg-purple-50 dark:bg-purple-900">
              {character.imageUrl ? (
                <Image
                  src={character.imageUrl}
                  alt={character.name}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto max-h-80"
                  
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>

            {/* Информация */}
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {character.name}
              </h1>

              {/* Films */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  🎬 Films
                </h2>
                {character.films && character.films.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                    {character.films.map((film: string, index: number) => (
                      <li key={index}>{film}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No films available</p>
                )}
              </div>

              {/* TV Shows */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  📺 TV Shows
                </h2>
                {character.tvShows && character.tvShows.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                    {character.tvShows.map((show: string, index: number) => (
                      <li key={index}>{show}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No TV shows available</p>
                )}
              </div>

              {/* Дополнительная информация */}
              {character.allies && character.allies.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    🤝 Allies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {character.allies.join(', ')}
                  </p>
                </div>
              )}

              {character.enemies && character.enemies.length > 0 && (
                <div className="mt-2">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    ⚔️ Enemies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {character.enemies.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}