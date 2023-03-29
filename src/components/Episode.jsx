import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";


const Episode = () => {
    const { episodeId, podcastId } = useParams();
    const { details } = useOutletContext();

    useEffect(() => {
        console.log(episodeId, podcastId)
        console.log('epi', details?.episodes?.find(item => item.id == episodeId))
    }, [])

    const episode = details?.episodes?.find(item => item.id == episodeId);

    return(
        <div>
            <h2>{episodeId}</h2>
            {
                episode && 
                <>
                <h3>{episode.title}</h3>
                <p>{episode.description}</p>
                </>
            }
        </div>
    )
}

export default Episode