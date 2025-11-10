import { useState } from "react";
import { CornerModal } from "./CornerModal";
import { IoIosAdd } from "react-icons/io";

export function NewServiceModalFormGroup() {
  const [showModal, setShowModal] = useState<boolean>(false);
  function handleSubmit() {}
  return (
    <CornerModal
      ModalTrigerIcon={<IoIosAdd size={45} color="white" />}
      submitFunction={handleSubmit}
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <form action="">
        <div className="mb-2">
          <span className="font-bold">New Service</span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="Keluhan" className="text-xs">
            Keluhan
          </label>
          <textarea
            // type="text"
            name="Keluhan"
            id="Keluhan"
            className="border-gray-300 p-2 focus:outline-none border rounded my-1"
            // value={nama}
            // onChange={(e) => setNama(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="Tindakan" className="text-xs">
            Tindakan
          </label>
          <textarea
            // type="text"
            name="Tindakan"
            id="Tindakan"
            className="border-gray-300 p-2 focus:outline-none border rounded my-1"
            // value={noHp}
            // onChange={(e) => setNoHp(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="Hasil" className="text-xs">
            Hasil
          </label>
          <textarea
            // type="text"
            name="Hasil"
            id="Hasil"
            className="border-gray-300 p-2 focus:outline-none border rounded my-1"
            // value={noHp}
            // onChange={(e) => setNoHp(e.target.value)}
          />
        </div>
      </form>
    </CornerModal>
  );
}
