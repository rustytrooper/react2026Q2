// app/not-found.tsx
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

 function NotFound(): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        Page not found
      </h1>

      <div className="relative w-64 h-64 md:w-96 md:h-96 mb-8">
        <Image
          src="/mermaid1.png"
          alt="Error illustration"
          fill
          className="object-contain"
          priority
        />
      </div>

      <Link 
        href="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Back home
      </Link>
    </div>
  );
}

export default NotFound