
import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/mentor';

const MentorAvailability = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSlot, setNewSlot] = useState({ date: '', start: '', end: '' });

  // Fetch slots from backend
  useEffect(() => {
    fetch(`${API_BASE}/availability`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setSlots(data.availability || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load slots');
        setLoading(false);
      });
  }, []);

  // Add new slot
  const handleAddSlot = async () => {
    setError('');
    if (!newSlot.date || !newSlot.start || !newSlot.end) {
      setError('All fields required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/availability`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDateTime: `${newSlot.date}T${newSlot.start}`,
          endDateTime: `${newSlot.date}T${newSlot.end}`,
          title: 'Mentorship Slot',
          description: '',
        })
      });
      if (!res.ok) throw new Error('Failed to add slot');
      const slot = await res.json();
      setSlots([...slots, slot]);
      setNewSlot({ date: '', start: '', end: '' });
    } catch {
      setError('Failed to add slot');
    }
  };

  return (
    <div style={{ background: '#181028', minHeight: '100vh', padding: 40 }}>
      <h2 style={{ color: '#fff', marginBottom: 24 }}>Manage Availability</h2>
      <div style={{ background: '#232042', borderRadius: 16, padding: 24, marginBottom: 32, maxWidth: 420 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff', marginRight: 8 }}>Date:</label>
          <input type="date" value={newSlot.date} onChange={e => setNewSlot({ ...newSlot, date: e.target.value })} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff', marginRight: 8 }}>Start Time:</label>
          <input type="time" value={newSlot.start} onChange={e => setNewSlot({ ...newSlot, start: e.target.value })} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff', marginRight: 8 }}>End Time:</label>
          <input type="time" value={newSlot.end} onChange={e => setNewSlot({ ...newSlot, end: e.target.value })} />
        </div>
        <button onClick={handleAddSlot} style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #F472B6 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Add Slot</button>
        {error && <div style={{ color: '#F472B6', marginTop: 10 }}>{error}</div>}
      </div>
      <h3 style={{ color: '#fff', marginBottom: 16 }}>Your Slots</h3>
      {loading ? <div style={{ color: '#fff' }}>Loading...</div> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {slots.length === 0 && <div style={{ color: '#fff' }}>No slots available.</div>}
          {slots.map((slot, idx) => (
            <div key={slot._id || idx} style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #F472B6 100%)', borderRadius: 16, padding: 20, minWidth: 260, color: '#fff', boxShadow: '0 2px 12px #0002', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ fontWeight: 'bold', fontSize: 18, color: '#fff', marginBottom: 8 }}>{slot.title || 'Mentorship Slot'}</div>
              <div style={{ fontSize: 15, marginBottom: 4 }}>Date: {new Date(slot.startDateTime).toLocaleDateString()}</div>
              <div style={{ fontSize: 15, marginBottom: 4 }}>Time: {new Date(slot.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>Status: {slot.isActive ? 'Active' : 'Inactive'}</div>
              <button
                onClick={async () => {
                  if (!window.confirm('Delete this slot?')) return;
                  try {
                    await fetch(`${API_BASE}/availability/${slot._id}`, {
                      method: 'DELETE',
                      credentials: 'include',
                      headers: { 'Content-Type': 'application/json' },
                    });
                    setSlots(slots.filter((s) => s._id !== slot._id));
                  } catch {
                    alert('Failed to delete slot');
                  }
                }}
                style={{ position: 'absolute', top: 12, right: 12, background: '#F472B6', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer' }}
              >Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorAvailability;
