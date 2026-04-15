"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

function ResizeFix() {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then(({ useMap }) => {
      // will be called inside map context
    });
  }, []);

  useEffect(() => {
    if (!map) return;
    const t = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(t);
  }, [map]);

  return null;
}

const MapResizer = dynamic(
  async () => {
    const { useMap } = await import("react-leaflet");
    return function Resizer() {
      const map = useMap();
      useEffect(() => {
        const t = setTimeout(() => {
          map.invalidateSize();
        }, 300);
        return () => clearTimeout(t);
      }, [map]);
      return null;
    };
  },
  { ssr: false }
);

interface MapProps {
  origin: string;
  destination: string;
  pct: number;
  color: string;
  vehicle: string;
}

interface Coord { lat: number; lng: number; }

async function geocode(place: string): Promise<Coord | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    return null;
  } catch { return null; }
}

export default function TrackingMap({ origin, destination, pct, color, vehicle }: MapProps) {
  const [coords, setCoords] = useState<{ origin: Coord; dest: Coord } | null>(null);

  useEffect(() => {
    async function load() {
      const [o, d] = await Promise.all([geocode(origin), geocode(destination)]);
      if (o && d) setCoords({ origin: o, dest: d });
    }
    if (origin && destination) load();
  }, [origin, destination]);

  if (!coords) return (
    <div style={{ width: "100%", height: 370, background: "#111827", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 13 }}>
      🗺️ Loading map...
    </div>
  );

  const progress = Math.max(0, Math.min(100, pct)) / 100;
  const currentLat = coords.origin.lat + (coords.dest.lat - coords.origin.lat) * progress;
  const currentLng = coords.origin.lng + (coords.dest.lng - coords.origin.lng) * progress;

  const center: [number, number] = [
    (coords.origin.lat + coords.dest.lat) / 2,
    (coords.origin.lng + coords.dest.lng) / 2,
  ];

  return (
    <div style={{ width: "100%", height: 370, borderRadius: 20, overflow: "hidden", background: "#111827" }}>
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Full route dashed */}
        <Polyline
          positions={[[coords.origin.lat, coords.origin.lng], [coords.dest.lat, coords.dest.lng]]}
          pathOptions={{ color: "#333", weight: 2, dashArray: "8, 8" }}
        />

        {/* Progress line */}
        <Polyline
          positions={[[coords.origin.lat, coords.origin.lng], [currentLat, currentLng]]}
          pathOptions={{ color, weight: 4, opacity: 1 }}
        />

        {/* Origin dot */}
        <CircleMarker
          center={[coords.origin.lat, coords.origin.lng]}
          radius={8}
          pathOptions={{ color: "#f97316", fillColor: "#f97316", fillOpacity: 1 }}
        >
          <Popup>📍 {origin}</Popup>
        </CircleMarker>

        {/* Destination dot */}
        <CircleMarker
          center={[coords.dest.lat, coords.dest.lng]}
          radius={8}
          pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 1 }}
        >
          <Popup>🏁 {destination}</Popup>
        </CircleMarker>

        {/* Vehicle position */}
        <CircleMarker
          center={[currentLat, currentLng]}
          radius={12}
          pathOptions={{ color, fillColor: color, fillOpacity: 0.3, weight: 2 }}
        >
          <Popup>{vehicle} {pct}% complete</Popup>
        </CircleMarker>

        <MapResizer />
      </MapContainer>
    </div>
  );
}