import { useState } from "react";
import { useLocation } from "react-router";
import { z } from "zod";
import { useDeleteAddress, useGetSingleCustomer, type IAddress } from "../utils/customerQuery";

import { ErrorBackToHome } from "../Components/ErrorBackToHome";
import { NewAddressModalFormGroup } from "../Components/NewAddressModalFormGroup";
import { AddressTiles } from "../Components/AddressTiles";
import { PopupModal } from "../Components/PopupModal";
import { EditAddressForm } from "../Components/EditAddressForm";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiCircleChevLeft } from "react-icons/ci";

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
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [showDelPopup, setShowDelPopup] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<IAddress>();
  const {mutate:deleteAddress,isPending} = useDeleteAddress()
  function handleDelete(){
    if(selectedAddress){
      deleteAddress(selectedAddress.id,{
        onSuccess:()=>{
          setShowDelPopup(false)
        }
      })
    }
  }

  if (!parseResult.success) return <ErrorBackToHome />;

  const { data, isLoading, isError } = useGetSingleCustomer(
    parseResult.data.state.userId
  );

  if (!isLoading && isError) return <ErrorBackToHome />;

  return (
    <>
      {data && (
        <div className="space-y-6">
          {/* Customer Header */}
<div className="flex items-center gap-4">
  {/* Back Button */}
  <button
    onClick={() => window.history.back()}
    className="flex items-center"
  >
    <CiCircleChevLeft size={30} className="text-gray-300 hover:text-indigo-500 transition cursor-pointer"/>
    {/* <span className="hidden sm:inline text-sm font-medium">Back</span> */}
  </button>

  {/* User Info */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <div>
      <h1 className="text-3xl font-bold text-slate-800">{data.name}</h1>
      <p className="text-sm text-zinc-500">📞 {data.phone}</p>
    </div>
  </div>
</div>


          {/* Address Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.addresses ? (
              data.addresses.map((each) => (
                <AddressTiles
                  addressData={each}
                  edit_function={() => {
                    setSelectedAddress(each);
                    setShowEditPopup(true);
                  }}
                  delete_function={() => {
                    setSelectedAddress(each);
                    setShowDelPopup(true);
                  }}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
                <p className="text-lg font-medium">No address recorded yet.</p>
                <p className="text-sm mt-1">
                  Start by adding a new address below.
                </p>
              </div>
            )}
          </div>

          {/* Add New Service */}
          <div className="pt-4">
            <NewAddressModalFormGroup customer_id={data.id} />
            {selectedAddress && (
              <PopupModal
                visible={showEditPopup}
                children={
                  <EditAddressForm
                    setModalVisibility={setShowEditPopup}
                    addressData={selectedAddress}
                  />
                }
              />
            )}
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
                    onClick={handleDelete}
                    data-testid="confirmButton"
                    className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition"
                  >
                    {isPending ? "Loading" : "Delete"}
                  </button>
                </div>
              </>
            </PopupModal>
          </div>
        </div>
      )}
    </>
  );
}
