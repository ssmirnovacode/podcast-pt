import {Link, Route, Routes } from 'react-router-dom';
import Episode from './components/Episode';
import Main from "./components/Main";
import Podcast from './components/Podcast';
import './App.css'

const App = () => {
   
    return (
        <div className='app'>
        <h1 className='header'><Link to="/">Podcaster</Link></h1>
        <Routes>
                <Route path={'/'} index element={<Main/>}/>  
                <Route path={'/podcast/:podcastId'} element={<Podcast/>}>
                    <Route path={'episode/:episodeId'} element={<Episode/>}/>
                </Route>
            </Routes> 
        </div>
            
        )
}

export default App;