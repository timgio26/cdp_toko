import NewCustomerModalFormGroup from "../Components/NewCustomerModalFormGroup";
import { IoIosTrash, IoIosEye, IoMdCreate } from "react-icons/io";
import { useGetAllCustomer } from "../utils/customerQuery";
import { useState } from "react";
import { PopupModal } from "../Components/PopupModal";
import { Link } from "react-router";
import { ErrorBackToHome } from "../Components/ErrorBackToHome";

type CustomerOnDelete = {
  id: string;
  name: string;
};

export function Homepage() {
  const { data, isLoading, isError } = useGetAllCustomer();
  const [showDelPopup, setShowDelPopup] = useState<boolean>(false);
  const [userOnDelete, setUserOnDelete] = useState<CustomerOnDelete>();
  function handleDeleteUser(id: string) {
    console.log(id);
  }

  console.log(import.meta.env.VITE_API_URL)

  if(isLoading)return <div><span>Loading</span></div>
  if(isError) return <ErrorBackToHome/>
  return (
    <div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Nama</th>
            <th className="px-6 py-3">No Hp</th>
            <th className="px-6 py-3">Alamat</th>
            <th className="px-6 py-3 w-min"></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((each) => (
            <tr className="bg-white border-b border-gray-200" key={each.id}>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <Link to={'/address-list'} state={{userId : each.id}}>
                {each.name}
                </Link>
              </td>
              <td className="px-6 py-4 ">{each.phoneNumber}</td>
              <td className="px-6 py-4 ">
                <ul>
                  {each.addressList?.map((address) => (
                    <li key={address.id}>{address.alamat}</li>
                  ))}
                </ul>
              </td>
              <td className="px-6 py-4 flex gap-3 justify-end">
                <div className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded">
                  <IoIosEye size={15}/>
                </div>
                <div className="bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-1 px-2 border border-yellow-500 hover:border-transparent rounded">
                  <IoMdCreate size={15}/>
                </div>
                <div
                  className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-2 border border-red-500 hover:border-transparent rounded"
                  onClick={() => {
                    setUserOnDelete({ id: each.id, name: each.name });
                    setShowDelPopup(true);
                  }}
                >
                  <IoIosTrash size={15}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <NewCustomerModalFormGroup />
      <PopupModal
        visible={showDelPopup}
        setVisible={setShowDelPopup}
        confirmText="delete"
        onConfirm={() => {
          if (userOnDelete && userOnDelete.id)
            handleDeleteUser(userOnDelete.id);
        }}
      >
        <span>Delete user : {userOnDelete?.name}</span>
      </PopupModal>
    </div>
  );
}
