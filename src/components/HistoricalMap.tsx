import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function HistoricalMap() {
  return (
    <MapContainer center={[25.276987, 55.296249]} zoom={6} className="h-[500px] rounded-3xl border border-amber-400/30">
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[25.276987, 55.296249]}>
        <Popup>
          بغداد • 1258<br />
          <span className="text-amber-400">سقوط بغداد</span>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
