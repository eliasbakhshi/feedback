import { useState, useEffect } from "react";
import { useAddQuestionMutation, useGetSurveyQuestionsQuery, useEditSurveyMutation, useGetSurveyInformationQuery } from "../../store/api/userApiSlice";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import QuestionCard from "./components/QuestionCard";
import SurveyHeader from "./components/SurveyCreationHeader";
import QuestionContainer from "./components/surveyQuestionContainer";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const userId = Cookies.get("userId");


function SurveyQuestionForm() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const numericSurveyId = parseInt(surveyId || "0", 10);
  const [submittedQuestions, setSubmittedQuestions] = useState< {id: number; text: string; answerType: string; answer: string | null }[] >([]);
  const [addQuestion, _] = useAddQuestionMutation();
  const { data: existingQuestions } = useGetSurveyQuestionsQuery({ SurveyId: numericSurveyId });
  const { data: surveyInfo } = useGetSurveyInformationQuery({ SurveyId: numericSurveyId, userId: parseInt(userId || "0", 10) });

  const [localQuestions, setLocalQuestions] = useState<{ id: number; text: string; answerType: string; answer: string | null;}[]>([]); /* session */

  const [editSurvey] = useEditSurveyMutation();
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");

  useEffect(() => {
    if (surveyInfo) {
        setSurveyTitle(surveyInfo.title || "Ingen titel");
        setSurveyDescription(surveyInfo.description || "Ingen beskrivning");
    }
}, [surveyInfo]);

  useEffect(() => {
    if (existingQuestions) {
        const questions = existingQuestions.map((q: any) => ({
            id: q.id,
            text: q.question,
            answerType: q.answer_type,
            answer: null,
            session: false,
        }));
        setSubmittedQuestions(questions);
    }
}, [existingQuestions]);


  const handleSaveAll = async () => {
    if (localQuestions.length === 0) {
        toast.warning("Inga frågor att spara!");
        return;
    }
    try {
        await Promise.all(localQuestions.map(async (question) => {
            await addQuestion({
                SurveyId: numericSurveyId,
                QuestionText: question.text,
                AnswerType: question.answerType,
            }).unwrap();
        }));

        toast.success("Alla frågor har sparats!");
        setLocalQuestions([]);
    } catch (error) {
        console.error("Misslyckades att spara frågor:", error);
        toast.error("Misslyckades att spara frågor.");
    }
};


  const handleAnswerSubmit = (id: number, answer: string) => {
    setSubmittedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer } : q))
    );
  };

  const handleDeleteFromSession = (id: number) => {
    setLocalQuestions((prev) => prev.filter((q) => q.id !== id));
  };  

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const submittedList = submittedQuestions || [];
    const localList = localQuestions || [];

    const allQuestions = [...submittedList, ...localList];
    const oldIndex = allQuestions.findIndex((q) => q.id === active.id);
    const newIndex = allQuestions.findIndex((q) => q.id === over.id);

    const newOrder = arrayMove(allQuestions, oldIndex, newIndex);


    setSubmittedQuestions(newOrder.filter(q => submittedQuestions.some(sq => sq.id === q.id)).map(q => ({ ...q, answer: q.answer || null })));
    setLocalQuestions(newOrder.filter(q => localQuestions.some(lq => lq.id === q.id)));
  };

  const handleSaveSurvey = async () => {
    try {
      await editSurvey({
        SurveyId: numericSurveyId,
        SurveyName: surveyTitle,
        SurveyDescription: surveyDescription,
      }).unwrap();

      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) activeElement.blur();

      toast.success("Formuläret uppdaterat!");
    } catch (error) {
      console.error("Misslyckades att uppdatera formuläret:", error);
      toast.error("Misslyckades att uppdatera formuläret.");
    }
  };

  const handleEditQuestion = (id: number, newText: string) => {
    setLocalQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: newText } : q))
    );
  };

  return (
    <div className="flex h-full mr-2 ml-2 gap-4 rounded-lg">
      < QuestionContainer setLocalQuestions={setLocalQuestions} />
      <div className="w-4/5 p-4 border rounded-lg shadow-md h-full bg-slate-100 overflow-auto">
        <SurveyHeader />
        <input
          type="text"
          value={surveyTitle}
          onChange={(e) => setSurveyTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveSurvey()}
          className="text-xl font-semibold border-b-2 border-gray-300 focus:border-red-500 outline-none w-full"
        />
        <input
          type="text"
          value={surveyDescription}
          onChange={(e) => setSurveyDescription(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveSurvey()}
          className="text-sm border-b-2 border-gray-300 focus:border-red-500 outline-none w-full"
        />
        <p className="mt-4">Antal frågor: {submittedQuestions.length}</p>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={[...submittedQuestions, ...localQuestions]} strategy={verticalListSortingStrategy}>
            {[...submittedQuestions, ...localQuestions].map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                handleAnswerSubmit={handleAnswerSubmit}
                handleDeleteFromSession={handleDeleteFromSession}
                handleEditQuestion={handleEditQuestion}
              />
            ))}
          </SortableContext>
        </DndContext>
        {localQuestions.length > 0 && (
          <button onClick={handleSaveAll} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Spara frågorna
          </button>
        )}
      </div>
    </div>
  );
}

export default SurveyQuestionForm;