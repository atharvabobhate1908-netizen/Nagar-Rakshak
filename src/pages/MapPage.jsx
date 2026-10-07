import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../supabase';

// Fix for default Leaflet marker icons not loading in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a high-priority red marker for hazards
const hazardIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapPage() {
  const [hazards, setHazards] = useState([]);

  useEffect(() => {
    fetchHazards();
  }, []);

  const fetchHazards = async () => {
    // Fetch reports that are approved or active (ignores capitalization issues)
    const { data, error } = await supabase
      .from('reports')
      .select('*');
    
    if (error) {
      console.error('Error fetching map data:', error);
      return;
    }

    // Filter in-memory to catch 'approved', 'Approved', or anything that isn't pending/rejected
    const activeHazards = (data || []).filter(r => {
      const status = (r.status || '').toLowerCase();
      return status === 'approved' || status === 'active';
    });

    setHazards(activeHazards);
  };

  // Centered roughly on Sion/Mumbai 
  const defaultCenter = [19.0390, 72.8619];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* MAGIC CSS TRICK TO TURN FREE MAPS INTO DARK MODE */}
      <style>{`
        .map-tiles-dark {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '32px', marginBottom: '10px', fontWeight: 'bold' }}>Tactical Intelligence Grid</h1>
        <p style={{ color: '#94a3b8' }}>Live visualization of verified municipal threats awaiting contractor dispatch.</p>
      </div>
      
      <div style={{ height: '70vh', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <MapContainer center={defaultCenter} zoom={14} style={{ height: '100%', width: '100%', backgroundColor: '#020617' }}>
          
          {/* STANDARD OSM WITH DARK MODE FILTER APPLIED */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            className="map-tiles-dark"
          />
          
          {hazards.map((hazard) => (
            <Marker key={hazard.id} position={[hazard.latitude, hazard.longitude]} icon={hazardIcon}>
              <Popup>
                <div style={{ padding: '5px', minWidth: '150px' }}>
                  <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', paddingBottom: '5px', marginBottom: '8px' }}>
                    {hazard.category.replace('_', ' ')}
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#374151', lineHeight: '1.4' }}>
                    {hazard.description}
                  </p>
                  <div style={{ fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace' }}>
                    ID: {hazard.id.substring(0,8)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
