import React, { useState } from "react";
import { useAddQuestionMutation } from "../../store/api/mainApiSlice";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";

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
  const [submittedQuestions, setSubmittedQuestions] = useState<
    { id: number; text: string; answerType: string; answer: string | null }[]
  >([]);
  const [addQuestion, { isLoading }] = useAddQuestionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error("Frågetexten får inte vara tom!");
      return;
    }

    await addQuestion({
      SurveyId: surveyId,
      QuestionText: questionText,
      AnswerType: answerType,
    });

    setSubmittedQuestions((prev) => [
      ...prev,
      { id: prev.length + 1, text: questionText, answerType, answer: null },
    ]);

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
    <div className="flex h-full mr-2 ml-2 mt-2 gap-4 bg-gray-300 rounded-lg">
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

      <div className="w-4/5 p-4 border rounded-lg shadow-md h-full bg-gray-200">
        <h2 className="text-xl font-semibold">Formulär</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={submittedQuestions} strategy={verticalListSortingStrategy}>
            {submittedQuestions.map((question) => (
              <SortableQuestion
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

const SortableQuestion = ({
  question,
  handleAnswerSubmit,
}: {
  question: { id: number; text: string; answerType: string; answer: string | null };
  handleAnswerSubmit: (id: number, answer: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative mt-2 p-4 border rounded-lg bg-gray-100 shadow-sm"
    >
      <div
        {...listeners}
        {...attributes}
        className="text-2xl absolute top-2 right-2 cursor-grab opacity-60 hover:opacity-100"
      >
        ≡
      </div>

      <p className="font-semibold">{question.text}</p>

      {question.answerType === "truefalse" ? (
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => handleAnswerSubmit(question.id, "Ja")}
            className={`px-4 py-2 rounded-md ${
              question.answer === "Ja" ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600 opacity-60 hover:opacity-100"
            }`}
          >
            Ja
          </button>
          <button
            onClick={() => handleAnswerSubmit(question.id, "Nej")}
            className={`px-4 py-2 rounded-md ${
              question.answer === "Nej" ? "bg-red-600 text-white" : "bg-red-500 text-white hover:bg-red-600 opacity-60 hover:opacity-100"
            }`}
          >
            Nej
          </button>
        </div>
      ) : question.answerType === "trafficlight" ? (
        <div className="flex gap-4 mt-2">
          {["Röd", "Gul", "Grön"].map((color) => (
            <label key={color} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`traffic-${question.id}`}
                value={color}
                checked={question.answer === color}
                onChange={() => handleAnswerSubmit(question.id, color)}
                className="hidden"
              />
              <span
                className={`px-4 py-2 rounded-md ${
                  color === "Röd" ? "bg-red-500" : color === "Gul" ? "bg-yellow-500" : "bg-green-500"
                } ${question.answer === color ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              >
                {color}
              </span>
            </label>
          ))}
        </div>
      ) : question.answerType === "freetext" ? (
        <div className="mt-2">
          <textarea
            value={question.answer || ""}
            onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Skriv ditt svar här..."
          />
        </div>
      ) : question.answerType === "scale" ? (
        <div className="flex gap-4 mt-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`scale-${question.id}`}
                value={num}
                checked={question.answer === num.toString()}
                onChange={() => handleAnswerSubmit(question.id, num.toString())}
                className="hidden"
              />
              <span
                className={`px-4 py-2 rounded-md ${
                  question.answer === num.toString() ? "bg-red-600 text-white" : "bg-red-500 text-white hover:bg-red-600 opacity-60 hover:opacity-100"
                }`}
              >
                {num}
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SurveyQuestionForm;
