import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [shipments, setShipments] = useState([]);
  const [formData, setFormData] = useState({ trackingId: '', source: '', destination: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ status: '', location: '' });

  const API_URL = 'http://localhost:5000/shipments';

  const fetchShipments = async () => {
    try {
      const res = await axios.get(API_URL);
      setShipments(res.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const addShipment = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        location: formData.source 
      };
      
      await axios.post(API_URL, payload);
      setFormData({ trackingId: '', source: '', destination: '' });
      fetchShipments();
    } catch (err) { alert("Error: Duplicate ID or Missing Fields"); }
  };

  const startEdit = (shipment) => {
    setEditingId(shipment._id);
    setEditData({ status: shipment.status, location: shipment.location });
  };

  const saveEdit = async (id) => {
    await axios.put(`${API_URL}/${id}`, editData);
    setEditingId(null);
    fetchShipments();
  };

  const deleteShipment = async (id) => {
    if (window.confirm("Delete this shipment?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchShipments();
    }
  };

  useEffect(() => { fetchShipments(); }, []);

  return (
    <div style={styles.appContainer}>
      <aside style={styles.leftPanel}>
        <header style={styles.header}>
          <h1 style={styles.title}>RouteMaster</h1>
          <p style={styles.subtitle}>Logistics Engine</p>
        </header>

        <section style={styles.formSection}>
          <h3 style={styles.sectionTitle}>Register New Shipment</h3>
          <form onSubmit={addShipment} style={styles.formStack}>
            <input 
              placeholder="Tracking ID (e.g. RT-101)" 
              value={formData.trackingId} 
              onChange={e => setFormData({...formData, trackingId: e.target.value})} 
              style={styles.input} 
            />
            <input 
              placeholder="Source City" 
              value={formData.source} 
              onChange={e => setFormData({...formData, source: e.target.value})} 
              style={styles.input} 
            />
            <input 
              placeholder="Destination City" 
              value={formData.destination} 
              onChange={e => setFormData({...formData, destination: e.target.value})} 
              style={styles.input} 
            />
            <button type="submit" style={styles.btnPrimary}>Register Shipment</button>
            <p style={styles.hint}>* Initial location will be set to Source.</p>
          </form>
        </section>
      </aside>
      <main style={styles.rightPanel}>
        <div style={styles.feedHeader}>
          <h3>Live Tracking Feed</h3>
          <span style={styles.countBadge}>{shipments.length} Active</span>
        </div>
        
        <div style={styles.scrollArea}>
          {shipments.map(s => (
            <div key={s._id} style={styles.card}>
              {editingId === s._id ? (
                <div style={styles.editStack}>
                  <label style={styles.label}>Update Status:</label>
                  <select value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})} style={styles.input}>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <label style={styles.label}>Current Location:</label>
                  <input value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} style={styles.input} />
                  <div style={styles.actions}>
                    <button onClick={() => saveEdit(s._id)} style={styles.btnSave}>Save Changes</button>
                    <button onClick={() => setEditingId(null)} style={styles.btnCancel}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={styles.cardHeader}>
                    <span style={styles.trackId}>{s.trackingId}</span>
                    <span style={getStatusStyle(s.status)}>{s.status}</span>
                  </div>
                  <p style={styles.route}><strong>{s.source}</strong> ➔ <strong>{s.destination}</strong></p>
                  <p style={styles.location}>📍 Current: {s.location}</p>
                  <div style={styles.actions}>
                    <button onClick={() => startEdit(s)} style={styles.btnEdit}>Update Status</button>
                    <button onClick={() => deleteShipment(s._id)} style={styles.btnDelete}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {shipments.length === 0 && <p style={styles.emptyMsg}>Waiting for registrations...</p>}
        </div>
      </main>
    </div>
  );
}

const styles = {
  appContainer: { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#1a1a1a', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' },
  leftPanel: { width: '380px', padding: '40px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', backgroundColor: '#121212' },
  rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', padding: '40px' },
  header: { marginBottom: '40px' },
  title: { color: '#3498db', margin: 0, fontSize: '2.2rem' },
  subtitle: { color: '#777', margin: '5px 0', fontSize: '1.1rem' },
  formSection: { marginTop: '20px' },
  sectionTitle: { marginBottom: '20px', fontSize: '1rem', color: '#ccc' },
  formStack: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff' },
  btnPrimary: { padding: '14px', backgroundColor: '#004a99', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontWeight: 'bold' },
  hint: { fontSize: '0.75rem', color: '#555', marginTop: '5px' },
  feedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  countBadge: { backgroundColor: '#333', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' },
  scrollArea: { flex: 1, overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { padding: '20px', borderRadius: '10px', backgroundColor: '#252525', border: '1px solid #333' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  trackId: { fontWeight: 'bold', fontSize: '1.2rem', color: '#3498db' },
  route: { margin: '10px 0', color: '#bbb' },
  location: { color: '#777', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '10px', marginTop: '20px' },
  btnEdit: { flex: 1, padding: '8px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnDelete: { padding: '8px 12px', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer' },
  label: { fontSize: '0.8rem', color: '#777', marginBottom: '-5px' },
  btnSave: { flex: 1, padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnCancel: { padding: '10px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  editStack: { display: 'flex', flexDirection: 'column', gap: '10px' },
  emptyMsg: { color: '#444', textAlign: 'center', marginTop: '50px' }
};

const getStatusStyle = (status) => ({
  fontSize: '10px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px',
  backgroundColor: status === 'Delivered' ? '#1b5e20' : status === 'Out for Delivery' ? '#0d47a1' : '#e65100',
  color: '#fff'
});

export default App;