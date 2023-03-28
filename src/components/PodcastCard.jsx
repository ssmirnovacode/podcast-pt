import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ActiveItemContext } from '../context/ActiveItemContext';
import './PodcastCard.css'

const PodcastCard = ({ id, title, image, author, description}) => {
    const [activeItem, setActiveItem] = useContext(ActiveItemContext);
    

    return(
        <article className="podcast-list__item" onClick={() => setActiveItem({ id, title, image, author, description})} >
            <div className="podcast-list__item image">
                <Link to={`podcast/${id}`}><img alt={title} src={image} /></Link>
            </div>
            <h2>{title?.toUpperCase()}</h2>
            <p>{author?.toUpperCase()}</p>
        </article>
    )
}

export default PodcastCard;