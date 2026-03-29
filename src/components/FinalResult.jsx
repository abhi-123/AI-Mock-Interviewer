import React from "react";

function FinalResult({
  questions,
  setStep,
  setQuestions,
  setCurrentIndex,
  setProfileData,
}) {
  const total = questions.length;
  const attempted = questions.filter((q) => q.evaluated);

  // 🧠 DETECT TYPE
  const type = questions[0]?.type; // mcq | theory | coding

  // 🟢 MCQ LOGIC
  const mcqQuestions = attempted.filter((q) => q.type === "mcq");
  const correctMCQ = mcqQuestions.filter((q) => q.isCorrect).length;

  // 🟣 THEORY / CODING LOGIC
  const theoryQuestions = attempted.filter((q) => q.breakdown);

  const totalScore = theoryQuestions.reduce(
    (acc, q) => acc + (q.overall_score || 0),
    0,
  );

  const avgScore =
    theoryQuestions.length > 0
      ? Number((totalScore / theoryQuestions.length).toFixed(1))
      : 0;

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  // 🧠 PERFORMANCE LABEL
  const getPerformance = () => {
    if (type === "mcq") {
      const percent = (correctMCQ / total) * 100;
      if (percent >= 80) return "🔥 Strong";
      if (percent >= 50) return "👍 Average";
      return "⚠️ Needs Improvement";
    } else {
      if (avgScore >= 8) return "🔥 Strong";
      if (avgScore >= 5) return "👍 Average";
      return "⚠️ Needs Improvement";
    }
  };

  const resetInterview = () => {
    setStep("setup");
    setQuestions([]);
    setCurrentIndex(0);
    setProfileData({
      name: "",
      role: "",
      expLevel: "",
      skills: "",
      context: "",
      questionType: "",
      isDeep: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h1 className="text-2xl font-bold mb-2">🎉 Interview Summary</h1>
          <p className="text-gray-500">
            Here’s a quick snapshot of your performance
          </p>
        </div>

        {/* 🟢 MCQ VIEW */}
        {type === "mcq" ? (
          <>
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              <p className="text-sm text-gray-500">Score</p>
              <h2 className={`text-4xl font-bold ${getScoreColor(correctMCQ)}`}>
                {correctMCQ}/{total}
              </h2>
              <p className="mt-2 text-gray-600">{getPerformance()}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3">📊 Breakdown</h3>
              <p className="text-gray-700">
                You answered <span className="font-semibold">{correctMCQ}</span>{" "}
                correctly out of <span className="font-semibold">{total}</span>{" "}
                questions.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* 🟣 THEORY / CODING VIEW */}
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              <p className="text-sm text-gray-500">Overall Score</p>
              <h2 className="text-4xl font-bold text-purple-600">
                {avgScore}/10
              </h2>
              <p className="mt-2 text-gray-600">{getPerformance()}</p>
            </div>

            {/* STRENGTHS & IMPROVEMENTS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                <h3 className="font-semibold text-green-700 mb-2">
                  ✅ Strengths
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  {questions
                    .filter((q) => q.strengths)
                    .slice(0, 3)
                    .map((q, i) => (
                      <li key={i}>• {q.strengths}</li>
                    ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
                <h3 className="font-semibold text-yellow-700 mb-2">
                  ⚠️ Improvements
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {questions
                    .filter((q) => q.improvements)
                    .slice(0, 3)
                    .map((q, i) => (
                      <li key={i}>• {q.improvements}</li>
                    ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* COMMON STATS */}
        <div className="bg-white p-4 rounded-xl shadow text-center">
          {/* <p className="text-sm text-gray-500">Attempted</p> */}
          <p className="text-xl font-bold">
            You attempted {attempted.length}/{total} questions
          </p>
        </div>

        {/* ACTION */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
            onClick={resetInterview}
          >
            🚀 Ready for another challenge? Start a New Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinalResult;
