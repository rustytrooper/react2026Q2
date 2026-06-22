// app/about/page.tsx
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function About(): ReactNode {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow w-2/3 mx-auto">
        <p className="pt-12 text-gray-700 dark:text-gray-300 leading-relaxed">
          This is a project, that is developing by Diana Solovey at the RS React
          course. Each week there are new features in here, so let's keep in
          touch. Also big thanks to our mentor Aleksander Tsurkan for mentioning
          bottlenecks in our projects so that we could improve our skills.
        </p>
      </div>

      <div className="mt-auto flex justify-center pb-8">
        <Link 
          href="https://rs.school/courses" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <Image
            src="/i.png"  // ← путь к изображению в public/
            alt="RS School Courses"
            width={200}
            height={100}
            className="object-contain"
          />
        </Link>
      </div>
    </div>
  );
}