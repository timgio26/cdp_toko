import { Link, useLocation } from "react-router";
import { z } from "zod";
import { useGetSingleCustomer } from "../utils/customerQuery";
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
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                {data.name}
              </h1>
              <p className="text-sm text-zinc-500">📞 {data.phone}</p>
            </div>
            <NewAddressModalFormGroup customer_id={data.id} />
          </div>

          {/* Address Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.addresses?.map((each) => (
              <div
                key={each.id}
                className="group relative bg-gradient-to-br from-white to-stone-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-5 flex flex-col justify-between"
              >
                {/* Top Icon */}
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-emerald-500 transition">
                  <CiImageOn size={24} />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Link
                    to="/service-list"
                    state={{
                      id:each.id
                    }}
                    className="block text-base font-semibold text-slate-800 hover:underline"
                  >
                    {each.address}
                  </Link>
                  <p className="text-sm text-gray-500">{each.kategori}</p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">🧭 Location</span>
                  <button className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium px-3 py-1 rounded-full transition">
                    Get Direction
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
