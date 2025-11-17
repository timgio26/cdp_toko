import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router";

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
import { CiSearch } from "react-icons/ci";

// type CustomerOnDelete = {
//   id: string;
//   name: string;
// };

export function Homepage() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [userMerge, setUserMerge] = useState<ICustomer[]>([]);
  const { data, isLoading } = useGetAllCustomer(page, search);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteCustomer();
  const [showDelPopup, setShowDelPopup] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ICustomer>();
  const navigate = useNavigate()

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

  function handleToMergeCustomer(){
    if(userMerge.length>1){
      navigate("/merge-customer",{state:userMerge})
    }
  }

  function handleDownload(){
    downloadData()
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

      {/* Table */}
      {data && data.total > 0 ? (
        <>
          <div className="overflow-x-auto">
            {isLoading ? (
              <PageLoading />
            ) : (
              <>
                <div className="flex gap-2 mb-1">
                  <div
                    onClick={handleToMergeCustomer}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded transition
                    ${
                      userMerge.length < 2
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-gray-900 cursor-pointer"
                    }
                  `}
                  >
                    Merge Customer
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded transition bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-gray-900 cursor-pointer"
                  onClick={handleDownload}>
                    Download Data
                  </div>
                </div>

                <table className="min-w-full text-sm text-left text-gray-700 bg-white border border-gray-200 shadow">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th></th>
                      <th className="px-6 py-3">Nama</th>
                      <th className="px-6 py-3">No Hp</th>
                      <th className="px-6 py-3">Alamat</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-2">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleAddToList(customer);
                              } else {
                                handleRemoveFromList(customer.id);
                              }
                            }}
                            checked={userMerge.filter((each)=>each.id==customer.id).length>0}
                          />
                        </td>
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
                          <Link
                            to="/address-list"
                            state={{ userId: customer.id }}
                          >
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
                            onClick={() => {
                              setSelectedUser(customer);
                              setShowEditPopup(true);
                            }}
                          >
                            <IoMdCreate size={16} />
                          </button>
                          <button
                            className="flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-500 px-2 py-1 border border-red-500 rounded transition"
                            title="Delete"
                            onClick={() => {
                              setSelectedUser(customer);
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
              </>
            )}
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
        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
          <p className="text-lg font-medium">No customer found.</p>
          <p className="text-sm mt-1">Start by adding a new customer below.</p>
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
