import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Earthquake {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
}

// Helper function to get color based on depth
const getDepthColor = (depth: number): string => {
  if (depth < 10) return '#FCD34D'; // Yellow - shallow
  if (depth < 30) return '#FB923C'; // Orange - medium
  if (depth < 70) return '#22D3EE'; // Blue - deep
  return '#3B82F6'; // Dark blue - very deep
};

// Helper function to get radius based on magnitude
const getMagnitudeRadius = (magnitude: number): number => {
  return Math.max(magnitude * 2.5, 3);
};

// Helper function to format timestamp
const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EarthquakeMap = ({ earthquakes }: EarthquakeMapProps) => {
  const mapCenter: LatLngExpression = [20, 0];

  return (
    <MapContainer
      center={mapCenter}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {earthquakes.map((quake) => {
        const [lng, lat, depth] = quake.geometry.coordinates;
        const { mag, place, time } = quake.properties;
        const position: LatLngExpression = [lat, lng];
        
        return (
          <CircleMarker
            key={quake.id}
            center={position}
            pathOptions={{
              fillColor: getDepthColor(depth),
              color: '#fff',
              weight: 1,
              opacity: 0.8,
              fillOpacity: 0.6,
            }}
            radius={getMagnitudeRadius(mag)}
          >
            <Popup>
              <div style={{ padding: '4px' }}>
                <h3 style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                  {place}
                </h3>
                <p style={{ fontSize: '12px', margin: '4px 0' }}>
                  <strong>Magnitude:</strong> {mag.toFixed(1)}
                </p>
                <p style={{ fontSize: '12px', margin: '4px 0' }}>
                  <strong>Depth:</strong> {depth.toFixed(1)} km
                </p>
                <p style={{ fontSize: '12px', margin: '4px 0' }}>
                  <strong>Time:</strong> {formatTime(time)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default EarthquakeMap;
