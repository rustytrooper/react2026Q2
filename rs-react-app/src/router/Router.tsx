import { createBrowserRouter} from 'react-router';
import App from '../App';
import { CharacterDetail } from '../components/CharacterDetail/CharacterDetail';
import { About } from '../pages/About/About';
import { NotFound } from '../pages/NotFound/NotFound';
import { Layout } from '../components/Layout/Layout';

export const Router = createBrowserRouter([
  {
    Component: Layout,
    path: '/',
    errorElement: <p>Sorry, something went wrong</p>,
    children: [
       {
       path: '',
        Component: App,
        children: [
           {
           Component: CharacterDetail,
            path: 'character/:id',
          },
        ]
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
