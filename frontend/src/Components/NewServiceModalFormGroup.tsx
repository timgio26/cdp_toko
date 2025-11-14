import { useState } from "react";
import { CornerModal } from "./CornerModal";
import { IoIosAdd } from "react-icons/io";
import { get_today_date } from "../utils/myfunction";
import { useCreateNewService } from "../utils/customerQuery";

type NewServiceModalFormGroupProp = {
  address_id:string
}

export function NewServiceModalFormGroup({address_id}:NewServiceModalFormGroupProp) {
  const {CreateNewService,isPending} = useCreateNewService()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [serviceDate,setServiceDate] = useState<string>(get_today_date())
  const [complaint,setComplaint] = useState<string>("")
  const [action,setAction] = useState<string>("")
  const [result,setResult] = useState<string>("")

  function handleSubmit() {
    CreateNewService({address_id,service_date:serviceDate,complaint,action_taken:action,result},{
      onSuccess:()=>{
        setShowModal(false)
        setComplaint("")
        setAction("")
        setResult("")
        setServiceDate(get_today_date())
      }
    })
  }
  
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
            value={complaint}
            onChange={(e)=>setComplaint(e.target.value)}
            contentEditable={!isPending}
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
            value={action}
            onChange={(e)=>setAction(e.target.value)}
            contentEditable={!isPending}
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
            value={result}
            onChange={(e)=>setResult(e.target.value)}
            contentEditable={!isPending}
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
            defaultValue={serviceDate}
            onChange={(e)=>setServiceDate(e.target.value)}
          />
        </div>
      </form>
    </CornerModal>
  );
}
