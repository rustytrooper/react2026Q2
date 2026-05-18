import type { ReactNode } from 'react';
import { Link } from 'react-router';

export function About(): ReactNode {
  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="flex-grow w-2/3 mx-auto">
        <p className="pt-12">
          This is a project, that is developing by Diana Solovey at the RS React
          course. Each weak there are new features in here, so let's keep in
          touch. Also big thanks to our mentor Aleksander Tsurkan for mentioning
          bottlenecks in our projects so that we could improve our skills
        </p>
      </div>

      <div className="mt-auto flex justify-center">
        <Link to="https://rs.school/courses">
          <img
            src="./src/assets/i.png"
            alt="rss courses"
            className="w-50 h-25 object-cover mt-auto"
          />
        </Link>
      </div>
    </div>
  );
}
