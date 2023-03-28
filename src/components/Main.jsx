import { useContext, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ActiveItemContext } from "../context/ActiveItemContext";
import { podcastsCache } from "../utils/cacheRef";
import { URL_TOP_100 } from "../utils/constants";
import './Main.css'
import PodcastCard from "./PodcastCard";

const Main = props => {

    const [ podcasts, setPodcasts ] = useState([]);
    const [ term, setTerm ] = useState('')
    const [ activeItem, setActiveItem ] = useContext(ActiveItemContext)

    useEffect(() => {
        (async () => {
            const podcasts = await podcastsCache.getItem('podcasts')
            if (podcasts?.length) {
                setPodcasts(podcasts); //
                return
            }
            try {
                const res = await fetch(URL_TOP_100);
                const data = await res.json();
                console.log(data?.feed?.entry[0])
                const items = data?.feed?.entry?.map(item => ({
                    id: item.id?.attributes && item.id?.attributes['im:id'],
                    title: item.title.label,
                    author: item['im:artist']?.label,
                    image: item['im:image'][1].label,
                    description: item.summary?.label
                }))
                setPodcasts(items)
                await podcastsCache.setItem('podcasts', items)
            } catch (error) {
                console.error(error)
            }
        })()
    }, [])


    const handleCardClick = item => {
        console.log('item', item)
        
    }
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