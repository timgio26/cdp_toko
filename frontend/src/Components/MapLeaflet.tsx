import { MapContainer, TileLayer,useMapEvents,Marker} from "react-leaflet";

type MapLeafletProps = {
  lat:number|undefined|null;
  lon:number|undefined|null;
  setLat:React.Dispatch<React.SetStateAction<number|undefined | null>>;
  setLon:React.Dispatch<React.SetStateAction<number|undefined | null>>;
}

export function MapLeaflet({lat,lon,setLat,setLon}:MapLeafletProps) {
  function MapClick() {
    useMapEvents({
      click: (e) => {
        setLat(e.latlng.lat)
        setLon(e.latlng.lng)
        // handleMap({lat:e.latlng.lat,lng:e.latlng.lng})
      },
    },);
    return null;
  }

  function removePinPoint(){
    setLat(null)
    setLon(null)
  }

  return (
    <div className="h-40 w-full mt-4 mb-4 rounded-md overflow-clip shadow">
      <MapContainer
        className="h-full w-full z-0"
        center={lat&&lon?[lat,lon]:[-6.9175, 107.6191]}
        zoom={13}
        minZoom={13}
        doubleClickZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {lat&&lon&&
        
        <Marker position={[lat,lon]} eventHandlers={{click:removePinPoint}}/>
        }
        <MapClick/>
      </MapContainer>
    </div>
  );
}
