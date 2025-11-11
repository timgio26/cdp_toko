import { useLocation } from "react-router";
import { z } from "zod";
import { useGetSingleCustomer } from "../utils/customerQuery";
import { ErrorBackToHome } from "../Components/ErrorBackToHome";

import { NewAddressModalFormGroup } from "../Components/NewAddressModalFormGroup";
import { AddressTiles } from "../Components/AddressTiles";

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

  const { data, isLoading, isError } = useGetSingleCustomer(
    parseResult.data.state.userId
  );

  if (!isLoading && isError) return <ErrorBackToHome />;

  return (
    <>
      {data && (
        <div className="space-y-8">
          {/* Customer Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {data.name}
              </h1>
              <p className="text-sm text-zinc-500">📞 {data.phone}</p>
            </div>
            
          </div>

          {/* Address Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.addresses?
            data.addresses.map((each) => (
              <AddressTiles id={each.id} address={each.address} kategori={each.kategori}/>
            )):(
            <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
              <p className="text-lg font-medium">No address recorded yet.</p>
              <p className="text-sm mt-1">Start by adding a new address below.</p>
            </div>
            )}
          </div>

          {/* Add New Service */}
            <div className="pt-4">
              <NewAddressModalFormGroup customer_id={data.id} />
            </div>
        </div>
      )}
    </>
  );
}
