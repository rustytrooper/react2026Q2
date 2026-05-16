import { createBrowserRouter } from 'react-router';
import App from '../App';
import { Home } from '../pages/Home/Home';
import { CharacterDetail } from '../components/CharacterDetail/CharacterDetail';
import { About } from '../pages/About/About';
import { NotFound } from '../pages/NotFound/NotFound';

export const Router = createBrowserRouter([
  {
    Component: App,
    path: '/',
    errorElement: <p>Sorry, something went wrong</p>,
    children: [
      {
        Component: Home,
        path: '',
        errorElement: <p>Sorry, something went wrong</p>,
        children: [
          {
            Component: CharacterDetail,
            path: 'character/:id',
          },
        ],
      },
      {
        Component: About,
        path: 'about',
      },
    ],
  },
  {
    Component: NotFound,
    path: '*',
  },
]);
