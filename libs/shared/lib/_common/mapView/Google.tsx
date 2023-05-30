"use client";
import { isMobile } from "react-device-detect";
import GoogleMapReact from "google-map-react";

export interface GoogleProps {
  mapId: string;
  mapKey: string;
  children: any;
}
export default function Google({ mapId, mapKey, children }: GoogleProps) {
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: mapKey }}
      defaultCenter={{ lat: 30.798364, lng: 169.237199 }}
      defaultZoom={isMobile ? 1 : 3}
      resetBoundsOnResize={true}
      options={{ mapId, minZoom: isMobile ? 1 : 3 }}
    >
      {children}
    </GoogleMapReact>
  );
}
