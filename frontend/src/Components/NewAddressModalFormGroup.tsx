import { useState } from "react";
import { CornerModal } from "../Components/CornerModal";
import { IoIosAdd } from "react-icons/io";
import { useCreateNewAddress } from "../utils/customerQuery";
import { MapLeaflet } from "./MapLeaflet";
import { CiMapPin, CiCircleChevUp } from "react-icons/ci";

type NewAddressModalFormGroupProp = {
  customer_id: string;
};

export function NewAddressModalFormGroup({
  customer_id,
}: NewAddressModalFormGroupProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();
  const [latitude,setLat]=useState<number|undefined|null>(null)
  const [longitude,setLon] = useState<number|undefined|null>(null) 
  const [kategori, setKategori] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const { CreateNewAddress, isPending } = useCreateNewAddress();

  function SubmitNewAddressHandler() {
    if (isPending) return;
    if (!address || !kategori) return;
    CreateNewAddress({ customer_id, address, kategori, phone ,latitude,longitude},
      {
        onSuccess: () => {
          setShowModal(false);
          setAddress(undefined);
          setKategori(undefined);
          setPhone(undefined);
          setLat(null)  
          setLon(null)
        },
      }
    );
  }

  return (
    <CornerModal
      ModalTriggerIcon={<IoIosAdd size={45} color="white" />}
      submitFunction={SubmitNewAddressHandler}
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <form className="space-y-6 overflow-y-scroll max-h-100 px-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">New Address</h2>
          <p className="text-sm text-gray-500">
            Please provide the address and category below.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="Alamat" className="text-sm font-medium text-gray-700">
            Alamat*
          </label>
          <textarea
            name="Alamat"
            id="Alamat"
            rows={4}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter full address"
          />
        </div>

        {/* <div className="h-40 w-full"> */}
        <div className="relative">
          {showMap && <MapLeaflet lat={latitude} lon={longitude} setLat={setLat} setLon={setLon}/>}
          <div className="flex justify-center">
            <div
              onClick={() => setShowMap((curstate) => !curstate)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <span className="text-sm tracking-wide">
                {showMap ? "Hide" : latitude&&longitude?"Edit pinpoint": "Add pipoint"}
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
          <label
            htmlFor="Kategori"
            className="text-sm font-medium text-gray-700"
          >
            Kategori*
          </label>
          <select
            name="Kategori"
            id="Kategori"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
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
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/[a-zA-Z]/g, "");
              setPhone(value);
            }}
            placeholder="e.g. 022 - 5412345"
          />
        </div>
      </form>
    </CornerModal>
  );
}
