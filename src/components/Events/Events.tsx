import Event from '../Event';
import './Events.css';

const eventsData = [
  {
    id: 1,
    title: 'Søndags Morgengudstjeneste',
    date: '22. Dec',
    time: '10:00',
    description: 'Deltag i vores ugentlige gudstjeneste med salmer, bønner og prædiken af Pastor Nielsen.',
    location: 'Hovedkirken',
    image: '/eventplaceholderimage1.png'
  },
  {
    id: 2,
    title: 'Juleaftens Gudstjeneste',
    date: '24. Dec',
    time: '18:00',
    description: 'Særlig juleaftens fejring med lysgudstjeneste og julesalmer.',
    location: 'Hovedkirken',
    image: '/eventplaceholderimage2.png'
  },
  {
    id: 3,
    title: 'Nytårs Bønnemøde',
    date: '31. Dec',
    time: '23:00',
    description: 'Afslut året med bøn og reflektion, mens vi byder det nye år velkommen sammen.',
    location: 'Bønnekapellet',
    image: '/eventpladeholderimage3.png'
  },
  {
    id: 4,
    title: 'Bibelstudiegruppe',
    date: '3. Jan',
    time: '19:00',
    description: 'Ugentligt bibelstudium med fokus på Johannes Evangeliet. Alle er velkomne til diskussionen.',
    location: 'Fællesskabsrummet',
    image: '/eventplaceholderimage1.png'
  },
  {
    id: 5,
    title: 'Ungdomsmøde',
    date: '5. Jan',
    time: '16:00',
    description: 'Ungdomsaktiviteter, spil og fællesskab for teenagere. Pizza og sjov garanteret!',
    location: 'Ungdomscenteret',
    image: '/eventplaceholderimage2.png'
  },
  {
    id: 6,
    title: 'Samfundstjeneste',
    date: '7. Jan',
    time: '09:00',
    description: 'Frivilligt arbejde med at hjælpe den lokale madbank og tjene vores samfund.',
    location: 'Mødes ved kirken',
    image: '/eventpladeholderimage3.png'
  }
];

const Events = () => {
  return (
    <section className="events-section">
      <div className="events-container">
        <h2 className="events-title">Kommende Begivenheder</h2>
        <div className="events-list">
          {eventsData.map((event) => (
            <Event
              key={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              description={event.description}
              location={event.location}
              image={event.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;