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
  if (depth < 10) return 'hsl(var(--quake-shallow))'; // Yellow - shallow
  if (depth < 30) return 'hsl(var(--quake-medium))'; // Orange - medium
  if (depth < 70) return 'hsl(var(--quake-deep))'; // Blue - deep
  return 'hsl(var(--quake-very-deep))'; // Dark blue - very deep
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
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">{place}</h3>
                  <p className="text-xs text-muted-foreground">
                    <strong>Magnitude:</strong> {mag.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Depth:</strong> {depth.toFixed(1)} km
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Time:</strong> {formatTime(time)}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EarthquakeMap;
