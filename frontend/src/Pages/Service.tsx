import { useLocation } from "react-router";
import { NewServiceModalFormGroup } from "../Components/NewServiceModalFormGroup";
import { z } from "zod";
import { ErrorBackToHome } from "../Components/ErrorBackToHome";
import { useGetAddress } from "../utils/customerQuery";
import { PageLoading } from "./Index";
import { IoIosTrash, IoMdCreate } from "react-icons/io";
// import { serviceSchema } from "../utils/customerQuery";

const ServicePageSchema = z.object({
  key: z.string(),
  pathname: z.string(),
  state: z.object({
    id: z.string(),
  }),
});

export function Service() {
  const location = useLocation();
  const { data, success } = ServicePageSchema.safeParse(location);
  if (!success) return <ErrorBackToHome />;
  const {data: address_data,isError,isLoading,} = useGetAddress(data.state.id);
  if (!address_data || isError) return <ErrorBackToHome />;
  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Service</h1>
        <p className="text-sm text-gray-500">
          {address_data.address} — {address_data.kategori}
        </p>
      </div>

      {/* Conditional Table or Empty State */}
      {address_data.services && address_data.services.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4">Date</th>
                <th className="px-4">Complaint</th>
                <th className="px-4">Action Taken</th>
                <th className="px-4">Result</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {address_data.services.map((each, index) => (
                <tr
                  key={index}
                  className="bg-white rounded-xl shadow-sm transition hover:shadow-md"
                >
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {each.service_date}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {each.complaint}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {each.action_taken}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {each.result}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 justify-end flex gap-2">
                    <button
                      className="flex items-center gap-1 text-yellow-600 hover:text-white hover:bg-yellow-500 px-2 py-1 border border-yellow-500 rounded transition"
                      title="Edit"
                    >
                      <IoMdCreate size={16} />
                    </button>
                    <button
                      className="flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-500 px-2 py-1 border border-red-500 rounded transition"
                      title="Delete"
                      onClick={() => {
                        console.log("delete")
                      }}
                    >
                      <IoIosTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
          <p className="text-lg font-medium">No services recorded yet.</p>
          <p className="text-sm mt-1">Start by adding a new service below.</p>
        </div>
      )}

      {/* Add New Service */}
      <div className="pt-4">
        <NewServiceModalFormGroup />
      </div>
    </div>
  );
}
