import { useEvents } from '../../hooks/useApi';
import Event from '../Event';
import './Events.css';

// Utility function to format date strings
const formatEventDate = (dateString: string): { date: string; time: string } => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Copenhagen'
  };

  const formattedDate = date.toLocaleDateString('da-DK', options);
  const formattedTime = date.toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Copenhagen'
  });

  return { date: formattedDate, time: formattedTime };
};

const Events = () => {
  const { data: eventsData, loading, error, refetch } = useEvents({ limit: 6 });

  if (loading) {
    return (
      <section className="events-section">
        <div className="events-container">
          <h2 className="events-title">Kommende Begivenheder</h2>
          <div className="loading-state">
            <p>Indlæser begivenheder...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="events-section">
        <div className="events-container">
          <h2 className="events-title">Kommende Begivenheder</h2>
          <div className="error-state">
            <p>Der opstod en fejl ved indlæsning af begivenheder: {error}</p>
            <button onClick={refetch} className="retry-button">
              Prøv igen
            </button>
          </div>
        </div>
      </section>
    );
  }

  const events = eventsData?.events || [];

  return (
    <section className="events-section">
      <div className="events-container">
        <h2 className="events-title">Kommende Begivenheder</h2>
        <div className="events-list">
          {events.map((event) => {
            const { date, time } = formatEventDate(event.start_date);
            return (
              <Event
                key={event.id}
                title={event.title}
                date={date}
                time={time}
                description={event.description}
                location={event.location || 'Sted ikke angivet'}
                image={event.image_url || '/eventplaceholderimage1.png'}
              />
            );
          })}
        </div>
        {events.length === 0 && (
          <div className="empty-state">
            <p>Ingen kommende begivenheder at vise i øjeblikket.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;