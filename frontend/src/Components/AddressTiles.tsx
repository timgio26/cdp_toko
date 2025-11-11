import { CiImageOn } from "react-icons/ci";
import { Link } from "react-router";

type AddressTilesProps = {
    id:string;
    address:string;
    kategori:string;
}

export function AddressTiles(data:AddressTilesProps) {
  return (
    <div
      key={data.id}
      className="group relative bg-gradient-to-br from-white to-stone-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-5 flex flex-col justify-between"
    >
      {/* Top Icon */}
      <div className="absolute top-4 right-4 text-gray-300 group-hover:text-emerald-500 transition">
        <CiImageOn size={24} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Link
          to="/service-list"
          state={{
            id: data.id,
          }}
          className="block text-base font-semibold text-slate-800 hover:underline"
        >
          {data.address}
        </Link>
        <p className="text-sm text-gray-500">{data.kategori}</p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">🧭 Location</span>
        <button className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium px-3 py-1 rounded-full transition">
          Get Direction
        </button>
      </div>
    </div>
  );
}
