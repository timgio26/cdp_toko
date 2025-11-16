import { CiCircleChevLeft } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router";
import { MergeCustomerSchema, useMergeAddress } from "../utils/customerQuery";
import { ErrorBackToHome } from "../Components/ErrorBackToHome";
import { useState } from "react";
import { map } from "leaflet";

export function MergeCustomer() {
  const navigate = useNavigate()
  const {mutate:mergeAddress,isPending} = useMergeAddress()
  const [selectedCustomer, setSelectedCustomer] = useState<string>();
  const { state } = useLocation();
  const { data, success } = MergeCustomerSchema.safeParse(state);
  // const allAddressId : string[] = data?.flatMap((each)=>(each.addresses?.map((address)=>(address.id))))
  const allAddressId = data? data.flatMap((each)=>(each.addresses?.map((address)=>(address.id)))) : []
  const allAddressIdStr = allAddressId.filter((each)=>typeof(each)=='string')

  const unused_customer_list = data? data.flatMap((each)=>(each.id)).filter((each)=>(typeof(each)=='string'&&each!=selectedCustomer)) : []
  


  if (!success) {
      return <ErrorBackToHome />;
    }

  function handleMerge(){
    if(!selectedCustomer ) return;
    // if(allAddressId.length==0)return
    
    
    mergeAddress({customer_id:selectedCustomer,address_list:allAddressIdStr,unused_customer_list},{
      onSuccess:()=>{
        navigate("/")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center"
        >
          <CiCircleChevLeft
            size={30}
            className="text-gray-300 hover:text-indigo-500 transition cursor-pointer"
          />
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Merge Customer
              
            </h1>
            <span className="text-xs">Alamat lain akan dipindahkan ke customer yang dipilih</span>
          </div>
        </div>
  <div className="flex grow justify-end">
    {selectedCustomer&&
    <button
      onClick={handleMerge}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full shadow-sm transition"
    >
      {isPending?"Loading...":"Merge"}
    </button>
    }
  </div>

      </div>
      {/* Body */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.map((each, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-md p-4 shadow-sm hover:shadow transition"
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="selectedCustomer"
                //   checked={false}
                onChange={() => {
                  setSelectedCustomer(each.id)
                }}
                className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  {each.name}
                </h2>
                <p className="text-xs text-gray-500">{each.phone}</p>
                <ul className="mt-2 space-y-1">
                  {each.addresses?.map((address, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-700 bg-gray-50 px-3 py-1 rounded border border-gray-100"
                    >
                      <span className="font-medium">{address.address}</span>{" "}
                      &mdash;{" "}
                      <span className="text-indigo-600">
                        {address.kategori}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
