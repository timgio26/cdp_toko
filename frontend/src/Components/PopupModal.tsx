import { IoIosCloseCircleOutline } from "react-icons/io";

import { type ReactNode } from "react";

type PopupModalProp = {
    visible:boolean;
    setVisible:React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm:()=>void;
    confirmText:string;
    children:ReactNode;
}

export function PopupModal({visible,setVisible,onConfirm,confirmText,children}:PopupModalProp) {
  return (
    <div className="z-10 bg-white max-w-sm rounded overflow-hidden shadow-lg p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" hidden={!visible}>
      {children}
      <div className="flex justify-center my-3">

      <IoIosCloseCircleOutline size={70} color="red"/>
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <div
          className="bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded-full cursor-pointer"
          onClick={()=>setVisible(false)}
          
        >
          cancel
        </div>
        <div className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={()=>onConfirm()} data-testid = "confirmButton">
          {confirmText}
        </div>
      </div>
    </div>
  );
}
