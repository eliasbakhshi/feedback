import { LuEye,LuScanEye,LuSend, LuChartNoAxesCombined  } from "react-icons/lu";

const SurveyHeader = () => {
    return (
        <div className="flex justify-end gap-6 mt-2 mr-6">
        <button className="px-4 py-2 text-gray-700 text-sm flex items-center hover:text-gray-900 group">
          <LuEye className="mr-2 group-hover:hidden" />
          <LuScanEye className="mr-2 hidden group-hover:block" /> Förhandsvisning
        </button>
        <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-full flex items-center hover:bg-red-600 ">
          <LuSend className="mr-2" />
          Dela
        </button>
        <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-full flex items-center hover:bg-red-600 ">
          <LuChartNoAxesCombined className="mr-2" />
          Resultat
        </button>
      </div>
    );
}

export default SurveyHeader;