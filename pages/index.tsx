import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
import HouseList from "src/components/houseList";
import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
import { HousesQuery, HousesQueryVariables } from "src/generated/HousesQuery";

const HOUSES_QUERY = gql`
  query HousesQuery($bounds: BoundsInput!) {
    houses(bounds: $bounds) {
      id
      latitude
      longitude
      address
      description
      publicId
      bedrooms
      price
      space
      build
      maintainance
    }
  }
`;

type BoundsArray = [[number, number], [number, number]];

const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray;
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
};

export default function Home() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]]"
  );
  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  const { data, error } = useQuery<HousesQuery, HousesQueryVariables>(
    HOUSES_QUERY,
    {
      variables: { bounds: parseBounds(debouncedDataBounds) },
    }
  );
  const lastData = useLastData(data);

  if (error) return <Layout main={<div>Error loading houses</div>} />;

  return (
    <Layout
      main={
        <div className="flex flex-col-reverse sm:flex-row ">
          <div
            className="h-1/2 sm:max-h-full sm:w-1/2 pb-2 flex flex-wrap justify-center content-start"
            style={{ maxHeight: "calc(100vh - 64px)", overflowY: "scroll" }}
          >
            <HouseList
              houses={lastData ? lastData.houses : []}
              setHighlightedId={setHighlightedId}
            />
          </div>
          <div className="h-96 sm:h-screen sm:w-1/2">
            <Map
              setDataBounds={setDataBounds}
              houses={lastData ? lastData.houses : []}
              highlightedId={highlightedId}
            />
          </div>
        </div>
      }
    />
  );
}
