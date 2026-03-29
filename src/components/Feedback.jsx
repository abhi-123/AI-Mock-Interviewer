function Feedback({
  data,
  answerLoading,
  currentIndex,
  setCurrentIndex,
  questions,
  setQuestions,
  setShowEndModal,
}) {
  if (!data?.evaluated) return null;

  const isMCQ = data.type === "mcq";

  // 🟣 THEORY SCORE CALC
  let finalScore = null;

  if (!isMCQ && data.breakdown) {
    const { correctness, clarity, depth, structure } = data.breakdown;

    const overall = (correctness + clarity + depth + structure) / 4;

    finalScore = Number(overall.toFixed(1));
  }

  const getColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const getBar = (score) => `${score * 10}%`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">📊 AI Feedback</h3>

        {/* 🟢 MCQ SCORE */}
        {isMCQ ? (
          <div
            className={`text-xl font-bold ${
              data.isCorrect ? "text-green-600" : "text-red-500"
            }`}
          >
            {data.isCorrect ? "Correct ✅" : "Incorrect ❌"}
          </div>
        ) : (
          // 🟣 THEORY SCORE
          <div className="text-2xl font-bold text-purple-600">
            {finalScore}/10
          </div>
        )}
      </div>

      {/* 🟢 MCQ FEEDBACK */}
      {isMCQ ? (
        <div
          className={`p-4 rounded-xl ${
            data.isCorrect
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {data.isCorrect ? "✅ Correct Answer!" : "❌ Incorrect Answer"}

          {!data.isCorrect && (
            <p className="mt-2 text-sm">Correct Answer: {data.correctAnswer}</p>
          )}

          {data.explanation && (
            <p className="mt-2 text-sm">{data.explanation}</p>
          )}
        </div>
      ) : (
        <>
          {/* 🟣 THEORY FEEDBACK TEXT */}
          <p className="text-gray-700 leading-relaxed">{data.feedback}</p>

          {/* SCORE BREAKDOWN */}
          <div className="space-y-3">
            {Object.entries(data.breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-600">{key}</span>
                  <span className={`font-semibold ${getColor(value)}`}>
                    {value}/10
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: getBar(value) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {data.strengths && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <p className="font-medium text-green-700 mb-1">✅ Strengths</p>
              <p className="text-sm text-green-800">{data.strengths}</p>
            </div>
          )}

          {/* Improvements */}
          {data.improvements && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <p className="font-medium text-yellow-700 mb-1">
                ⚠️ Improvements
              </p>
              <p className="text-sm text-yellow-800">{data.improvements}</p>
            </div>
          )}

          {/* Ideal Answer */}
          {data.correctAnswer && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="font-medium text-blue-700 mb-1">💡 Ideal Answer</p>
              <p className="text-sm text-blue-800">{data.correctAnswer}</p>
            </div>
          )}
        </>
      )}

      {/* NEXT BUTTON */}
      <div className="flex justify-end">
        <button
          className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50"
          onClick={() => {
            if (currentIndex === questions.length - 1) {
              setShowEndModal(true);
              return;
            }

            setQuestions((prev) =>
              prev.map((q, i) => {
                if (i === currentIndex) {
                  return { ...q, visited: true };
                }

                if (i === currentIndex + 1) {
                  return { ...q, visited: true };
                }

                return q;
              }),
            );

            setCurrentIndex((prev) => prev + 1);
          }}
          disabled={answerLoading && !data.evaluated}
        >
          {currentIndex === questions.length - 1
            ? "Submit Quiz"
            : "Next Question →"}
        </button>
      </div>
    </div>
  );
}

export default Feedback;
