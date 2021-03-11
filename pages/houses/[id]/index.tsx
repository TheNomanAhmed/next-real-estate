import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
import HouseNav from "src/components/houseNav";
import SingleMap from "src/components/singleMap";
import {
  ShowHouseQuery,
  ShowHouseQueryVariables,
} from "src/generated/ShowHouseQuery";

const SHOW_HOUSE_QUERY = gql`
  query ShowHouseQuery($id: String!) {
    house(id: $id) {
      id
      userId
      address
      description
      publicId
      bedrooms
      price
      space
      build
      maintainance
      latitude
      longitude
      nearby {
        id
        latitude
        longitude
      }
    }
  }
`;

export default function ShowHouse() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <HouseData id={id as string} />;
}

function HouseData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowHouseQuery, ShowHouseQueryVariables>(
    SHOW_HOUSE_QUERY,
    { variables: { id } }
  );

  if (loading || !data) return <Layout main={<div>Loading...</div>} />;
  if (!data.house)
    return <Layout main={<div>Unable to load house {id}</div>} />;

  const { house } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex ">
          <div
            className="sm:w-full md:w-1/2 p-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflowY: "scroll" }}
          >
            <HouseNav house={house} />

            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={house.publicId}
              alt={house.address}
              secure
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-xl lg:text-3xl my-2 font-semibold mb-2">
                  {house.address}
                </h1>
                <p className="text-md lg:text-xl my-2 font-light mb-4 w-3/2">
                  {house.description}
                </p>
              </div>
              <div className="flex flex-col flex-shrink-0 items-end ml-4">
                <p className="text-xl lg:text-2xl my-2 font-semibold ">
                  {house.price.toLocaleString()} €
                </p>
                <div className="mb-6">
                  <span className="mr-2">{house.space}.00 m²</span>
                  <span className="">
                    ({Math.round(house.price / house.space).toLocaleString()}{" "}
                    €/m²)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-around">
              <div className="flex items-center">
                <img src="/build.svg" className="w-8 md:w-12 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm">Built in</span>
                  <span className="font-medium text-sm md:text-lg">
                    {house.build}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <img src="/maintenance.svg" className="w-8 md:w-12 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm">Maintenance fee</span>
                  <span className="font-medium text-sm md:text-lg">
                    {house.maintainance}{" "}
                    <span className="font-light text-sm md:text-lg">
                      € / Month
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:w-full md:w-1/2">
            <SingleMap house={house} nearby={house.nearby} />
          </div>
        </div>
      }
    />
  );
}
