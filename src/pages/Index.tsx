import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import EarthquakeMap from '@/components/EarthquakeMap';

interface Earthquake {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

const USGS_API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

const Index = () => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(USGS_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch earthquake data');
        }
        
        const data = await response.json();
        setEarthquakes(data.features);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakes();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Recent Earthquake Visualizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time seismic activity from the past 24 hours
          </p>
        </header>

        {/* Legend */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Legend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: 'hsl(var(--quake-shallow))' }}></div>
                <span>Shallow (&lt;10km)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: 'hsl(var(--quake-medium))' }}></div>
                <span>Medium (10-30km)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: 'hsl(var(--quake-deep))' }}></div>
                <span>Deep (30-70km)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: 'hsl(var(--quake-very-deep))' }}></div>
                <span>Very Deep (&gt;70km)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Circle size indicates earthquake magnitude. Click markers for details.
            </p>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Loading earthquake data...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map */}
        {!loading && !error && (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Global Seismic Activity Map</CardTitle>
              <CardDescription>
                Showing {earthquakes.length} earthquakes from the past 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] w-full">
                <EarthquakeMap earthquakes={earthquakes} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>
            Data provided by the{' '}
            <a
              href="https://earthquake.usgs.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              U.S. Geological Survey (USGS)
            </a>
          </p>
          <p className="mt-1">Updated in real-time • Built for educational purposes</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
