import { useState } from "react";
import { useLocation } from "react-router";
import { z } from "zod";
import { formatBeautifulDate } from "../utils/myfunction";
import { useDeleteService, useGetAddress, type IService } from "../utils/customerQuery";
import { PageLoading } from "./Index";
import { NewServiceModalFormGroup } from "../Components/NewServiceModalFormGroup";
import { ErrorBackToHome } from "../Components/ErrorBackToHome";
import { PopupModal } from "../Components/PopupModal";
import { EditServiceForm } from "../Components/EditServiceForm";
import { CiCircleChevLeft } from "react-icons/ci";
import { IoIosTrash, IoMdCreate ,IoIosCloseCircleOutline} from "react-icons/io";

const ServicePageSchema = z.object({
  key: z.string(),
  pathname: z.string(),
  state: z.object({
    id: z.string(),
  }),
});

export function Service() {
  const location = useLocation();
  const { mutate: deleteService, isPending } = useDeleteService();
  const [showDelPopup, setShowDelPopup] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [editData,setEditData] = useState<IService>()
  const [delId, setDelId] = useState<string>("");

  function handleDeleteService() {
    deleteService(delId, {
      onSuccess: () => {
        setShowDelPopup(false);
      },
    });
  }

  const { data, success } = ServicePageSchema.safeParse(location);
  if (!success) return <ErrorBackToHome />;
  const {
    data: address_data,
    isError,
    isLoading,
  } = useGetAddress(data.state.id);
  if (isLoading) return <PageLoading />;
  if (!address_data || isError) return <ErrorBackToHome />;

  const services= address_data.services?.sort((a,b)=>a.service_date<b.service_date?1:-1)
  // console.log(services)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">

        <button
          onClick={() => window.history.back()}
          className="flex items-center "
        >
          {/* <CiCircleChevLeft className="text-3xl" /> */}
          <CiCircleChevLeft size={30} className="text-gray-300 hover:text-indigo-500 transition cursor-pointer"/>
          {/* <span className="hidden sm:inline text-sm font-medium">Back</span> */}
        </button>
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Service</h1>
        <p className="text-sm text-gray-500">
          {address_data.address} — {address_data.kategori}
        </p>
      </div>
      </div>

      {/* Conditional Table or Empty State */}
      {services && services.length>0 ? (
        <div className="overflow-x-auto shadow">
          <table className="min-w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr >
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Keluhan</th>
                <th className="px-6 py-3">Tindakan</th>
                <th className="px-6 py-3">Hasil</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((each, index) => (
                <tr
                  key={index}
                  className="bg-white rounded-xl shadow-sm transition hover:shadow-md"
                >
                  <td className="px-6 py-3 text-sm text-slate-700">
                    {formatBeautifulDate(each.service_date)}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    {each.complaint}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    {each.action_taken}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    {each.result}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700 justify-end flex gap-2">
                    <button
                      className="flex items-center gap-1 text-yellow-600 hover:text-white hover:bg-yellow-500 px-2 py-1 border border-yellow-500 rounded transition"
                      title="Edit"
                      onClick={() => {
                        setEditData(each);
                        setShowEditPopup(true);
                      }}
                    >
                      <IoMdCreate size={16} />
                    </button>
                    <button
                      className="flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-500 px-2 py-1 border border-red-500 rounded transition"
                      title="Delete"
                      onClick={() => {
                        setShowDelPopup(true);
                        setDelId(each.id);
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
        <NewServiceModalFormGroup address_id={data.state.id} />
        <PopupModal visible={showDelPopup}>
          <>
            {/* Content Slot */}
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete?
              </p>
            </div>

            {/* Icon */}
            <div className="flex justify-center mt-6">
              <IoIosCloseCircleOutline size={64} className="text-red-500" />
            </div>

            {/* Button */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDelPopup(false)}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
                data-testid="confirmButton"
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition"
              >
                {isPending ? "Loading" : "Delete"}
              </button>
            </div>
          </>
        </PopupModal>

        {editData && (
          <PopupModal
            visible={showEditPopup}
            children={<EditServiceForm data={editData} setModalVisibility={setShowEditPopup}/>}
          />
        )}
      </div>
    </div>
  );
}
