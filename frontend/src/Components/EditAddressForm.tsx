import { useState } from "react";
import { useEditAddress, type IAddress } from "../utils/customerQuery";
import { CiCircleChevUp, CiMapPin } from "react-icons/ci";
import { MapLeaflet } from "./MapLeaflet";

type EditAddressFormProps = {
    setModalVisibility:React.Dispatch<React.SetStateAction<boolean>>;
    addressData:IAddress;
}

export function EditAddressForm({setModalVisibility,addressData}:EditAddressFormProps) {
  const {address,kategori,phone,id,latitude,longitude} = addressData
  console.log(addressData)
  const [showMap, setShowMap] = useState<boolean>(false);
  const [addressEdit,setAddressEdit] = useState<string>(address)
  const [kategoriEdit,setKategoriEdit] = useState<string>(kategori)
  const [phoneEdit,setPhoneEdit] = useState<string|null>(phone)
  const [latitudeEdit,setLat]=useState<number|undefined|null>(latitude)
  const [longitudeEdit,setLon] = useState<number|undefined|null>(longitude) 
  const {mutate:updateAddress,isPending} = useEditAddress()

  function handleConfirm(){
    updateAddress({id,address:addressEdit,kategori:kategoriEdit,phone:phoneEdit,latitude:latitudeEdit,longitude:longitudeEdit},{
      onSuccess:()=>{
        setModalVisibility(false)
      }
    })
  }
  return (
    <div className="space-y-6 max-h-100 overflow-y-scroll">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Edit Address</h2>
        <p className="text-sm text-gray-500">
          Please provide the address and category below.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="Alamat" className="text-sm font-medium text-gray-700">
          Alamat
        </label>
        <textarea
          name="Alamat"
          id="Alamat"
          rows={4}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
          value={addressEdit}
          onChange={(e) => setAddressEdit(e.target.value)}

        />
      </div>

      <div className="relative">
        {showMap && <MapLeaflet lat={latitudeEdit} lon={longitudeEdit} setLat={setLat} setLon={setLon}/>}
        <div className="flex justify-center">
          <div
            onClick={() => setShowMap((curstate) => !curstate)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <span className="text-sm tracking-wide">
              {showMap ? "Hide" : latitudeEdit&&longitudeEdit?"Edit pinpoint": "Add pipoint"}
            </span>
            {showMap ? (
              <CiCircleChevUp className="text-xl" />
            ) : (
              <CiMapPin className="text-xl" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="Kategori" className="text-sm font-medium text-gray-700">
          Kategori
        </label>
        <select
          name="Kategori"
          id="Kategori"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
          value={kategoriEdit}
          onChange={(e) => setKategoriEdit(e.target.value)}
        >
          <option value="" hidden>
            Select category
          </option>
          <option value="Rumah">Rumah</option>
          <option value="Toko">Toko</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Pabrik">Pabrik</option>
          <option value="Lain-lain">Lain-lain</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          No Telepon
        </label>
        <input
          type="text"
          name="phone"
          id="phone"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
          value={phoneEdit?phoneEdit:undefined}
          onChange={(e) => {
            const value = e.target.value.replace(/[a-zA-Z]/g, '');
            setPhoneEdit(value)}
          }
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
          onClick={handleConfirm}
          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {isPending?"Loading...":"Update"}
        </button>
      </div>
    </div>
  );
}
