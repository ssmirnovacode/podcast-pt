import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom"
import { URL_PODCAST_DETAILS } from "../utils/constants";
import { podcastsCache } from "../utils/cacheRef";
import './Podcast.css'
import { ActiveItemContext } from "../context/ActiveItemContext";
import PodcastSummary from "./PodcastSummary";
import { LoadingContext } from "../context/LoadingContext";

const Podcast = () => {

    const [ info, setInfo ] = useState();
    const [ epiInfo, setEpiInfo ] = useState();

    const [activeItem, setActiveItem] = useContext(ActiveItemContext);
    const [ loading, setLoading ] = useContext(LoadingContext)

    useEffect(() => {
        (async () => {
            if (!activeItem) return;
            setLoading(true)
            const data = await podcastsCache.getItem('details');
            const epiData = await podcastsCache.getItem('episodes');
            if (data && data[activeItem?.id] ) { // 
                setInfo(data[activeItem?.id])
                if (epiData && epiData[activeItem?.id]) {
                    setEpiInfo(epiData[activeItem?.id])
                    setLoading(false)
                    return
                }
                return
                
            }
            try {
                setLoading(true)
                const stringToEncode = `${URL_PODCAST_DETAILS}?id=${activeItem?.id}`
                const fetchUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(stringToEncode)}`
                const result = await fetch(fetchUrl);
                const data = await result.json();
                const parsed = JSON.parse(data.contents.replace(/\\n/g));

                const info = {
                    artistName: parsed?.results[0]?.artistName,
                    trackName: parsed?.results[0]?.trackName,
                    releaseDate: parsed?.results[0]?.releaseDate,
                    trackTimeMillis: parsed?.results[0]?.trackTimeMillis
                }
                
                await podcastsCache.setItem('details', JSON.stringify({ [activeItem?.id] : info}))
                const epiString = `${URL_PODCAST_DETAILS}?id=${activeItem?.id}&country=US&media=podcast&entity=podcastEpisode`
                const epiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(epiString)}`
                const epiRes = await fetch(epiUrl);
                const epiData = await epiRes.json();
                const parsedEpiData = JSON.parse(epiData.contents.replace(/\\n/g));
                const episodesInfo = {
                    count: parsedEpiData?.resultCount,
                    episodes: parsedEpiData?.results?.filter(item => item.wrapperType === 'podcastEpisode')
                        .map(({ releaseDate, trackId, trackTimeMillis, trackName, description='', episodeUrl}) => ({
                            id: trackId,
                            date: releaseDate.slice(0,10).split('-').reverse().join('/'),
                            duration: trackTimeMillis,
                            title: trackName,
                            description,
                            audio: episodeUrl 

                        }))
                }
                setInfo(info)
                setEpiInfo(episodesInfo)
                setLoading(false)
                await podcastsCache.setItem('episodes', JSON.stringify({ [activeItem?.id] : episodesInfo})) 
                
                
            } catch (error) {
                console.error(error)
            }

         })()
    }, [activeItem])

    return activeItem?.id ? <div className="wrapper">
        <section className="podcast-info">
           <PodcastSummary activeItem={activeItem} />
        </section>
        {epiInfo && <Outlet context={{ details: epiInfo }} />}

    </div> : <></>
}

export default Podcast