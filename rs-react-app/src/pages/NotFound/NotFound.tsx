import type { ReactNode } from 'react';
import { Link } from 'react-router';

export function NotFound(): ReactNode {
  return (
    <div className="bg-gray-100 min-h-screen">
      <h1>Page not found</h1>
      <img
        src="./src/assets/mermaid1.png"
        className="[clip-path:circle(20%_at_50%_50%)] w-150 h-90 mx-auto  object-cover"
        alt="error"
      />
      <Link to="/">Back home</Link>
    </div>
  );
}
