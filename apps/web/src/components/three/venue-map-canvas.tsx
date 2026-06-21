"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

const DESTINATIONS = [
  { city: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { city: "Udaipur", lat: 24.5854, lng: 73.7125 },
  { city: "Mumbai", lat: 19.076, lng: 72.8777 },
  { city: "Goa", lat: 15.2993, lng: 74.124 },
  { city: "Pune", lat: 18.5204, lng: 73.8567 },
] as const;

const MAP_CENTER: [number, number] = [20.15, 73.85];
const MAP_ZOOM = 6;

function markerHtml(city: string, active: boolean) {
  return `
    <button type="button" class="destination-map-pin${active ? " is-active" : ""}" aria-label="Filter venues in ${city}" aria-pressed="${active}">
      <span class="destination-map-pin__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </span>
      <span class="destination-map-pin__label">${city}</span>
    </button>
  `;
}

type VenueMapCanvasProps = {
  activeCity?: string;
  onSelect?: (city: string) => void;
  className?: string;
};

/** Real satellite destination map — Esri World Imagery via Leaflet. */
export function VenueMapCanvas({ activeCity, onSelect, className }: VenueMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: true,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            '&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>, Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      ).addTo(map);

      const markers = DESTINATIONS.map(({ city, lat, lng }) => {
        const icon = L.divIcon({
          className: "destination-map-marker",
          html: markerHtml(city, activeCity === city),
          iconSize: [88, 56],
          iconAnchor: [44, 28],
        });

        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.on("click", () => onSelectRef.current?.(city));
        return marker;
      });

      mapRef.current = map;
      markersRef.current = markers;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

  useEffect(() => {
    void import("leaflet").then((L) => {
      markersRef.current.forEach((marker, i) => {
        const city = DESTINATIONS[i]?.city;
        if (!city) return;
        const icon = L.divIcon({
          className: "destination-map-marker",
          html: markerHtml(city, activeCity === city),
          iconSize: [88, 56],
          iconAnchor: [44, 28],
        });
        marker.setIcon(icon);
      });
    });
  }, [activeCity]);

  return (
    <div
      className={cn(
        "destination-map-shell relative overflow-hidden rounded-[var(--v4-radius-xl)] border border-[var(--glitz-border)] shadow-[var(--shadow-md)]",
        className
      )}
      role="region"
      aria-label="Satellite map of Nexyyra destination cities across India"
    >
      <div ref={containerRef} className="destination-map-canvas z-0 min-h-[360px] w-full md:min-h-[420px]" />
    </div>
  );
}
