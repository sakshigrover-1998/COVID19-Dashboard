import TableLoader from './loaders/Table';

import {DATA_API_ROOT, GOSPEL_DATE} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import useStickySWR from '../hooks/useStickySWR';
import {fetcher, getStatistic, retry} from '../utils/commonFunctions';

import classnames from 'classnames';
import {useState, useRef, lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {useLocation} from 'react-router-dom';
import {useLocalStorage, useSessionStorage, useWindowSize} from 'react-use';

const Actions = lazy(() => retry(() => import('./Actions')));
const Footer = lazy(() => retry(() => import('./Footer')));
const Level = lazy(() => retry(() => import('./Level')));
const LevelVaccinated = lazy(() => retry(() => import('./LevelVaccinated')));
const MapExplorer = lazy(() => retry(() => import('./MapExplorer')));
const MapSwitcher = lazy(() => retry(() => import('./MapSwitcher')));
const Minigraphs = lazy(() => retry(() => import('./Minigraphs')));
const Search = lazy(() => retry(() => import('./Search')));
const StateHeader = lazy(() => retry(() => import('./StateHeader')));
const Table = lazy(() => retry(() => import('./Table')));
const TimeseriesExplorer = lazy(() =>
  retry(() => import('./TimeseriesExplorer'))
);

function Home() {
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });

  const [anchor, setAnchor] = useLocalStorage('anchor', null);
  const [expandTable, setExpandTable] = useLocalStorage('expandTable', false);
  const [mapStatistic, setMapStatistic] = useSessionStorage(
    'mapStatistic',
    'active'
  );
  const [date, setDate] = useState('');
  const location = useLocation();

  const {data: timeseries} = useStickySWR(
    `${DATA_API_ROOT}/timeseries.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const {data} = useStickySWR(
    `${DATA_API_ROOT}/data${date ? `-${date}` : ''}.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const homeRightElement = useRef();
  const isVisible = useIsVisible(homeRightElement);
  const {width} = useWindowSize();

  const hideDistrictData = date !== '' && date < GOSPEL_DATE;
  const hideVaccinated =
    getStatistic(data?.['TT'], 'total', 'vaccinated') === 0;

  return (
    <>


      <div className="Home">
        <div
          className={classnames('home-right', {expanded: expandTable})}
          ref={homeRightElement}
          style={{minHeight: '2rem'}}
        >
          {(isVisible || location.hash) && (
            <>
              {data && (
                <div
                  className={classnames('map-container', {
                    expanded: expandTable,
                    stickied:
                      anchor === 'mapexplorer' || (expandTable && width > 769),
                  })}
                >
               
                    <StateHeader data={data['TT']} stateCode={'TT'} />
                    
              
                </div>
              )}

              {timeseries && (
                <Suspense fallback={<div style={{height: '50rem'}} />}>
                  <TimeseriesExplorer
                    stateCode="TT"
                    {...{
                      timeseries,
                      date,
                      regionHighlighted,
                      setRegionHighlighted,
                      anchor,
                      setAnchor,
                      expandTable,
                      hideVaccinated,
                    }}
                  />
                </Suspense>
              )}
            </>
          )}
        </div>
      </div>

      {isVisible && (
        <Suspense fallback={<div />}>
         
        </Suspense>
      )}
    </>
  );
}

export default Home;
