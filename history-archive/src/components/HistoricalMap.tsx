"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Battle } from "@/types";
import Link from "next/link";

// Fix default marker icons in Next
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  year: number;
  battles: Battle[];
}

export default function HistoricalMap({ year, battles }: Props) {
  const relevant = battles.filter((b) => Math.abs(b.year - year) <= 30);

  return (
    <div className="h-[500px] rounded-2xl overflow-hidden border border-[rgba(201,162,39,0.25)]">
      <MapContainer
        center={[33, 44]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {relevant.map(
          (b) =>
            b.coordinates && (
              <Marker key={b.id} position={b.coordinates} icon={icon}>
                <Popup>
                  <div className="text-sm" dir="rtl">
                    <strong>{b.name}</strong>
                    <br />
                    {b.date}
                    <br />
                    <Link href={`/battles/${b.slug}`} className="text-amber-700 underline">
                      التفاصيل
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}
