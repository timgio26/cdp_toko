import { Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import logoSP from "./assets/android-chrome-192x192.png";
import { CiLogout } from "react-icons/ci";

function App() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/authentication");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 rounded-lg outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200 shadow-sm transition group-hover:ring-slate-300">
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

          {/* Navigation + Actions */}
          <div className="flex items-center gap-2">
            {token && (
              <>
                {/* Dashboard */}
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <span>Dashboard</span>
                </button>

                {/* Divider */}
                <div className="mx-1 h-6 w-px bg-slate-200" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <CiLogout
                    size={19}
                    className="transition-transform group-hover:-translate-x-0.5"
                  />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <span className="font-medium tracking-wide">
            &copy; {year} Setia Purindo
          </span>
          <span className="hidden sm:inline-block text-slate-400">|</span>
          <span className="italic">Crafted with care in Indonesia</span>
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
