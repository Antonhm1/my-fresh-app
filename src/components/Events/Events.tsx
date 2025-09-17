import Event from '../Event';
import './Events.css';

const eventsData = [
  {
    id: 1,
    title: 'Sunday Morning Service',
    date: 'Dec 22',
    time: '10:00 AM',
    description: 'Join us for our weekly worship service with hymns, prayers, and a message from Pastor Nielsen.',
    location: 'Main Sanctuary'
  },
  {
    id: 2,
    title: 'Christmas Eve Service',
    date: 'Dec 24',
    time: '6:00 PM',
    description: 'Special Christmas Eve celebration with candlelight service and Christmas carols.',
    location: 'Main Sanctuary'
  },
  {
    id: 3,
    title: 'New Year Prayer Meeting',
    date: 'Dec 31',
    time: '11:00 PM',
    description: 'End the year with prayer and reflection as we welcome the new year together.',
    location: 'Prayer Chapel'
  },
  {
    id: 4,
    title: 'Bible Study Group',
    date: 'Jan 3',
    time: '7:00 PM',
    description: 'Weekly Bible study focusing on the Gospel of John. All are welcome to join our discussion.',
    location: 'Community Room'
  },
  {
    id: 5,
    title: 'Youth Group Meeting',
    date: 'Jan 5',
    time: '4:00 PM',
    description: 'Youth activities, games, and fellowship for teenagers. Pizza and fun guaranteed!',
    location: 'Youth Center'
  },
  {
    id: 6,
    title: 'Community Outreach',
    date: 'Jan 7',
    time: '9:00 AM',
    description: 'Volunteer opportunity to help at the local food bank and serve our community.',
    location: 'Meeting at Church'
  }
];

const Events = () => {
  return (
    <section className="events-section">
      <div className="events-container">
        <h2 className="events-title">Upcoming Events</h2>
        <div className="events-list">
          {eventsData.map((event) => (
            <Event
              key={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              description={event.description}
              location={event.location}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;