import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Episode from './components/Episode';
import Main from "./components/Main";
import Podcast from './components/Podcast';

const App = () => {
   
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} exact element={<Main/>}/>  
                <Route path={'podcast/:podcastId'} element={<Podcast/>}>
                    <Route path={'episode/:episodeId'} element={<Episode/>}/>
                </Route>
                
            </Routes>
        </BrowserRouter> 
        )
}

export default App;