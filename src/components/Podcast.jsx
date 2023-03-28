import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { URL_PODCAST_DETAILS } from "../utils/constants";
import { podcastsCache } from "../utils/cacheRef";

const Podcast = () => {
    const { podcastId } = useParams();

    const [ info, setInfo ] = useState();
    const [ epiInfo, setEpiInfo ] = useState();

    useEffect(() => {
        (async () => {
            const data = await podcastsCache.getItem('details');
            if (data && data[podcastId]) {
                setInfo(JSON.parse(data)[podcastId])
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
                const epiString = `${URL_PODCAST_DETAILS}?id=${podcastId}&country=US&media=podcast&entity=podcastEpisode`
                const epiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(epiString)}`
                const epiRes = await fetch(epiUrl);
                const epiData = await epiRes.json();
                const parsedEpiData = JSON.parse(epiData.contents.replace(/\\n/g));
                console.log('--epiData', JSON.parse(epiData.contents.replace(/\\n/g)))
                const episodesInfo = {
                    count: parsedEpiData?.resultCount,
                    episodes: parsedEpiData?.results?.filter(item => item.wrapperType === 'podcastEpisode')
                        .map(({ releaseDate, trackId, trackTimeMillis, trackName}) => ({
                            id: trackId,
                            date: releaseDate,
                            duration: trackTimeMillis,
                            title: trackName

                        }))
                }
                console.log('episodesInfo', episodesInfo)
                setEpiInfo(episodesInfo)
                await podcastsCache.setItem('details', JSON.stringify({ [podcastId] : JSON.parse(parsed)?.results[0]}))

            } catch (error) {
                console.error(error)
            }
           
         })()
    }, [])

    return podcastId ? <div>
        <h2>{ podcastId}</h2>
        <section>
            {
                info &&<h3>{info?.artistName}</h3>
            }
            
        </section>
    </div> : <span>Loading</span>
}

export default Podcast