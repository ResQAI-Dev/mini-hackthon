import { useMapEvents } from "react-leaflet";

function LocationMap({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onLocationSelect({
        latitude: lat,
        longitude: lng,
      });
    },
  });

  return null;
}

export default LocationMap;