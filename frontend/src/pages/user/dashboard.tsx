import { useState, useEffect } from "react";
import { useAddSurveyMutation, useGetSurveysQuery } from "../../store/api/userApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const UserDashboard = () => {
    const [surveys, setSurveys] = useState<{ title: string; description: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [addSurvey] = useAddSurveyMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const userId = Cookies.get("userId");
    if (!userId) {
        navigate("/login");
    }
    const { data } = useGetSurveysQuery({ userId: Number(userId) });

    useEffect(() => {
        if (Array.isArray(data)) { 
            setSurveys(data);
            setLoading(false);
        } else {
            setSurveys([]);
        }
    }, [data]);
    

    const handleCreateSurvey = async () => {
        if (title && description) {
            const response = await addSurvey({ SurveyCreator: Number(userId), SurveyName: title, SurveyDescription: description });
            console.log(response?.data);
            if (response?.data?.surveyId) {
                setSurveys([...surveys, { title, description }]);
                setIsModalOpen(false);
                setTitle("");
                setDescription("");
                navigate(`/survey-creation/${response.data.surveyId}`);
            } else {
                toast.error("Misslyckades att skapa formulär");
            }
        } else {
            toast.error("Vänligen skriv in titel och beskrivning");
        }
    };

    return (
        <>
            <div className="flex justify-end bg-slate-100 p-4">
                <h1 className="text-sm text-gray-800">Andy gud</h1>
            </div>
            <div className="w-full h-full">
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-red-500 text-white rounded-md mt-4 ml-4 hover:bg-red-600">
                    Skapa formulär
                </button>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-slate-100 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4 text-center">Skapa ett nytt formulär</h2>
                            <input
                                type="text"
                                placeholder="Titel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <textarea
                                placeholder="Beskrivning"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                                    Avbryt
                                </button>
                                <button onClick={handleCreateSurvey} className="px-4 py-2 bg-red-500 text-white rounded-md">
                                    Skapa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-4">
                    {loading ? (
                        <p>Loading surveys...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mx-4">
                            {surveys.map((survey, index) => (
                                <div key={index} className="bg-white rounded-md shadow-lg overflow-hidden">
                                    <div className="h-20 bg-red-600"></div>
                                    <h2 className="text-lg py-2 pl-2">{survey.title}</h2>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserDashboard;
