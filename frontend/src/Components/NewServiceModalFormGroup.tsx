import { useState } from "react";
import { CornerModal } from "./CornerModal";
import { IoIosAdd } from "react-icons/io";

export function NewServiceModalFormGroup() {
  const [showModal, setShowModal] = useState<boolean>(false);
  function handleSubmit() {}
  return (
    <CornerModal
      ModalTriggerIcon={<IoIosAdd size={45} color="white" />}
      submitFunction={handleSubmit}
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <form className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">New Service</h2>
          <p className="text-sm text-gray-500">
            Fill in the service details below.
          </p>
        </div>

        {/* Keluhan */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="Keluhan"
            className="text-sm font-medium text-gray-700"
          >
            Keluhan
          </label>
          <textarea
            name="Keluhan"
            id="Keluhan"
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition"
            placeholder="Describe the issue or complaint"
          />
        </div>

        {/* Tindakan */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="Tindakan"
            className="text-sm font-medium text-gray-700"
          >
            Tindakan
          </label>
          <textarea
            name="Tindakan"
            id="Tindakan"
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition"
            placeholder="Actions taken"
          />
        </div>

        {/* Hasil */}
        <div className="flex flex-col gap-1">
          <label htmlFor="Hasil" className="text-sm font-medium text-gray-700">
            Hasil
          </label>
          <textarea
            name="Hasil"
            id="Hasil"
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition"
            placeholder="Outcome or result"
          />
        </div>

        {/* Date Field */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="Tanggal"
            className="text-sm font-medium text-gray-700"
          >
            Tanggal
          </label>
          <input
            type="date"
            name="Tanggal"
            id="Tanggal"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </div>
      </form>
    </CornerModal>
  );
}
