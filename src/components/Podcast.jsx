import { useContext, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom"
import { URL_PODCAST_DETAILS } from "../utils/constants";
import { podcastsCache } from "../utils/cacheRef";
import './Podcast.css'
import { ActiveItemContext } from "../context/ActiveItemContext";

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

    return podcastId ? <div className="wrapper">
        {/* <h2>{ podcastId}</h2> */}
        <section className="podcast-info">
            {/* {
                info && <PodcastCard id={id} title={title} image={image} author={author} description={description} />
            } */}

        </section>
            {
                epiInfo &&
                <div className="podcast-details">
                    <section className="podcast-count">
                        <div>Episodes: <span>{epiInfo?.count}</span></div>

                    </section>
                    <section className="podcast-episodes">
                        { epiInfo.episodes?.map(item => {
                            return <div key={item.id}>{item.title}</div>
                        })}

                    </section>
                </div>
            }

    </div> : <span>Loading</span>
}

export default Podcast