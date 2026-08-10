import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  downloadData,
  useDeleteCustomer,
  useGetAllCustomer,
  type ICustomer,
} from "../utils/customerQuery";
import NewCustomerModalFormGroup from "../Components/NewCustomerModalFormGroup";
import { PopupModal } from "../Components/PopupModal";
import { EditCustomerForm } from "../Components/EditCustomerForm";
import { Pagination } from "../Components/Pagination";
import { PageLoading } from "./PageLoading";
import {
  IoIosTrash,
  IoIosEye,
  IoMdCreate,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { FiAlertCircle } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";

export function Homepage() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [userMerge, setUserMerge] = useState<ICustomer[]>([]);
  const { data, isPending, isError } = useGetAllCustomer(page, search);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteCustomer();
  const [showDelPopup, setShowDelPopup] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ICustomer>();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length == 0 || searchInput.length >= 3) {
        setSearch(searchInput);
      }
    }, 500); // run this code after 500 ms
    return () => clearTimeout(timer); // cancel previous timer
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  function handleDeleteUser() {
    if (!selectedUser) return;
    deleteUser(selectedUser.id, {
      onSuccess: () => {
        setShowDelPopup(false);
      },
    });
  }

  function onNext() {
    // console.log("next")
    setPage((curState) => curState + 1);
  }
  function onPrev() {
    // console.log("prev")
    setPage((curState) => curState - 1);
  }

  function handleAddToList(id: ICustomer) {
    setUserMerge((curstate) => [...curstate, id]);
  }
  function handleRemoveFromList(id: string) {
    setUserMerge((curstate) => curstate.filter((each) => each.id != id));
  }

  function handleToMergeCustomer() {
    if (userMerge.length > 1) {
      navigate("/merge-customer", { state: userMerge });
    }
  }

  async function handleDownload() {
    setIsDownloading(true);
    await downloadData();
    setIsDownloading(false);
  }

  if (isPending) {
    return (
      <PageLoading/>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto flex min-h-[400px] max-w-5xl items-center justify-center">
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <FiAlertCircle className="h-6 w-6 text-red-500" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Failed to load customers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Something went wrong while fetching the data.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-6 ">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Customer List
        </h1>

        {/* Search Bar */}

        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition">
          <CiSearch className="text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            className="bg-transparent outline-none text-sm text-gray-700 w-40 sm:w-64"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Customer content */}
      {data && data.total > 0 ? (
        <>
          <div className="overflow-x-auto">
            {/* Table actions */}
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {userMerge.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {userMerge.length} customer
                    {userMerge.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleToMergeCustomer}
                  disabled={userMerge.length < 2}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    userMerge.length < 2
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Merge Customer
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition ${
                    isDownloading
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Downloading...
                    </>
                  ) : (
                    "Download Data"
                  )}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-700">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="w-12 px-4 py-3"></th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Name
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Phone
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Address
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {data.data.map((customer) => (
                      <tr
                        key={customer.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleAddToList(customer);
                              } else {
                                handleRemoveFromList(customer.id);
                              }
                            }}
                            checked={userMerge.some(
                              (each) => each.id === customer.id,
                            )}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>

                        <td className="px-6 py-4">
                          <Link
                            to="/address-list"
                            state={{ userId: customer.id }}
                            className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
                          >
                            {customer.name}
                          </Link>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {customer.phone || "-"}
                        </td>

                        <td className="px-6 py-4">
                          {customer.addresses?.length ? (
                            <ul className="space-y-1 text-gray-600">
                              {customer.addresses.map((address) => (
                                <li key={address.id}>{address.address}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">No address</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to="/address-list"
                              state={{ userId: customer.id }}
                            >
                              <button
                                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                title="View"
                              >
                                <IoIosEye size={17} />
                              </button>
                            </Link>

                            <button
                              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600"
                              title="Edit"
                              onClick={() => {
                                setSelectedUser(customer);
                                setShowEditPopup(true);
                              }}
                            >
                              <IoMdCreate size={17} />
                            </button>

                            <button
                              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                              onClick={() => {
                                setSelectedUser(customer);
                                setShowDelPopup(true);
                              }}
                            >
                              <IoIosTrash size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <Pagination
                total_page={data.total_pages}
                page={data.page}
                onNext={onNext}
                onPrev={onPrev}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
          <p className="text-lg font-medium">No customer found.</p>
          <p className="mt-1 text-sm">Start by adding a new customer below.</p>
        </div>
      )}

      {/* Add New Service */}
      <div className="pt-4">
        <NewCustomerModalFormGroup />
        {selectedUser && (
          <>
            <PopupModal visible={showDelPopup}>
              {/* Content Slot */}
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete{" "}
                  <strong>{selectedUser.name}</strong>?
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
                  onClick={handleDeleteUser}
                  data-testid="confirmButton"
                  className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition"
                >
                  {isDeleting ? "Loading" : "Delete"}
                </button>
              </div>
            </PopupModal>
            <PopupModal
              visible={showEditPopup}
              children={
                <EditCustomerForm
                  data={selectedUser}
                  setModalVisibility={setShowEditPopup}
                />
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
