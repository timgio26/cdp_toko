import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiSearch } from "react-icons/fi";
import { useProducts } from "../utils/inventoryQuery";
import { useDebounce } from "../utils/utilsHook";

type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
};

type ProductSearchSelectProps = {
  value: string;
  onChange: (productId: string) => void;
  disabled?: boolean;
};

export function ProductSearchSelect({
  value,
  onChange,
  disabled = false,
}: ProductSearchSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  const {
    products,
    isPending,
    isError,
  } = useProducts(1,10,debouncedSearch);

//   const products: Product[] = data?.items ?? [];

  const selectedProduct = products.find(
    (product) => product.id === value,
  );

  // Close dropdown when clicking outside.
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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (product: Product) => {
    onChange(product.id);
    setSearch("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setSearch("");
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Selected product */}
      {value && selectedProduct ? (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {selectedProduct.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {selectedProduct.sku} · {selectedProduct.quantity}{" "}
              {selectedProduct.unit} in stock
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="ml-3 text-xs font-medium text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          {/* Search input */}
          <div className="relative">
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
              placeholder="Search product or SKU..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

            <FiChevronDown
              size={17}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {/* Initial state */}
              {!search.trim() && (
                <div className="px-4 py-4 text-center text-xs text-slate-400">
                  Type at least 2 characters to search.
                </div>
              )}

              {/* Loading */}
              {search.trim().length >= 2 && isPending && (
                <div className="flex items-center justify-center gap-2 px-4 py-4 text-xs text-slate-400">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
                  Searching products...
                </div>
              )}

              {/* Error */}
              {search.trim().length >= 2 && isError && !isPending && (
                <div className="px-4 py-4 text-center text-xs text-red-500">
                  Unable to search products.
                </div>
              )}

              {/* Empty */}
              {search.trim().length >= 2 &&
                !isPending &&
                !isError &&
                products.length === 0 && (
                  <div className="px-4 py-4 text-center text-xs text-slate-400">
                    No products found.
                  </div>
                )}

              {/* Results */}
              {!isPending &&
                !isError &&
                products.length > 0 && (
                  <div className="max-h-64 overflow-y-auto py-1">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelect(product)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {product.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {product.sku} · {product.quantity}{" "}
                            {product.unit} in stock
                          </p>
                        </div>

                        {product.id === value && (
                          <FiCheck
                            size={17}
                            className="ml-3 shrink-0 text-slate-700"
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