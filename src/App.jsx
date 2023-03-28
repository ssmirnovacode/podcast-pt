import {Link, Route, Routes } from 'react-router-dom';
import Episode from './components/Episode';
import Main from "./components/Main";
import Podcast from './components/Podcast';

const App = () => {
   
    return (
        <>
        <h1><Link to="/">Main</Link></h1>
        <Routes>
                <Route path={'/'} index element={<Main/>}/>  
                <Route path={'/podcast/:podcastId'} element={<Podcast/>}>
                    <Route path={'episode/:episodeId'} element={<Episode/>}/>
                </Route>
            </Routes> 
        </>
            
        )
}

export default App;