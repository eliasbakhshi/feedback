import React, { useState, useEffect } from "react";
import { useAddQuestionMutation, useGetSurveyQuestionsQuery } from "../../store/api/mainApiSlice";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import QuestionCard from "./components/QuestionCard";

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

    await addQuestion({
      SurveyId: 1, /* 1 hårdkodat */
      QuestionText: questionText,
      AnswerType: answerType,
    });

    setShowForm(false);
    setQuestionText("");
  };

  const handleAnswerSubmit = (id: number, answer: string) => {
    setSubmittedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer } : q))
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = submittedQuestions.findIndex((q) => q.id === active.id);
    const newIndex = submittedQuestions.findIndex((q) => q.id === over.id);

    setSubmittedQuestions((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  return (
    <div className="flex h-full mr-2 ml-2 gap-4 bg-gray-300 rounded-lg">
      <div className="w-1/5 p-4 border rounded-lg shadow-md justify-center text-center bg-gray-200">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
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
              className="w-full mt-2 p-2 border rounded-md"
            >
              <option value="truefalse">Ja / Nej</option>
              <option value="trafficlight">Trafikljus (Röd/Gul/Grön)</option>
              <option value="freetext">Fritext</option>
              <option value="scale">1-5</option>
            </select>

            <div className="flex justify-between mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={isLoading}
              >
                Lägg till fråga
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Avbryt
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="w-4/5 p-4 border rounded-lg shadow-md h-full bg-gray-200 overflow-auto">
        <h2 className="text-xl font-semibold">Formulär</h2>
        <p className="mt-4">Antal frågor: {submittedQuestions.length}</p>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={submittedQuestions} strategy={verticalListSortingStrategy}>
            {submittedQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                handleAnswerSubmit={handleAnswerSubmit}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default SurveyQuestionForm;