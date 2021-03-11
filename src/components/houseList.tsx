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
            className="px-2 pt-2 cursor-pointer flex flex-col flex-wrap md:w-1/2"
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
              <h2 className="text-sm">{house.address}</h2>
              <div>{house.price} €</div>
              <p>{house.bedrooms}.0 bd</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
