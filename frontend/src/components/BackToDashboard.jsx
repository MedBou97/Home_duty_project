import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function BackToDashboard() {
  const nav = useNavigate();

  return (
    <div className="flex justify-end mb-4">
      <button
        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100"
        onClick={() => nav("/dashboard")}
      >
        <MdArrowBackIos className="inline-block text-red-600 mr-1 mb-0.5" />
        Dashboard
      </button>
    </div>
  );
}
