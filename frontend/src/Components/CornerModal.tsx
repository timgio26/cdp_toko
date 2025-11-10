// import { useEffect } from "react";
import { type ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  ModalTriggerIcon: ReactNode;
  submitFunction: () => void;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CornerModal({
  children,
  ModalTriggerIcon,
  submitFunction,
  showModal,
  setShowModal,
}: ModalProps) {
  // useEffect(() => {
  //   const handleEsc = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") setShowModal(false);
  //   };
  //   document.addEventListener("keydown", handleEsc);
  //   return () => document.removeEventListener("keydown", handleEsc);
  // }, [setShowModal]);

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm transition-all"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-xl shadow-xl p-6 animate-fade-in">
            <div className="text-gray-800 text-base">{children}</div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={submitFunction}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-5 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:opacity-80 transition-opacity"
        aria-label="Open modal"
      >
        {ModalTriggerIcon}
      </button>
    </>
  );
}