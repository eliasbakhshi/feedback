import React, { useState, useEffect } from "react";
import { useAddQuestionMutation, useGetSurveyQuestionsQuery } from "../../store/api/userApiSlice";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import QuestionCard from "./components/QuestionCard";
import { LuEye,LuScanEye,LuSend, LuChartNoAxesCombined } from "react-icons/lu";

function SurveyQuestionForm({ surveyId }: { surveyId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  enum AnswerTypes {
    TRUE_FALSE = "truefalse",
    TRAFFIC_LIGHT = "trafficlight",
    FREE_TEXT = "freetext",
    SCALE = "scale"
  }
  const [answerType, setAnswerType] = useState<AnswerTypes>(AnswerTypes.TRUE_FALSE);
  const [submittedQuestions, setSubmittedQuestions] = useState< {id: number; text: string; answerType: string; answer: string | null }[] >([]);
  const [addQuestion, { isLoading }] = useAddQuestionMutation();
  const { data: existingQuestions } = useGetSurveyQuestionsQuery({ SurveyId: 1 }); /* 1 hårdkodat */

  const [localQuestions, setLocalQuestions] = useState<{ id: number; text: string; answerType: string; answer: string | null;}[]>([]); /* session */



  useEffect(() => {
    if (existingQuestions) {
        const questions = existingQuestions.map((q: any) => ({
            id: q.id,
            text: q.question,
            answerType: q.answer_type,
            answer: null,
        }));
        setSubmittedQuestions(questions);
    }
}, [existingQuestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error("Frågetexten får inte vara tom!");
      return;
    }

    const newQuestion = {
      id: Date.now(),
      text: questionText,
      answerType: answerType,
      answer: null,
      session: true,
    };

    setLocalQuestions((prev) => [...prev, newQuestion]);
    setShowForm(false);
    setQuestionText("");
  };


  const handleSaveAll = async () => {
    if (localQuestions.length === 0) {
        toast.warning("Inga frågor att spara!");
        return;
    }
    try {
        await Promise.all(localQuestions.map(async (question) => {
            await addQuestion({
                SurveyId: 1,
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

  return (
    <div className="flex h-full mr-2 ml-2 gap-4 rounded-lg">
      <div className="w-1/5 p-4 border rounded-lg shadow-md justify-center text-center bg-slate-100">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Skapa fråga
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Skriv din fråga här..."
              className="w-full p-2 border rounded-md"
            />
            <select
              value={answerType}
              onChange={(e) => setAnswerType(e.target.value as AnswerTypes)}
              className="w-full mt-2 p-2 border rounded-md">
              <option value="truefalse">Ja / Nej</option>
              <option value="trafficlight">Trafikljus (Röd/Gul/Grön)</option>
              <option value="freetext">Fritext</option>
              <option value="scale">1-5</option>
            </select>

            <div className="flex justify-between mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={isLoading}>
                Lägg till fråga
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Avbryt
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="w-4/5 p-4 border rounded-lg shadow-md h-full bg-slate-100 overflow-auto">
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
        <h2 className="text-xl font-semibold">Formulär</h2>
        <p className="mt-4">Antal frågor: {submittedQuestions.length}</p>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={[...submittedQuestions, ...localQuestions]} strategy={verticalListSortingStrategy}>
            {[...submittedQuestions, ...localQuestions].map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                handleAnswerSubmit={handleAnswerSubmit}
                handleDeleteFromSession={handleDeleteFromSession}
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