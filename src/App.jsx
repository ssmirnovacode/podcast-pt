import {Link, Outlet, Route, Routes } from 'react-router-dom';
import Episode from './components/Episode';
import Main from "./components/Main";
import Podcast from './components/Podcast';
import './App.css'
import React, { useEffect, useState } from 'react';
import { ActiveItemContext } from './context/ActiveItemContext';
import { podcastsCache } from './utils/cacheRef';
import PodcastSummary from './components/PodcastSummary';
import PodcastDetails from './components/PodcastDetails';
import { LoadingContext } from './context/LoadingContext';
import Spinner from './components/Spinner';

const App = () => {

    const [ activeItem, setActiveItem ] = useState({});
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        (async () => {
            const activeItem = await podcastsCache.getItem('activeItem');
            activeItem && setActiveItem(JSON.parse(activeItem))
        })()
    }, [])
    
    return (
        <LoadingContext.Provider value={[ loading, setLoading ]}>
            <ActiveItemContext.Provider value={[ activeItem, setActiveItem ]}>
            <div className='app'>
                <div className='header-wrapper'>
                    <h1 className='header'><Link to="/">Podcaster</Link></h1>
                { loading && <Spinner />}
                </div>
                
                <Routes>
                    <Route path={'/'} index element={<Main bla='bla' />}/>  
                    <Route path={'/podcast/'} element={<Podcast />}>
                        <Route index element={<PodcastSummary item={activeItem}/>} />
                        <Route path={':podcastId'} element={<PodcastDetails />}/>
                        <Route path={':podcastId/episode/:episodeId'} element={<Episode/>}/>
                        {/* <Route path={':podcastId'} element={<PodcastDetails />}>
                            <Route index element={<PodcastDetails />} />
                            <Route path={'episode/:episodeId'} element={<Episode/>}/>
                        </Route> */}
                        
                    </Route>
                </Routes> 
            </div>
            </ActiveItemContext.Provider>
        </LoadingContext.Provider>
          
        )
}

export default App;