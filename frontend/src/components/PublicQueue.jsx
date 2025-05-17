import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PublicQueue.css';

function PublicQueue() {
  const { locationId = 'Location A' } = useParams();
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/queue/${locationId}`)
      .then(res => res.json())
      .then(data => setQueue(data));
  }, [locationId]);

  const current = queue.find(q => q.status === 'on course');
  const upcoming = queue.filter(q => q.status === 'waiting').slice(0, 5);

  return (
    <div className="public-queue">
      <h1>{locationId} - Scentwork Queue</h1>

      <section className="highlight">
        <h2>Current Dog</h2>
        {current ? (
          <p className="on-course">{current.dog_name} ({current.handler_name})</p>
        ) : (
          <p>No dog currently on course</p>
        )}
      </section>

      <section>
        <h2>Next Up</h2>
        <ul>
          {upcoming.map(dog => (
            <li key={dog.id} className="upcoming">
              {dog.dog_name} ({dog.handler_name})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Full Waitlist</h2>
        <ul>
          {queue.map(dog => (
            <li key={dog.id} className={`status-${dog.status.replace(' ', '-')}`}>
              {dog.position}. {dog.dog_name} ({dog.handler_name}) - {dog.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default PublicQueue;
