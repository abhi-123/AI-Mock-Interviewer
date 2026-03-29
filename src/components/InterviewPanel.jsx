import { evaluateQuestion } from "../api/api";
import { useEffect } from "react";
function InterviewPanel({
  questions,
  currentIndex,
  setCurrentIndex,
  setQuestions,
  savedProfileData,
  answerLoading,
  setAnswerLoading,
  setShowEndModal,
  feedbackRef,
}) {
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (questions[currentIndex]?.evaluated) {
      console.log(feedbackRef, "feedbackref");
      feedbackRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [questions]);

  // 🔥 HANDLE MCQ SELECT
  const handleSelectOption = (option) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === currentIndex ? { ...q, selected: option } : q)),
    );
  };

  // 🔥 EVALUATE (MCQ + THEORY SPLIT)
  const handleEvaluate = async () => {
    try {
      setAnswerLoading(true);

      // 🟢 MCQ CASE (NO API CALL)
      if (currentQuestion.type === "mcq") {
        const isCorrect =
          currentQuestion.selected === currentQuestion.correctAnswer;

        setQuestions((prev) =>
          prev.map((q, i) =>
            i === currentIndex
              ? {
                  ...q,
                  evaluated: true,
                  isCorrect,
                }
              : q,
          ),
        );

        return;
      }

      // 🟣 THEORY / CODING CASE
      const res = await evaluateQuestion(currentQuestion, savedProfileData);
      const result = res.data;

      // 🔥 calculate score on frontend (consistent)
      const breakdown = result.breakdown;

      const overall =
        (breakdown.correctness +
          breakdown.clarity +
          breakdown.depth +
          breakdown.structure) /
        4;

      const finalScore = Number(overall.toFixed(1));

      setQuestions((prev) =>
        prev.map((q, i) =>
          i === currentIndex
            ? {
                ...q,
                evaluated: true,
                overall_score: finalScore,
                breakdown: result.breakdown,
                feedback: result.feedback,
                strengths: result.strengths,
                improvements: result.improvements,
                correctAnswer: result.correct_approach,
              }
            : q,
        ),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setAnswerLoading(false);
    }
  };

  return (
    <>
      {/* Question */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Question {currentIndex + 1}</h2>

          <button
            className="text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition"
            onClick={() => setShowEndModal(true)}
          >
            End Interview ❌
          </button>
        </div>

        <p className="text-gray-700">{currentQuestion?.question}</p>
      </div>

      {/* 🟢 MCQ UI */}
      {currentQuestion.type === "mcq" ? (
        <div className="bg-white p-6 rounded-2xl shadow space-y-3">
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelectOption(opt)}
              disabled={currentQuestion.evaluated}
              className={`w-full text-left p-3 rounded-lg border transition ${
                currentQuestion.selected === opt
                  ? "bg-purple-100 border-purple-400"
                  : "hover:border-purple-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        // 🟣 THEORY / CODING TEXTAREA
        <div className="bg-white p-6 rounded-2xl shadow">
          <textarea
            placeholder="Write your answer here..."
            className="w-full h-40 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            value={currentQuestion?.answer || ""}
            onChange={(e) =>
              setQuestions((prev) =>
                prev.map((q, i) =>
                  i === currentIndex ? { ...q, answer: e.target.value } : q,
                ),
              )
            }
          />
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
          onClick={() => {
            if (currentIndex === questions.length - 1) return;

            setQuestions((prev) =>
              prev.map((q, i) => {
                if (i === currentIndex) {
                  return { ...q, skipped: true, visited: true };
                }
                if (i === currentIndex + 1) {
                  return { ...q, visited: true };
                }
                return q;
              }),
            );

            setCurrentIndex((prev) => prev + 1);
          }}
          disabled={
            answerLoading ||
            currentQuestion.evaluated ||
            currentIndex === questions.length - 1
          }
        >
          Skip
        </button>

        <button
          className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50"
          onClick={handleEvaluate}
          disabled={
            answerLoading ||
            currentQuestion.evaluated ||
            (currentQuestion.type === "mcq"
              ? !currentQuestion.selected
              : !currentQuestion.answer)
          }
        >
          {answerLoading ? "Evaluating..." : "Evaluate Answer"}
        </button>
      </div>
    </>
  );
}

export default InterviewPanel;
