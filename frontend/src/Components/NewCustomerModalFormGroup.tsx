import { CornerModal } from "../Components/CornerModal";
import { IoIosAdd } from "react-icons/io";
import { useState } from "react";
import React from "react";
import { useCreateNewCustomer } from "../utils/customerQuery";
import { get_today_date } from "../utils/myfunction";

function NewCustomerModalFormGroup() {
  const [nama, setNama] = useState<string>("");
  const [noHp, setNoHp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [joinedDate, setJoinedDate] = useState<string>(get_today_date());
  const [showModal, setShowModal] = useState<boolean>(false);

  const { createNewCustomer } = useCreateNewCustomer();

  function handleSubmit() {
    // if (!nama || !noHp || !email || !joinedDate) return;
    createNewCustomer({ name: nama, phone: noHp, email, joined_date: joinedDate },
      {
        onSuccess: () => {
          setShowModal(false);
        },
      }
    );
  }

  return (
    <CornerModal
      ModalTriggerIcon={<IoIosAdd size={45} color="white" />}
      submitFunction={handleSubmit}
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <form className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">New Customer</h2>
          <p className="text-sm text-gray-500">Please fill in the details below.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="nama" className="text-sm font-medium text-gray-700">
            Nama
          </label>
          <input
            type="text"
            name="nama"
            id="nama"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            No Hp
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            placeholder="e.g. 0812-3456-7890"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. name@example.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="joined_date" className="text-sm font-medium text-gray-700">
            Joined Date
          </label>
          <input
            type="date"
            name="joined_date"
            id="joined_date"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
            value={joinedDate}
            onChange={(e) => setJoinedDate(e.target.value)}
          />
        </div>
      </form>
    </CornerModal>
  );
}

export default React.memo(NewCustomerModalFormGroup);