import React from "react";

function Sidebar({
  questions,
  currentIndex,
  setCurrentIndex,
  name,
  answerLoading,
}) {
  console.log(questions, currentIndex);
  return (
    <aside className="bg-white border-r p-5 flex flex-col md:sticky md:top-0 md:h-screen h-[40%]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {name || "Candidate"} 👋
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Let’s get started with your personalized interview
        </p>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1">
        {/* Step Item */}
        {questions?.map((ques, index) => {
          const disableClass =
            (index !== 0 && !ques.visited) || answerLoading
              ? "cursor-not-allowed text-gray-400"
              : "cursor-pointer hover:bg-gray-100";
          const activeClass =
            index === currentIndex
              ? "bg-purple-100 text-purple-700 font-medium hover:bg-purple-100"
              : "";
          //const iconBackgroundClass = index > currentIndex ? "bg-gray-300" : "";
          const iconClass =
            index !== 0 && !ques.visited
              ? "bg-gray-300"
              : ques.evaluated
                ? "bg-green-500"
                : ques.answer
                  ? "bg-yellow-500" // typed but not evaluated
                  : "bg-purple-600";
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg ${disableClass} ${activeClass}`}
              onClick={() => {
                if (!ques.visited) return;
                setCurrentIndex(index);
              }}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-xs ${iconClass}`}
              >
                {ques?.evaluated ? "✓" : index + 1}
              </span>
              <span>Question {index + 1}</span>
            </div>
          );
        })}
        {/* <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-xs">
            ✓
          </span>
          <span>Question 2</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg text-gray-400 cursor-not-allowed">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-xs">
            3
          </span>
          <span>Question 3</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg text-gray-400 cursor-not-allowed">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-xs">
            4
          </span>
          <span>Question 4</span>
        </div> */}
      </div>
    </aside>
  );
}

export default Sidebar;
