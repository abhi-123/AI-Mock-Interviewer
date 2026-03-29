import React, { useState } from "react";
import Feedback from "./Feedback";
import Sidebar from "./Sidebar";
import InterviewPanel from "./InterviewPanel";
import NextSubmit from "./NextSubmit";
import EndInterviewModal from "./EndInterviewModal";
function InterviewLayout({
  questions,
  currentIndex,
  setCurrentIndex,
  name,
  setQuestions,
  savedProfileData,
  setStep,
}) {
  const [answerLoading, setAnswerLoading] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  return (
    <div className="flex flex-col md:grid md:grid-cols-[260px_1fr] h-screen bg-gray-100">
      {/* 🔹 Sidebar */}
      <Sidebar
        questions={questions}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        name={name}
        answerLoading={answerLoading}
      />
      {/* 🔹 Main Content */}
      <main className="p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <InterviewPanel
            questions={questions}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setQuestions={setQuestions}
            savedProfileData={savedProfileData}
            answerLoading={answerLoading}
            setAnswerLoading={setAnswerLoading}
            setShowEndModal={setShowEndModal}
          />
          {/* Feedback */}
          <Feedback
            data={questions[currentIndex]}
            answerLoading={answerLoading}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            questions={questions}
            setQuestions={setQuestions}
            setShowEndModal={setShowEndModal}
          />
          {/* <NextSubmit /> */}
          {showEndModal && (
            <EndInterviewModal
              attempted={questions.filter((q) => q.evaluated).length}
              total={questions.length}
              onClose={() => setShowEndModal(false)}
              onConfirm={() => {
                setShowEndModal(false);
                setStep("result");
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default InterviewLayout;
