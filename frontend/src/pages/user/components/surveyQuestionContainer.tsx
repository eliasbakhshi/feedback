import React, { useState } from "react";
import { toast } from "react-toastify";

interface QuestionContainerProps {
  setLocalQuestions: React.Dispatch<React.SetStateAction<{ id: number; text: string; answerType: string; answer: string | null }[]>>;
}

const QuestionContainer = ({ setLocalQuestions }: QuestionContainerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  enum AnswerTypes {
    TRUE_FALSE = "truefalse",
    TRAFFIC_LIGHT = "trafficlight",
    FREE_TEXT = "freetext",
    SCALE = "scale",
  }
  const [answerType, setAnswerType] = useState<AnswerTypes>(AnswerTypes.TRUE_FALSE);
  const [isLoading] = useState(false);

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
    };

    setLocalQuestions((prev) => [...prev, newQuestion]);
    setShowForm(false);
    setQuestionText("");
  };

  return (
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
  );
};

export default QuestionContainer;