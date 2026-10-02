import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, onAddressFound }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng, onAddressFound);
    }
  });
  return position ? <Marker position={position} /> : null;
}

async function fetchAddress(lat, lng, onAddressFound) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await res.json();
    const a = data.address;
    onAddressFound({
      street: `${a.road || a.neighbourhood || ''} ${a.suburb || ''}`.trim(),
      city: a.city || a.town || a.village || '',
      state: a.state || '',
      zip: a.postcode || '',
    });
  } catch { }
}

export default function MapPicker({ onAddressFound }) {
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]); // India center

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #f0f0f0' }}>
      <p style={{ padding: '10px 14px', margin: 0, fontSize: '13px', color: '#888', background: '#f9f9f9' }}>
        📍 Map pe click karo apna address select karne ke liye
      </p>
      <MapContainer center={userLocation} zoom={13} style={{ height: '300px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker position={position} setPosition={setPosition} onAddressFound={onAddressFound} />
      </MapContainer>
    </div>
  );
}
