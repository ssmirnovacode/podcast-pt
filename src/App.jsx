import {Link, Outlet, Route, Routes } from 'react-router-dom';
import Episode from './components/Episode';
import Main from "./components/Main";
import Podcast from './components/Podcast';
import './App.css'
import React, { useState } from 'react';
import { ActiveItemContext } from './context/ActiveItemContext';

const App = () => {

    const [ activeItem, setActiveItem ] = useState({});
    console.log('val', activeItem)
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