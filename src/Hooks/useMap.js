import { useLoadScript } from "@react-google-maps/api";
import { useCallback, useRef } from "react";

export default function useMap() {
  const mapRef = useRef();
  const [isLoaded, loadError] = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  return { isLoaded, loadError, onMapLoad, mapRef };
}
