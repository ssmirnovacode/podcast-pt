import { Link } from 'react-router-dom';
import './PodcastCard.css'

const PodcastCard = ({ id, title, image, author}) => {


    return(
        <article className="podcast-list__item" >
            <div className="podcast-list__item image">
                <Link to={`podcast/${id}`}><img alt={title} src={image} /></Link>
            </div>
            <h2>{title?.toUpperCase()}</h2>
            <p>{author?.toUpperCase()}</p>
        </article>
    )
}

export default PodcastCard;