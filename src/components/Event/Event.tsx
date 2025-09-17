import './Event.css';

interface EventProps {
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string;
}

const Event = ({ title, date, time, description, location }: EventProps) => {
  return (
    <div className="event">
      <div className="event-date-time">
        <div className="event-date">{date}</div>
        <div className="event-time">{time}</div>
      </div>
      <div className="event-details">
        <h3 className="event-title">{title}</h3>
        <p className="event-description">{description}</p>
        {location && <p className="event-location">📍 {location}</p>}
      </div>
    </div>
  );
};

export default Event;