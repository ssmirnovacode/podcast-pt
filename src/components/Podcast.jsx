import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom"
import { URL_PODCAST_DETAILS } from "../utils/constants";
import { podcastsCache } from "../utils/cacheRef";
import './Podcast.css'
import { ActiveItemContext } from "../context/ActiveItemContext";
import PodcastSummary from "./PodcastSummary";

const Podcast = () => {
    const { podcastId } = useParams();

    const [ info, setInfo ] = useState();
    const [ epiInfo, setEpiInfo ] = useState();

    const [activeItem, setActiveItem] = useContext(ActiveItemContext);


    useEffect(() => {
        (async () => {
            const data = await podcastsCache.getItem('details');
           const epiData = await podcastsCache.getItem('episodes');
            if (data && data[podcastId] ) { // 
                setInfo(data[podcastId])
                if (epiData && epiData[podcastId]) {
                    setEpiInfo(epiData[podcastId])
                    return
                }
                return
                
            }
            try {
                const stringToEncode = `${URL_PODCAST_DETAILS}?id=${podcastId}`
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
                setInfo(info)
                await podcastsCache.setItem('details', JSON.stringify({ [podcastId] : info}))
                const epiString = `${URL_PODCAST_DETAILS}?id=${podcastId}&country=US&media=podcast&entity=podcastEpisode`
                const epiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(epiString)}`
                const epiRes = await fetch(epiUrl);
                const epiData = await epiRes.json();
                const parsedEpiData = JSON.parse(epiData.contents.replace(/\\n/g));
                const episodesInfo = {
                    count: parsedEpiData?.resultCount,
                    episodes: parsedEpiData?.results?.filter(item => item.wrapperType === 'podcastEpisode')
                        .map(({ releaseDate, trackId, trackTimeMillis, trackName}) => ({
                            id: trackId,
                            date: releaseDate.slice(0,10).split('-').reverse().join('/'),
                            duration: trackTimeMillis,
                            title: trackName

                        }))
                }
                setEpiInfo(episodesInfo)
                await podcastsCache.setItem('episodes', JSON.stringify({ [podcastId] : episodesInfo}))
            } catch (error) {
                console.error(error)
            }

         })()
    }, [])

    return podcastId ? <div className="wrapper">
        {/* <h2>{ podcastId}</h2> */}
        <section className="podcast-info">
            {
                info && <PodcastSummary activeItem={activeItem} />
                    
            }

        </section>
            {
                epiInfo && <Outlet context={{ details: epiInfo }} />
                // <div className="podcast-details">
                //     <section className="podcast-count">
                //         <div>Episodes: <span>{epiInfo?.count}</span></div>

                //     </section>
                //     <section className="podcast-episodes">
                //         { epiInfo.episodes?.map(item => {
                //             return <div  key={item.id} className="table-item">
                //                 <div className="table-item__title"><Link to={`podcast/${podcastId}/episode/${item.id}`}>{item.title}</Link></div>
                //                 <div className="table-item__date">{item.date}</div>
                //                 <div className="table-item__duration">{item.duration}</div>
                //             </div>
                //         })}

                //     </section>
                // </div>
            }

    </div> : <span>Loading</span>
}

export default Podcast