import { useState } from "react";
import { Link } from "react-router";
import { IoIosTrash, IoIosEye, IoMdCreate } from "react-icons/io";

import { useDeleteCustomer, useGetAllCustomer } from "../utils/customerQuery";
import NewCustomerModalFormGroup from "../Components/NewCustomerModalFormGroup";
import { PopupModal } from "../Components/PopupModal";
import { ErrorBackToHome } from "../Components/ErrorBackToHome";
import { PageLoading } from "./PageLoading";

type CustomerOnDelete = {
  id: string;
  name: string;
};

export function Homepage() {
  const { data, isLoading, isError } = useGetAllCustomer();
  const {
    mutate: deleteUser,
    isError: isDeleteError,
    isPending: isDeleting,
  } = useDeleteCustomer();
  const [showDelPopup, setShowDelPopup] = useState(false);
  const [userOnDelete, setUserOnDelete] = useState<CustomerOnDelete | null>(
    null
  );

  const handleDeleteUser = (id: string) => {
    // TODO: Implement actual delete logic
    deleteUser(id);
    if (!isDeleteError) {
      setShowDelPopup(false);
    }
  };

  if(isLoading)return <PageLoading/>
  if (isError) return <ErrorBackToHome />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold ">Customer List</h2>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3">No Hp</th>
              <th className="px-6 py-3">Alamat</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium  whitespace-nowrap">
                  <Link
                    to="/address-list"
                    state={{ userId: customer.id }}
                    className="hover:underline"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">
                  <ul className="list-disc list-inside text-gray-600">
                    {customer.addresses?.map((address) => (
                      <li key={address.id}>{address.address}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  <Link to="/address-list" state={{ userId: customer.id }}>
                    <button
                      className="flex items-center gap-1 text-blue-600 hover:text-white hover:bg-blue-500 px-2 py-1 border border-blue-500 rounded transition"
                      title="View"
                    >
                      <IoIosEye size={16} />
                    </button>
                  </Link>
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
                      setUserOnDelete({ id: customer.id, name: customer.name });
                      setShowDelPopup(true);
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

      <NewCustomerModalFormGroup />
      <PopupModal
        visible={showDelPopup}
        setVisible={setShowDelPopup}
        confirmText={isDeleting ? "Loading" : "Delete"}
        onConfirm={() => {
          if (userOnDelete?.id) handleDeleteUser(userOnDelete.id);
        }}
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to delete <strong>{userOnDelete?.name}</strong>?
        </p>
      </PopupModal>
    </div>
  );
}
