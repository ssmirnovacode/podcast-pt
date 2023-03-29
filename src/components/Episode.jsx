import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import './Episode.css';

const Episode = () => {
    const { episodeId, podcastId } = useParams();
    const { details } = useOutletContext();

    const episode = details?.episodes?.find(item => item.id == episodeId);

    return(
        <div className="episode-wrapper">
            {
                episode && 
                <>
                <h3>{episode.title}</h3>
                <p>{episode.description}</p>
                <audio controls src={episode.audio} />
                </>
            }
        </div>
    )
}

export default Episode