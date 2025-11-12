import { useState } from "react";
import { useEditCustomer, type ICustomer } from "../utils/customerQuery";

type EditCustomerFormProp = {
    data:ICustomer;
    setModalVisibility:React.Dispatch<React.SetStateAction<boolean>>
}

export function EditCustomerForm({data,setModalVisibility}:EditCustomerFormProp) {
    const {id,name,phone,email,joined_date} = data
    const [namaEdit, setNamaEdit] = useState<string>(name);
    const [noHpEdit, setNoHpEdit] = useState<string|null>(phone);
    const [emailEdit, setEmailEdit] = useState<string|null>(email);
    const [joinedDateEdit, setJoinedDateEdit] = useState<string>(joined_date);
    const {mutate:updateCustomer,isPending} = useEditCustomer()

    function handleSubmit(){
        updateCustomer({id,name:namaEdit,phone:noHpEdit,email:emailEdit,joined_date:joinedDateEdit},{
            onSuccess:()=>{
                setModalVisibility(false)
            }
        }
        )
    }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Edit Customer</h2>
        <p className="text-sm text-gray-500">
          Please fill in the details below.
        </p>
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
          value={namaEdit}
          onChange={(e) => setNamaEdit(e.target.value)}
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
          value={noHpEdit?noHpEdit:undefined}
          onChange={(e) => setNoHpEdit(e.target.value)}
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
          value={emailEdit?emailEdit:undefined}
          onChange={(e) => setEmailEdit(e.target.value)}
          placeholder="e.g. name@example.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="joined_date"
          className="text-sm font-medium text-gray-700"
        >
          Joined Date
        </label>
        <input
          type="date"
          name="joined_date"
          id="joined_date"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
          value={joinedDateEdit}
          onChange={(e) => setJoinedDateEdit(e.target.value)}
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setModalVisibility(false)}
          className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
        >
          Cancel
        </button>
        <button
        disabled={isPending}
          onClick={handleSubmit}
          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {isPending?"Loading..":"Update"}
        </button>
      </div>
    </div>
  );
}
