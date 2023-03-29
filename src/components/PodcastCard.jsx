import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ActiveItemContext } from '../context/ActiveItemContext';
import { podcastsCache } from '../utils/cacheRef';
import './PodcastCard.css'

const PodcastCard = ({ id, title, image, author, description}) => {
    const [activeItem, setActiveItem] = useContext(ActiveItemContext);

    const handleCardClick = async () => {
        setActiveItem({ id, title, image, author, description})
        await podcastsCache.setItem('activeItem', JSON.stringify({ id, title, image, author, description}))
    }
    return(
        <article className="podcast-list__item" onClick={handleCardClick} >
            <div className="podcast-list__item image">
                <Link to={`podcast/${id}`}><img alt={title} src={image} /></Link>
            </div>
            <h2>{title?.toUpperCase()}</h2>
            <p>{author?.toUpperCase()}</p>
        </article>
    )
}

export default PodcastCard;