import './PodcastSummary.css';

const PodcastSummary = ({ activeItem: { image, title, author, description} }) => {

    return(
        <section  className="podcast-info__summary">
            <img src={image} alt={title} />
            <div>
                <h3>{title}</h3>
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