import { Link, useLocation } from "react-router";
import { z } from "zod";
import { GetSingleUser } from "../utils/customerQuery";
import { ErrorBackToHome } from "../Components/ErrorBackToHome";
import { CiImageOn } from "react-icons/ci";
import { NewAddressModalFormGroup } from "../Components/NewAddressModalFormGroup";

const AddressPageSchema = z.object({
  key: z.string(),
  pathname: z.string(),
  state: z.object({
    userId: z.string(),
  }),
});

export function Address() {
  const location = useLocation();
  const parseResult = AddressPageSchema.safeParse(location);

  if (!parseResult.success) return <ErrorBackToHome />;

  const { data, isLoading, isError } = GetSingleUser(
    parseResult.data.state.userId
  );

  if (!isLoading&&isError ) return <ErrorBackToHome />;

  return (
    <>
      {data && (
        <>
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-3xl font-bold">{data.data.name}</span>
            <span>{data.data.phoneNumber}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.data.addressList?.map((each) => (
              <div
                className="flex gap-1 bg-white max-w-sm rounded overflow-hidden shadow-lg p-2"
                key={each.id}
              >
                <div className="w-1/5  rounded">
                  <CiImageOn size="100%" color="#e8e8e8" />
                </div>
                <div className="flex flex-col w-4/5 justify-between">
                <div className="flex flex-col">

                  <Link to={"/service-list"} state={{serviceList:each.serviceList,customer:data.data.name,address:each.alamat}}>
                    <span className="font-semibold">{each.alamat}</span>
                  </Link>
                  <span className="font-light text-gray-700">
                    {each.kategori}
                  </span>
                </div>
                  <div className="flex justify-end mt-3">
                    <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full cursor-pointer">
                      <span>Get Direction</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <NewAddressModalFormGroup customerId={data.data.id} />
        </>
      )}
    </>
  );
}
