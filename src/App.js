import './App.scss';

import {retry} from './utils/commonFunctions';

import {lazy, useState, Suspense, useEffect} from 'react';
import {Route, Redirect, Switch, useLocation} from 'react-router-dom';
import useDarkMode from 'use-dark-mode';

const Home = lazy(() => retry(() => import('./components/Home')));

const State = lazy(() => retry(() => import('./components/State')));
const LanguageSwitcher = lazy(() =>
  retry(() => import('./components/LanguageSwitcher'))
);

const App = () => {
  const darkMode = useDarkMode(false);
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const location = useLocation();

  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'Home',
      showInNavbar: true,
    },


    {
      pageLink: '/state/:stateCode',
      view: State,
      displayName: 'State',
      showInNavbar: false,
    },
  ];

  useEffect(() => {
    if (showLanguageSwitcher) {
      // For Chrome, Firefox, IE and Opera
      document.documentElement.scrollTo({top: 0, behavior: 'smooth'});
      // For Safari
      document.body.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [showLanguageSwitcher]);

  return (
    <div className="App">



      <Suspense fallback={<div />}>
        <Switch location={location}>
          {pages.map((page, index) => {
            return (
              <Route
                exact
                path={page.pageLink}
                render={({match}) => <page.view />}
                key={index}
              />
            );
          })}
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </div>
  );
};

export default App;
