"use client";
import { useEffect, useRef } from "react";

interface MapProps {
  origin: string;
  destination: string;
  pct: number;
  color: string;
  vehicle: string;
}

export default function TrackingMap({ origin, destination, pct, color, vehicle }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

      async function geocode(place: string) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        return null;
      }

      async function buildMap() {
        const originCoord = await geocode(origin);
        const destCoord = await geocode(destination);
        if (!originCoord || !destCoord) return;

        const originIcon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#f97316;border:2px solid white;box-shadow:0 0 10px rgba(249,115,22,0.8)"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7], className: ""
        });

        const destIcon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid white;box-shadow:0 0 10px rgba(34,197,94,0.8)"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7], className: ""
        });

        L.marker([originCoord.lat, originCoord.lng], { icon: originIcon })
          .addTo(map).bindPopup(`<b>📍 Origin</b><br>${origin}`);

        L.marker([destCoord.lat, destCoord.lng], { icon: destIcon })
          .addTo(map).bindPopup(`<b>🏁 Destination</b><br>${destination}`);

        L.polyline(
          [[originCoord.lat, originCoord.lng], [destCoord.lat, destCoord.lng]],
          { color: "#333", weight: 2, dashArray: "8, 8" }
        ).addTo(map);

        const vehicleLat = originCoord.lat + (destCoord.lat - originCoord.lat) * (pct / 100);
        const vehicleLng = originCoord.lng + (destCoord.lng - originCoord.lng) * (pct / 100);

        L.polyline(
          [[originCoord.lat, originCoord.lng], [vehicleLat, vehicleLng]],
          { color: color, weight: 3, opacity: 1 }
        ).addTo(map);

        const vehicleIcon = L.divIcon({
          html: `<div style="font-size:22px;filter:drop-shadow(0 0 6px ${color});">${vehicle}</div>`,
          iconSize: [28, 28], iconAnchor: [14, 14], className: ""
        });

        L.marker([vehicleLat, vehicleLng], { icon: vehicleIcon })
          .addTo(map).bindPopup(`<b>${vehicle} Package</b><br>${pct}% complete`);

        const bounds = L.latLngBounds(
          [originCoord.lat, originCoord.lng],
          [destCoord.lat, destCoord.lng]
        );
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      buildMap();
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [origin, destination, pct, color, vehicle]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: 300, background: "#1a1a1a" }} />
  );
}