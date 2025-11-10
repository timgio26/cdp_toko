import { CornerModal } from "../Components/CornerModal";
// import { NewCustomerForm } from "../Components/NewCustomerForm";
import { IoIosAdd } from "react-icons/io";
import { useState } from "react";
import React from "react";
import { useCreateNewCustomer } from "../utils/customerQuery";



function NewCustomerModalFormGroup() {
  const [nama, setNama] = useState<string>();
  const [noHp, setNoHp] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const {createNewCustomer,isPending} = useCreateNewCustomer()

  console.log(isPending)

  function handleSubmit(){
    if(!nama || !noHp) return
    createNewCustomer({Name:nama,PhoneNumber:noHp},{onSuccess:()=>{setShowModal(false)}})
  }

  return (
    <CornerModal ModalTrigerIcon={<IoIosAdd size={45} color="white"/>} submitFunction={handleSubmit} showModal={showModal} setShowModal={setShowModal}>
      <form action="">
        <div className="mb-2">
          <span className="font-bold">New Customer</span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="nama" className="text-xs">
            Nama
          </label>
          <input
            type="text"
            name="nama"
            id="nama"
            className="mb-4 border-b border-gray-300 p-2 focus:outline-none"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-xs">
            No Hp
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            className="mb-4 border-b border-gray-300 p-2 focus:outline-none"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
          />
        </div>
      </form>
    </CornerModal>
  );
}

export default React.memo(NewCustomerModalFormGroup)

