import { type ReactNode } from "react";

type CornerModalProp = {
  children: ReactNode;
  ModalTrigerIcon:ReactNode;
  submitFunction: ()=>void;
  showModal:boolean;
  setShowModal:React.Dispatch<React.SetStateAction<boolean>>
};

export function CornerModal({ children,ModalTrigerIcon,submitFunction,showModal,setShowModal}: CornerModalProp) {
  return (
    <>
      <div
        className="z-10 bg-white w-full sm:w-1/3 md:w-1/4 flex flex-col justify-around sm:justify-start rounded overflow-hidden shadow-lg p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        hidden={!showModal}
      >
        {children}
        <div className="flex flex-row gap-2 justify-end mt-3">
          <div
            className="bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded-full cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            cancel
          </div>
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer" onClick={submitFunction}>
            submit
          </div>
        </div>
      </div>
      <div
        className="z-10 fixed bottom-5 right-10 bg-blue-500 rounded-full hover:opacity-50 transition-opacity cursor-pointer aspect-square shadow"
        onClick={() => setShowModal(true)}
      >
        {ModalTrigerIcon}
      </div>
    </>
  );
}
