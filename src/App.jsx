import {Link, Outlet, Route, Routes } from 'react-router-dom';
import Episode from './components/Episode';
import Main from "./components/Main";
import Podcast from './components/Podcast';
import './App.css'
import React, { useEffect, useState } from 'react';
import { ActiveItemContext } from './context/ActiveItemContext';
import { podcastsCache } from './utils/cacheRef';

const App = () => {

    const [ activeItem, setActiveItem ] = useState({});

    useEffect(() => {
        (async () => {
            const activeItem = await podcastsCache.getItem('activeItem');
            activeItem && setActiveItem(JSON.parse(activeItem))
        })()
    }, [])
    
    return (
            <ActiveItemContext.Provider value={[ activeItem, setActiveItem ]}>
            <div className='app'>
                <h1 className='header'><Link to="/">Podcaster</Link></h1>
                <Routes>
                    <Route path={'/'} index element={<Main bla='bla' />}/>  
                    <Route path={'/podcast/:podcastId'} element={<Podcast/>}>
                        <Route path={'episode/:episodeId'} element={<Episode/>}/>
                    </Route>
                </Routes> 
            </div>
            </ActiveItemContext.Provider>
          
        )
}

export default App;