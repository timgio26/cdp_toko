import { Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import logoSP from "./assets/android-chrome-192x192.png";
import { CiLogout } from "react-icons/ci";
import { NavLink } from "react-router";
import {
  FiChevronDown,
  FiGrid,
  FiUsers,
  FiBox,
  FiTruck,
  FiTag,
  FiActivity,
  FiX,
  FiMenu
} from "react-icons/fi";
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const token = sessionStorage.getItem("token");
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [csmOpen, setCsmOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/authentication");
  };
  return (
<div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-800">
  {/* Header */}
  <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Top Bar */}
      <div className="flex h-16 items-center justify-between">
        {/* Brand */}
        <button
          type="button"
          onClick={() => {
            navigate("/");
            setMobileMenuOpen(false);
          }}
          className="group flex items-center gap-3 rounded-lg outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-50 shadow-sm ring-1 ring-slate-200 transition group-hover:ring-slate-300">
            <img
              src={logoSP}
              alt="Setia Purindo Logo"
              className="h-9 w-9 object-contain"
            />
          </div>

          <div className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-lg font-bold tracking-tight text-slate-800">
              Setia Purindo
            </span>

            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Indonesia
            </span>
          </div>
        </button>

        {token && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden items-center gap-2 sm:flex">
              {/* CSM Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCsmOpen((prev) => !prev);
                    setInventoryOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    location.pathname.startsWith("/csm")
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <FiUsers size={17} />
                  <span>CSM</span>

                  <FiChevronDown
                    size={15}
                    className={`transition-transform ${
                      csmOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {csmOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    <NavLink
                      to="/dashboard"
                      end
                      onClick={() => setCsmOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <FiGrid size={16} />
                      <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                      to="/"
                      onClick={() => setCsmOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <FiUsers size={16} />
                      <span>Customers</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Inventory Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setInventoryOpen((prev) => !prev);
                    setCsmOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    location.pathname.startsWith("/inventory")
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <FiBox size={17} />
                  <span>Inventory</span>

                  <FiChevronDown
                    size={15}
                    className={`transition-transform ${
                      inventoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {inventoryOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    <NavLink
                      to="/inventory/dashboard"
                      end
                      onClick={() => setInventoryOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <FiGrid size={16} />
                      <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                      to="/inventory/product"
                      onClick={() => setInventoryOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <FiBox size={16} />
                      <span>Products</span>
                    </NavLink>

                    <NavLink
                      to="/inventory/supplier"
                      onClick={() => setInventoryOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <FiTruck size={16} />
                      <span>Suppliers</span>
                    </NavLink>

                    <NavLink
                      to="/inventory/category"
                      onClick={() => setInventoryOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <FiTag size={16} />
                      <span>Categories</span>
                    </NavLink>

                    <div className="my-1 border-t border-slate-100" />

                    <NavLink
                      to="/inventory/movement"
                      onClick={() => setInventoryOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <FiActivity size={16} />
                      <span>Stock Movements</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <div className="mx-1 h-6 w-px bg-slate-200" />

              <button
                type="button"
                onClick={handleLogout}
                className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <CiLogout
                  size={19}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 sm:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <FiX size={21} />
              ) : (
                <FiMenu size={21} />
              )}
            </button>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      {token && mobileMenuOpen && (
        <div className="border-t border-slate-100 py-3 sm:hidden">
          <div className="space-y-2">
            {/* CSM */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setCsmOpen((prev) => !prev);
                  setInventoryOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition ${
                  location.pathname.startsWith("/csm")
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FiUsers size={17} />
                  CSM
                </span>

                <FiChevronDown
                  size={16}
                  className={`transition-transform ${
                    csmOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {csmOpen && (
                <div className="mt-1 space-y-1 pl-3">
                  <NavLink
                    to="/dashboard"
                    end
                    onClick={() => {
                      setCsmOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        isActive
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <FiGrid size={16} />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/"
                    onClick={() => {
                      setCsmOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        isActive
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <FiUsers size={16} />
                    Customers
                  </NavLink>
                </div>
              )}
            </div>

            {/* Inventory */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setInventoryOpen((prev) => !prev);
                  setCsmOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition ${
                  location.pathname.startsWith("/inventory")
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FiBox size={17} />
                  Inventory
                </span>

                <FiChevronDown
                  size={16}
                  className={`transition-transform ${
                    inventoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {inventoryOpen && (
                <div className="mt-1 space-y-1 pl-3">
                  <NavLink
                    to="/inventory/dashbaord"
                    end
                    onClick={() => {
                      setInventoryOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        isActive
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <FiGrid size={16} />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/inventory/product"
                    onClick={() => {
                      setInventoryOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        isActive
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <FiBox size={16} />
                    Products
                  </NavLink>

                  <NavLink
                    to="/inventory/supplier"
                    onClick={() => {
                      setInventoryOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        isActive
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <FiTruck size={16} />
                    Suppliers
                  </NavLink>

                  <NavLink
                    to="/inventory/category"
                    onClick={() => {
                      setInventoryOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        isActive
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <FiTag size={16} />
                    Categories
                  </NavLink>

                  <NavLink
                    to="/inventory/movement"
                    onClick={() => {
                      setInventoryOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        isActive
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-600"
                      }`
                    }
                  >
                    <FiActivity size={16} />
                    Stock Movements
                  </NavLink>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <CiLogout size={19} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </header>

  {/* Main Content */}
  <main className="flex-1 px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
    <div className="mx-auto w-full max-w-6xl">
      <Outlet />
    </div>
  </main>

  {/* Footer */}
  <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500 sm:py-6">
    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
      <span className="font-medium tracking-wide">
        &copy; {year} Setia Purindo
      </span>

      <span className="hidden text-slate-400 sm:inline-block">
        |
      </span>

      <span className="italic">
        Crafted with care in Indonesia
      </span>
    </div>
  </footer>

  {/* Toast Notifications */}
  <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar
    closeOnClick
    pauseOnHover
    theme="light"
  />
</div>
  );
}

export default App;
