import { Link } from 'react-router-dom';
import './PodcastSummary.css';

const PodcastSummary = ({ activeItem: { id, image, title, author, description} }) => {

    return(
        <section  className="podcast-info__summary">
            <Link to={`${id}`}><img src={image} alt={title} /></Link>
            <div>
                <h3><Link to={`${id}`}>{title}</Link></h3>
                <div>by <span>{author}</span></div>
            </div>
            <div>
                <p>Description:</p>
                <p>{description}</p>
            </div>
            
        </section>
    )
}

export default PodcastSummary;