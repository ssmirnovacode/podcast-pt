
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { convertMsToTime } from '../utils/convertMilis';
import './PodcastDetails.css';

const PodcastDetails = () => {
    const { details } = useOutletContext();

    return(
        <div className="podcast-details">
            <section className="podcast-count">
                <div>Episodes: <span>{details?.count}</span></div>

            </section>
            <section className="podcast-episodes">
                { details.episodes?.map(item => {
                    return <div  key={item.id} className="table-item">
                        <div className="table-item__title"><Link to={`episode/${item.id}`}>{item.title}</Link></div>
                        <div className="table-item__date">{item.date}</div>
                        <div className="table-item__duration">{convertMsToTime(item.duration)}</div>
                    </div>
                })}

            </section>
        </div>
    )
}

export default PodcastDetails;