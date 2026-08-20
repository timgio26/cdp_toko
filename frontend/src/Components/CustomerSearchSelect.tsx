import { useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { useGetAllCustomer, type ICustomer } from "../utils/customerQuery";
import { useDebounce } from "../utils/utilsHook";

type CustomerSearchSelectProps = {
  value: string;
  onChange: (customer: ICustomer) => void;
  disabled?: boolean;
};

export function CustomerSearchSelect({
  value,
  onChange,
  disabled = false,
}: CustomerSearchSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    isPending,
    isError,
  } = useGetAllCustomer(1, debouncedSearch);

  const selectedCustomer = data?.data.find(
    (customer) => customer.id === value,
  );

  // --------------------------------------------------
  // Close dropdown when clicking outside
  // --------------------------------------------------

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // --------------------------------------------------
  // Select customer
  // --------------------------------------------------

  const handleSelect = (customer: ICustomer) => {
    onChange(customer);

    setSearch("");
    setOpen(false);
  };

  // --------------------------------------------------
  // Clear / change customer
  // --------------------------------------------------

  const handleClear = () => {
    setSearch("");
    setOpen(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* =================================================
          SELECTED CUSTOMER
      ================================================== */}
      {value && selectedCustomer ? (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FiUser size={15} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {selectedCustomer.name}
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-400">
                {selectedCustomer.phone || "No phone"}
                {selectedCustomer.email
                  ? ` · ${selectedCustomer.email}`
                  : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="
              ml-3
              shrink-0
              text-xs
              font-medium
              text-slate-400
              transition
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Change
          </button>
        </div>
      ) : (
        <>
          {/* =================================================
              SEARCH INPUT
          ================================================== */}
          <div className="relative">
            <FiSearch
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              disabled={disabled}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              placeholder="Search customer by name or phone..."
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                py-2.5
                pl-10
                pr-10
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-slate-400
                focus:ring-2
                focus:ring-slate-100
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />

            <FiChevronDown
              size={17}
              className={`
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
                transition
                ${open ? "rotate-180" : ""}
              `}
            />
          </div>

          {/* =================================================
              DROPDOWN
          ================================================== */}
          {open && (
            <div
              className="
                absolute
                left-0
                right-0
                top-full
                z-50
                mt-1
                overflow-hidden
                rounded-lg
                border
                border-slate-200
                bg-white
                shadow-lg
              "
            >
              {/* Initial */}
              {!search.trim() && (
                <div className="px-4 py-4 text-center text-xs text-slate-400">
                  Type at least 2 characters to search.
                </div>
              )}

              {/* Too short */}
              {search.trim().length === 1 && (
                <div className="px-4 py-4 text-center text-xs text-slate-400">
                  Type at least 2 characters to search.
                </div>
              )}

              {/* Loading */}
              {search.trim().length >= 2 && isPending && (
                <div className="flex items-center justify-center gap-2 px-4 py-4 text-xs text-slate-400">
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-slate-200
                      border-t-slate-700
                    "
                  />

                  Searching customers...
                </div>
              )}

              {/* Error */}
              {search.trim().length >= 2 &&
                isError &&
                !isPending && (
                  <div className="px-4 py-4 text-center text-xs text-red-500">
                    Unable to search customers.
                  </div>
                )}

              {/* Empty */}
              {search.trim().length >= 2 &&
                !isPending &&
                !isError &&
                data?.data.length === 0 && (
                  <div className="px-4 py-4 text-center text-xs text-slate-400">
                    No customers found.
                  </div>
                )}

              {/* Results */}
              {!isPending &&
                !isError &&
                data&&
                data.data.length > 0 && (
                  <div className="max-h-64 overflow-y-auto py-1">
                    {data?.data.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() =>
                          handleSelect(customer)
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          px-4
                          py-3
                          text-left
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <FiUser size={15} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {customer.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {customer.phone ||
                                "No phone"}

                              {customer.email
                                ? ` · ${customer.email}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        {customer.id === value && (
                          <FiCheck
                            size={17}
                            className="ml-3 shrink-0 text-blue-600"
                          />
                        )}
                      </button>
                    ))}
                    
                  </div>
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
}