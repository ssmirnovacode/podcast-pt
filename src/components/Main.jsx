import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../context/LoadingContext";
import { podcastsCache } from "../utils/cacheRef";
import { URL_TOP_100 } from "../utils/constants";
import './Main.css'
import PodcastCard from "./PodcastCard.jsx";

const Main = props => {
    const [ loading, setLoading ] = useContext(LoadingContext)

    const [ podcasts, setPodcasts ] = useState([]);
    const [ term, setTerm ] = useState('')

    useEffect(() => {
        (async () => {
            setLoading(true)
            const timeStamp = await podcastsCache.getItem('timeStamp');
            if ((Date.now() - timeStamp) > 86400000) { // 86400000 milliseconds in a day
                await podcastsCache.removeItem('podcasts');
                await podcastsCache.removeItem('details');
                await podcastsCache.removeItem('episodes');
                await podcastsCache.setItem('timeStamp', Date.now())
            }
            const podcasts = await podcastsCache.getItem('podcasts')
            if (podcasts?.length) {
                setPodcasts(podcasts); 
                setLoading(false)
                return
            }
            try {
                
                const res = await fetch(URL_TOP_100);
                const data = await res.json();
                //console.log(data?.feed?.entry[0])
                const items = data?.feed?.entry?.map(item => ({
                    id: item.id?.attributes && item.id?.attributes['im:id'],
                    title: item['im:name']?.label,
                    author: item['im:artist']?.label,
                    image: item['im:image'][2].label,
                    description: item.summary?.label
                }))
                setPodcasts(items)
                setLoading(false)
                await podcastsCache.setItem('podcasts', items)
                
                await podcastsCache.setItem('timeStamp', Date.now())
                
            } catch (error) {
                setLoading(false)
                console.error(error)
            }
        })()
    }, [])

   const itemsToRender = podcasts.filter(({ author, title }) => author.toUpperCase().includes(term.toUpperCase()) || title.toUpperCase().includes(term.toUpperCase()))
 
    return(
        <div >
            
            <div className="search-wrapper">
                <label htmlFor="search">Search</label>
                <input id="search" type="text" value={term} onChange={e => setTerm(e.target.value)} />
            </div>

            <section className="podcast-list">
                {itemsToRender.length ? itemsToRender.map(({ id, title, image, author, description}) => {
                    return <PodcastCard key={id} id={id} title={title} image={image} author={author} description={description} />
                }) : <p>No podcast found matching your search criteria</p>}
            </section>
            
        </div>
    )
}

export default Main