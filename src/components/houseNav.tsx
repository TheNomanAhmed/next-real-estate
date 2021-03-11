import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteHouse, DeleteHouseVariables } from "src/generated/DeleteHouse";

const DELETE_MUTATION = gql`
  mutation DeleteHouse($id: String!) {
    deleteHouse(id: $id)
  }
`;

interface IProps {
  house: {
    id: string;
    userId: string;
  };
}

export default function HouseNav({ house }: IProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = !!user && user.uid === house.userId;
  const [deleteHouse, { loading }] = useMutation<
    DeleteHouse,
    DeleteHouseVariables
  >(DELETE_MUTATION);

  return (
    <div className="flex justify-between items-center mb-4">
      <Link href="/">
        <a className="flex items-center">
          <svg
            className="w-6 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
            />
          </svg>
          <span>Back</span>
        </a>
      </Link>
      {canManage && (
        <div className="flex">
          <Link href={`/houses/${house.id}/edit`}>
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700">
              <svg
                className="w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="pl-1">Edit</span>
            </a>
          </Link>
          <button
            className="ml-2 items-center flex px-3 py-2 rounded-md hover:bg-red-900"
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure?")) {
                await deleteHouse({ variables: { id: house.id } });
                router.push("/");
              }
            }}
          >
            <svg
              className="w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="pl-1">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
