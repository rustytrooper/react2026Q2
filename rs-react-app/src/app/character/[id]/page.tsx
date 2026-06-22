'use client'  

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { charactersApi } from '../../../helpers/charactersApi';
import { Loader } from '../../../components/Loader/Loader';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import Link from 'next/link';
import Image from 'next/image';
import './charDet.css';

export default function CharacterPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.id as string;

  const queryString = searchParams?.toString() || '';
  const backUrl = `/${queryString ? `?${queryString}` : ''}`;

  const { 
    data: character, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersApi.getCharacterById(id),
    enabled: !!id,  
  });

  if (isLoading) {
    return <Loader />;
  }

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
      <div className="character-detail-overlay">
  
        <div className="character-detail-content">
         
          <div className="flex ">
           
            <Link 
              href={backUrl}
              className="inline-flex items-center mb-6 text-white hover:text-purple-800 transition-colors"
            >
              X
            </Link>
            <div  className="rounded-xl object-cover w-50 h-50 mx-auto my-4">
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
            <div className="">
              <p className=" font-bold text-gray-800 dark:text-white mb-4">
                {character.name}
              </p>

              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-700 dark:text-white">
                  🎬 Films
                </p>
                {character.films && character.films.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside text-gray-600 dark:text-white">
                    {character.films.map((film: string, index: number) => (
                      <li key={index}>{film}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No films available</p>
                )}
              </div>

            
              <div>
                <p className="text-lg font-semibold text-gray-700 dark:text-white">
                  📺 TV Shows
                </p>
                {character.tvShows && character.tvShows.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside text-gray-600 dark:text-white">
                    {character.tvShows.map((show: string, index: number) => (
                      <li key={index}>{show}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No TV shows available</p>
                )}
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}