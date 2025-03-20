import { useState, useEffect } from "react";
import { useAddSurveyMutation, useGetSurveysQuery, useDeleteSurveyMutation, useGetAccountInfoQuery } from "../../store/api/userApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LuTrash } from "react-icons/lu";

const UserDashboard = () => {
    const [surveys, setSurveys] = useState<{ surveyId: number; title: string; description: string; created_at: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [addSurvey] = useAddSurveyMutation();
    const [deleteSurvey] = useDeleteSurveyMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const userId = Cookies.get("userId");
    const token = Cookies.get("token");
    if (!userId || !token) {
        navigate("/login");
    }
    const { data } = useGetSurveysQuery({ userId: Number(userId), token: token  || "" });
    const { data: accountInfo } = useGetAccountInfoQuery(Number(userId));

    useEffect(() => {
        if (Array.isArray(data)) { 
            setSurveys(data.map(survey => ({
                surveyId: survey.id,
                title: survey.title,
                description: survey.description,
                created_at: survey.created_at
            })));
            setLoading(false);
        } else {
            setSurveys([]);
        }
    }, [data]);
    
    useEffect(() => {
        if (accountInfo) {
            setName(accountInfo[0].firstname + " " + accountInfo[0].lastname || "Error");
        }
    }, [accountInfo]);

    const handleCreateSurvey = async () => {
        if (title && description) {
            const response = await addSurvey({ SurveyCreator: Number(userId), SurveyName: title, SurveyDescription: description });
            console.log(response?.data);
            if (response?.data?.surveyId) {
                setSurveys([...surveys, {
                    surveyId: response.data.surveyId,
                    title, description,
                    created_at: ""
                }]);
                setIsModalOpen(false);
                setTitle("");
                setDescription("");
                navigate(`/survey-creation/${response.data.surveyId}`);
                window.location.reload()
            } else {
                toast.error("Misslyckades att skapa formulär");
            }
        } else {
            toast.error("Vänligen skriv in titel och beskrivning");
        }
    };

    const handleDeleteSurvey = async (surveyId: number) => {
        try {
            const response = await deleteSurvey({ SurveyId: surveyId });
            if (response?.data?.message === "Survey deleted successfully.") {
                setSurveys(surveys.filter(survey => survey.surveyId !== surveyId));
                toast.success("Formulär raderat");
            }
        } catch (error) {
            toast.error("Ett fel inträffade");
        }
    };

    return (
        <>
            <div className="flex justify-end bg-slate-100 p-4">
                <h1 className="text-sm text-gray-800">{name}</h1>
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
                        <p className="ml-4">Laddar formulär...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mx-4">
                            {surveys.map((survey, index) => (
                                <div key={index} className="bg-white rounded-md shadow-lg overflow-hidden">
                                    <a href={`/survey-creation/${survey.surveyId}`} className="block">
                                        <div className="h-24 bg-red-600"></div>
                                        <div className="flex justify-between items-center py-2 px-4">
                                            <h2 className="text-lg">{survey.title}</h2>
                                            <p className="text-sm text-gray-500">{new Date(survey.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </a>
                                    <div className="flex justify-end p-2">
                                        <button onClick={() => handleDeleteSurvey(survey.surveyId)} className="text-gray-700 hover:text-red-600 flex items-center pr-2">
                                            <LuTrash size={20} />
                                        </button>
                                    </div>
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
