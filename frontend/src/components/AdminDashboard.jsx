import { useEffect, useState } from 'react';
import { CSVReader } from 'react-papaparse';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function AdminDashboard() {
  const [location, setLocation] = useState('Location A');
  const [queue, setQueue] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const fetchQueue = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/queue/${location}`);
    const data = await res.json();
    setQueue(data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`${import.meta.env.VITE_API_URL}/api/queue/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    fetchQueue();
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    // Optionally POST to backend to track paused state
  };

  const handleDrop = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(queue);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const token = localStorage.getItem('token');
    await fetch(`${import.meta.env.VITE_API_URL}/api/queue/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ queue: reordered.map((dog, index) => ({ id: dog.id, position: index + 1 })) })
    });
    fetchQueue();
  };

  const handleCSVUpload = async (data) => {
    const token = localStorage.getItem('token');
    const payload = data.map(row => row.data);
    await fetch(`${import.meta.env.VITE_API_URL}/api/queue/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ entries: payload })
    });
    fetchQueue();
  };

  useEffect(() => {
    fetchQueue();
  }, [location]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard - {location}</h2>
      <select onChange={(e) => setLocation(e.target.value)} value={location}>
        <option value="Location A">Location A</option>
        <option value="Location B">Location B</option>
      </select>

      <button onClick={handlePauseToggle} style={{ marginTop: '1rem' }}>
        {isPaused ? 'Resume Queue' : 'Pause Queue'}
      </button>

      <CSVReader onUploadAccepted={handleCSVUpload}>
        {({ getRootProps, acceptedFile }) => (
          <div {...getRootProps()} style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <button>Import CSV</button>
            {acceptedFile && <p>{acceptedFile.name}</p>}
          </div>
        )}
      </CSVReader>

      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="queue">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {queue.map((dog, index) => (
                <Draggable key={dog.id} draggableId={String(dog.id)} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {dog.position}. {dog.dog_name} ({dog.handler_name}) - {dog.status}
                      <button onClick={() => updateStatus(dog.id, 'on course')}>On Course</button>
                      <button onClick={() => updateStatus(dog.id, 'done')}>Done</button>
                      <button onClick={() => updateStatus(dog.id, 'skipped')}>Skip</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default AdminDashboard;
