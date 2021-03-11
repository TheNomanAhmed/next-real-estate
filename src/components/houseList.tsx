import Link from "next/link";
import { Image } from "cloudinary-react";
import { HousesQuery_houses } from "src/generated/HousesQuery";

interface IProps {
  houses: HousesQuery_houses[];
  setHighlightedId: (id: string | null) => void;
}

export default function HouseList({ houses, setHighlightedId }: IProps) {
  return (
    <>
      {houses.map((house) => (
        <Link key={house.id} href={`/houses/${house.id}`}>
          <div
            className="px-2 pt-2 mb-4 cursor-pointer flex flex-col flex-wrap md:w-1/2 self-start"
            onMouseEnter={() => setHighlightedId(house.id)}
            onMouseLeave={() => setHighlightedId(null)}
          >
            <div className="sm:w-full">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={house.publicId}
                alt={house.address}
                secure
                dpr="auto"
                quality="auto"
                width={350}
                height={Math.floor((9 / 16) * 350)}
                crop="fill"
                gravity="auto"
              />
            </div>
            <div className="sm:w-full sm:pl-0 mt-2">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">
                  {house.address.split(/(,)/).shift()}
                </h2>

                <div className="text-lg font-semibold">
                  {house.price.toLocaleString()} €
                </div>
              </div>

              <div className="flex justify-between">
                <h2 className="text-sm">
                  {house.address.split(/(,)/).slice(-3)}
                </h2>
                <div>
                  <span className="text-sm">{house.bedrooms}.0 bd</span> ·
                  <span className="text-sm"> {house.space}.00 m²</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
