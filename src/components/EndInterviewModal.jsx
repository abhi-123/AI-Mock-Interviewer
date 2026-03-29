export default function EndInterviewModal({
  onClose,
  onConfirm,
  attempted,
  total,
}) {
  const isComplete = attempted === total;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-5 animate-fade-in">
        {/* Title */}
        {!isComplete && (
          <>
            <h2 className="text-lg font-semibold text-gray-800">
              End Interview?
            </h2>

            {/* Info */}
            <p className="text-sm text-gray-600">
              You have completed{" "}
              <span className="font-semibold">{attempted}</span> out of{" "}
              <span className="font-semibold">{total}</span> questions.
            </p>

            <p className="text-sm text-gray-500">
              You can continue anytime or end now and view your results.
            </p>
          </>
        )}
        {isComplete && (
          <>
            <h2 className="text-lg font-semibold text-gray-800">
              🎉 Interview Completed!
            </h2>

            <p className="text-sm text-gray-600">
              Great job completing the full interview.
            </p>

            <p className="text-sm text-gray-500">
              Let’s review your performance and insights.
            </p>
          </>
        )}
        {/* Buttons */}
        {isComplete ? (
          <div className="flex justify-end">
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              View Results 🚀
            </button>
          </div>
        ) : (
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              Continue
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              End & View Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
