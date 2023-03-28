import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { podcastsCache } from "../utils/cacheRef";
import { URL_TOP_100 } from "../utils/constants";

const Main = props => {

    const [ podcasts, setPodcasts ] = useState([]);
console.log(podcasts[0])
    useEffect(() => {
        (async () => {
            const podcasts = await podcastsCache.getItem('podcasts')
            if (podcasts?.length) {
                setPodcasts(podcasts);
                return
            }
            try {
                const res = await fetch(URL_TOP_100);
                const data = await res.json();
                console.log(data)
                setPodcasts(data?.feed?.entry)
                await podcastsCache.setItem('podcasts', data?.feed?.entry)
            } catch (error) {
                console.error(error)
            }
            
           
           
        })()
    }, [])

    return(
        <div>
            <h1>Main</h1>
            <nav>
        <Link to="podcast/123">Podcast 123</Link>
        <Link to="podcast/123/episode/456">podcast 123 - episode 456</Link>
      </nav>

      <section>
        {podcasts.length && podcasts.map(item => {
            return(
                <article key={item.id?.attributes['im:id']}>
                    
                    <Link to={`podcast/${item.id.attributes['im:id']}`}><h3>{item.title.label}</h3></Link>
                </article>
            )
        })}
      </section>
            
        </div>
    )
}

export default Main