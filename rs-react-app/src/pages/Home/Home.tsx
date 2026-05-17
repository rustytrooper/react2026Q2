import type { ReactNode } from 'react';
import { Outlet } from 'react-router';

export function Home(): ReactNode {
  return (
    <>
     <h1>Home</h1>
     <Outlet/>
    </>
 
);
}
