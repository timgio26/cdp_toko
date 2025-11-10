import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function PageLoading() {
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-white text-slate-600">
      <AiOutlineLoading3Quarters className="animate-spin text-4xl mb-4" />
      <p className="text-sm font-medium tracking-wide">Loading, please wait...</p>
    </div>
  );
}