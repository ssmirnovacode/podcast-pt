import { useEffect } from "react";
import { useParams } from "react-router-dom";


const Episode = () => {
    const { episodeId, podcastId } = useParams();

    useEffect(() => {
        (async() => {
           
            console.log(episodeId, podcastId)
        })()
    }, [])

    return(
        <div>episode</div>
    )
}

export default Episode