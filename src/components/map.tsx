import React, { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, {
  Marker,
  Popup,
  ViewState,
  FlyToInterpolator,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
import { HousesQuery_houses } from "src/generated/HousesQuery";
import { SearchBox } from "./searchBox";

interface IProps {
  setDataBounds: (bounds: string) => void;
  houses: HousesQuery_houses[];
  highlightedId: string | null;
}

export default function Map({ setDataBounds, houses, highlightedId }: IProps) {
  const [selected, setSelected] = useState<HousesQuery_houses | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useLocalState<ViewState>("viewport", {
    latitude: 60.1699,
    longitude: 24.9384,
    zoom: 10,
  });

  return (
    <div className="text-black relative h-full sm:h-full">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={5}
        maxZoom={15}
        transitionInterpolator={new FlyToInterpolator()}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        onLoad={() => {
          if (mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
        onInteractionStateChange={(extra) => {
          if (!extra.isDragging && mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
      >
        <div className="absolute top-0 sm:top-12 left-0 p-4">
          <NavigationControl showCompass={false} />
        </div>
        <div className="search-box absolute sm:top-0 w-full z-10 p-4">
          <SearchBox
            defaultValue=""
            onSelectAddress={(_address, latitude, longitude) => {
              if (latitude && longitude) {
                setViewport((old) => ({
                  ...old,
                  latitude,
                  longitude,
                  zoom: 10,
                }));
                if (mapRef.current) {
                  const bounds = mapRef.current.getMap().getBounds();
                  setDataBounds(JSON.stringify(bounds.toArray()));
                }
              }
            }}
          />
        </div>
        {houses.map((house) => (
          <Marker
            key={house.id}
            latitude={house.latitude}
            longitude={house.longitude}
            offsetLeft={-15}
            offsetTop={0}
            className={highlightedId === house.id ? "marker-active" : ""}
          >
            <button
              style={{ width: "30px", height: "30px", fontSize: "30px" }}
              type="button"
              onClick={() => {
                setSelected(house);
                if (house.latitude && house.longitude) {
                  setViewport((old) => ({
                    ...old,
                    latitude: house.latitude,
                    longitude: house.longitude,
                    zoom: 12,
                    transitionDuration: "auto",
                    transitionInterpolator: new FlyToInterpolator({
                      speed: 1.2,
                    }),
                  }));
                  if (mapRef.current) {
                    const bounds = mapRef.current.getMap().getBounds();
                    setDataBounds(JSON.stringify(bounds.toArray()));
                  }
                }
              }}
            >
              <img
                src={
                  highlightedId === house.id
                    ? "/home-color.svg"
                    : "/home-solid.svg"
                }
                alt="house"
                className="w-8"
              />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            dynamicPosition={false}
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-center ">
              <h3 className="px-2 text-xs">
                {selected.address.substr(0, 25)}...
              </h3>
              <div className="relative">
                <Image
                  className="mx-auto my-2"
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  publicId={selected.publicId}
                  secure
                  dpr="auto"
                  quality="auto"
                  width={200}
                  height={Math.floor((9 / 16) * 200)}
                  crop="fill"
                  gravity="auto"
                />
                <div className="text-xs absolute bottom-0 right-0 bg-white px-2 py-1">
                  <span>{selected.price.toLocaleString()} €</span>
                </div>
                <div className="text-xs absolute bottom-0 left-0 bg-white px-2 py-1">
                  <span>{selected.space}.00 m²</span>
                </div>
              </div>
              <Link href={`/houses/${selected.id}`}>
                <a className=" hover:text-red-400 font-bold">View House</a>
              </Link>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
