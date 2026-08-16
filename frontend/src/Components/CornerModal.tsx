import { useEffect } from "react";
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
  useEffect(() => {
    if (!showModal) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showModal, setShowModal]);

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="
              w-full max-w-md
              overflow-hidden
              rounded-2xl
              border border-slate-200/80
              bg-white
              shadow-2xl shadow-slate-900/20
              animate-in fade-in zoom-in-95 duration-200
            "
          >
            {/* Content */}
            <div className="px-6 py-6 text-slate-800">
              {children}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="
                  rounded-lg
                  border border-slate-200
                  bg-white
                  px-4 py-2
                  text-sm font-medium text-slate-700
                  shadow-sm
                  transition-all
                  hover:border-slate-300
                  hover:bg-slate-50
                  active:scale-[0.98]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-slate-400/40
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitFunction}
                className="
                  rounded-lg
                  bg-blue-600
                  px-4 py-2
                  text-sm font-semibold text-white
                  shadow-sm shadow-blue-600/20
                  transition-all
                  hover:bg-blue-700
                  hover:shadow-md hover:shadow-blue-600/25
                  active:scale-[0.98]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/50
                  focus:ring-offset-2
                "
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        aria-label="Open modal"
        className="
          fixed
          bottom-6 right-6
          z-40
          flex h-14 w-14
          items-center justify-center
          rounded-full
          bg-blue-600
          text-white
          shadow-lg shadow-blue-600/25
          ring-1 ring-blue-500/20
          transition-all duration-200
          hover:-translate-y-1
          hover:bg-blue-700
          hover:shadow-xl hover:shadow-blue-600/30
          active:translate-y-0
          active:scale-95
          focus:outline-none
          focus:ring-4
          focus:ring-blue-500/30
        "
      >
        {ModalTriggerIcon}
      </button>
    </>
  );
}