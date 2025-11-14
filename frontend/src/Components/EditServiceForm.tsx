import { useState } from "react";
import { useEditService, type IService } from "../utils/customerQuery";

type EditServiceFormProp = {
    data:IService;
    setModalVisibility:React.Dispatch<React.SetStateAction<boolean>>
}

export function EditServiceForm({data,setModalVisibility}:EditServiceFormProp) {
    const {complaint,action_taken,result,service_date} = data
    const [serviceDateEdit,setServiceDateEdit] = useState<string>(service_date)
    const [complaintEdit,setComplaintEdit] = useState<string|undefined|null>(complaint)
    const [actionEdit,setActionEdit] = useState<string>(action_taken)
    const [resultEdit,setResultEdit] = useState<string|undefined|null>(result)
    const {mutate:editService,isPending} = useEditService()

    function handleSubmit(){
        // console.log("submit edit")
        editService({id:data.id,complaint:complaintEdit,action_taken:actionEdit,result:resultEdit,service_date:serviceDateEdit},
            {
                onSuccess:()=>{
                    setModalVisibility(false)
                }
            })
    }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Edit Service</h2>
        <p className="text-sm text-gray-500">
          Fill in the service details below.
        </p>
      </div>

      {/* Keluhan */}
      <div className="flex flex-col gap-1">
        <label htmlFor="Keluhan" className="text-sm font-medium text-gray-700">
          Keluhan
        </label>
        <textarea
          name="Keluhan"
          id="Keluhan"
          rows={3}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition"
          placeholder="Describe the issue or complaint"
          value={complaintEdit??undefined}
          onChange={(e) => setComplaintEdit(e.target.value)}
          // contentEditable={!isPending}
        />
      </div>

      {/* Tindakan */}
      <div className="flex flex-col gap-1">
        <label htmlFor="Tindakan" className="text-sm font-medium text-gray-700">
          Tindakan
        </label>
        <textarea
          name="Tindakan"
          id="Tindakan"
          rows={3}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition"
          placeholder="Actions taken"
          value={actionEdit}
          onChange={(e) => setActionEdit(e.target.value)}
          // contentEditable={!isPending}
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
          value={resultEdit??undefined}
          onChange={(e) => setResultEdit(e.target.value)}
          // contentEditable={!isPending}
        />
      </div>

      {/* Date Field */}
      <div className="flex flex-col gap-1">
        <label htmlFor="Tanggal" className="text-sm font-medium text-gray-700">
          Tanggal
        </label>
        <input
          type="date"
          name="Tanggal"
          id="Tanggal"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition"
          defaultValue={serviceDateEdit}
          onChange={(e) => setServiceDateEdit(e.target.value)}
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
          onClick={handleSubmit}
          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {isPending?"Loading..":"Submit"}
        </button>
      </div>
    </div>
  );
}
