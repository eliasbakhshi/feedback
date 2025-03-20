import {useDeleteQuestionMutation} from "../../../store/api/userApiSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import { LuTrash2 } from "react-icons/lu";

const QuestionCard = ({
    question,
    handleAnswerSubmit,
    handleDeleteFromSession,
  }: {
    question: { id: number; text: string; answerType: string; answer: string | null; session?: boolean };
    handleAnswerSubmit: (id: number, answer: string) => void;
    handleDeleteFromSession: (id: number) => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    const [deleteQuestion] = useDeleteQuestionMutation();
  
    const handleDeleteQuestion = async () => {
        if (question.session) {
            handleDeleteFromSession(question.id);
            return;
        }
        try {
            await deleteQuestion({ QuestionId: question.id }).unwrap();
        } catch (error) {
            toast.error("Något fel har inträffats");
        }
    };
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative mt-2 p-4 border rounded-lg bg-gray-100 shadow-sm">
        <div {...listeners} {...attributes} className="text-2xl absolute top-2 right-2 cursor-grab opacity-60 hover:opacity-100"> ≡ </div>
        <div
          className="text-2xl absolute bottom-2 right-2 opacity-60 hover:opacity-100 cursor-pointer"
          onClick={handleDeleteQuestion}> <LuTrash2 /> </div>
  
        <p className="font-semibold">{question.text}</p>
  
        {question.answerType === "truefalse" ? (
          <div className="flex gap-4 mt-2">
            <button onClick={() => handleAnswerSubmit(question.id, "Ja")}
              className={`px-4 py-2 rounded-md ${
                question.answer === "Ja" ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600 opacity-60 hover:opacity-100"
              }`}
            >
              Ja
            </button>
            <button onClick={() => handleAnswerSubmit(question.id, "Nej")}
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
                  value={color}
                  checked={question.answer === color}
                  onChange={() => handleAnswerSubmit(question.id, color)}
                  className="hidden"
                />
                <span className={`px-4 py-2 rounded-md ${
                    color === "Röd" ? "bg-red-500" : color === "Gul" ? "bg-yellow-500" : "bg-green-500"
                  } ${question.answer === color ? "opacity-100" : "opacity-60 hover:opacity-100"}`}>
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
              className="w-9/10 p-2 border rounded-md"
              placeholder="Skriv ditt svar här..."
            />
          </div>
        ) : question.answerType === "scale" ? (
          <div className="flex gap-4 mt-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={num}
                  checked={question.answer === num.toString()}
                  onChange={() => handleAnswerSubmit(question.id, num.toString())}
                  className="hidden"
                />
                <span className={`px-4 py-2 rounded-md ${
                    question.answer === num.toString() ? "bg-red-600 text-white" : "bg-red-500 text-white hover:bg-red-600 opacity-60 hover:opacity-100"
                  }`}>
                  {num}
                </span>
              </label>
            ))}
          </div>
        ) : null}
      </div>
    );
  };
  
export default QuestionCard;