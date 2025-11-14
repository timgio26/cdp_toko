import { CiEdit ,CiTrash,CiMap } from "react-icons/ci";
import { Link } from "react-router";
import type { IAddress } from "../utils/customerQuery";

type AddressTilesProps = {
    addressData:IAddress;
    edit_function:()=>void;
    delete_function:()=>void;
}

export function AddressTiles({addressData,edit_function,delete_function}:AddressTilesProps) {
  return (
    <div
      key={addressData.id}
      className="group relative bg-gradient-to-br from-white to-stone-50 border border-gray-200 rounded shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-5 flex flex-col justify-between"
    >
      {/* Top Icon */}

      {/* Content */}
      <div className="space-y-2">
        <Link to="/service-list"state={{id: addressData.id,}}className="block text-base font-semibold text-slate-800 hover:underline">
          {addressData.address}
        </Link>
        <p className="text-sm text-gray-500">{addressData.kategori}</p>
        <p className="text-sm text-gray-500">{addressData.phone}</p>
      </div>


      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-1 items-center">
        {/* <span className="text-xs text-gray-400">🧭 Location</span> */}
        <CiEdit size={24} className="text-gray-300 hover:text-amber-500 transition cursor-pointer" onClick={edit_function}/>
        <CiTrash size={24} className="text-gray-300 hover:text-red-800 transition cursor-pointer" onClick={delete_function}/>
        {addressData.latitude&&addressData.longitude&&
        <Link to={`https://www.google.com/maps?q=${addressData.latitude},${addressData.longitude}`} target='_blank'>
          <CiMap size={24} className="text-gray-300 hover:text-green-800 transition cursor-pointer"/>
        </Link>
        }
      </div>
    </div>
  );
}
