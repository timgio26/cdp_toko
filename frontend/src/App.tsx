import { Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import logoSP from "./assets/android-chrome-192x192.png";

function App() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 border-b border-slate-200">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logoSP} alt="Setia Purindo Logo" className="h-10 w-10 rounded-md" />
          <h1 className="text-2xl font-semibold text-indigo-700">Setia Purindo</h1>
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
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>&copy; {year} Setia Purindo</span>
          <span className="hidden sm:inline-block">|</span>
          <span>Crafted with care in Indonesia</span>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
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