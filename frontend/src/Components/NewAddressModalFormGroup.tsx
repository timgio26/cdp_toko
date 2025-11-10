import { useState } from "react";
import { CornerModal } from "../Components/CornerModal";
import { IoIosAdd } from "react-icons/io";
import { useCreateNewAddress } from "../utils/customerQuery";

type NewAddressModalFormGroupProp = {
  customerId:string
}

export function NewAddressModalFormGroup({customerId}:NewAddressModalFormGroupProp){
    const [showModal, setShowModal] = useState<boolean>(false);
    const [alamat,setAlamat] = useState<string>()
    const [kategori,setKategori] = useState<string>("Rumah") 
    const {CreateNewAddress,isPending} = useCreateNewAddress()

    function SubmitNewAddressHandler(){
      if(isPending)return
      if(!alamat || ! kategori)return
      CreateNewAddress({customerId,alamat,kategori},{
        onSuccess:()=>setShowModal(false)
      }
      )
    }

    return (
      <CornerModal
        ModalTrigerIcon={<IoIosAdd size={45} color="white" />}
        submitFunction={SubmitNewAddressHandler}
        showModal={showModal}
        setShowModal={setShowModal}
      >
        <form action="">
          <div className="mb-2">
            <span className="font-bold">New Address</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="Alamat" className="text-xs">
              Alamat
            </label>
            <textarea
              name="Alamat"
              id="Alamat"
              className="border-gray-300 p-2 focus:outline-none border rounded my-1"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="Kategori" className="text-xs">
              Kategori
            </label>
            <select
              name="Kategori"
              id="Kategori"
              className="border-gray-300 p-2 focus:outline-none border-b rounded"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
            >
              <option value="Rumah">Rumah</option>
              <option value="Toko">Toko</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Pabrik">Pabrik</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>
        </form>
      </CornerModal>
    );
}