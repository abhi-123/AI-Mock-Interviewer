import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useState } from "react";
import FinalResult from "./components/FinalResult";
import ProfileSetup from "./components/ProfileSetup";
import InterviewLayout from "./components/InterviewLayout";
import Loader from "./components/Loader";
import { generateQuestions } from "./api/api";
function App() {
  const [step, setStep] = useState("setup");
  const [profileData, setProfileData] = useState({
    name: "",
    role: "",
    expLevel: "",
    skills: "",
    context: "",
    questionType: "",
    isDeep: false,
  });
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateInterviewQuestions = async (data) => {
    try {
      setProfileData(data);
      setLoading(true);
      const res = await generateQuestions(data);
      console.log(res, "response");
      if (res.success) {
        setQuestions(res.data.questions);
        setStep("interview");
      }
    } catch (error) {
      toast.custom(
        () => (
          <div className="bg-[#1f1f1f] text-white px-5 py-4 rounded-2xl shadow-xl border border-white/10 w-[340px]">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <div>
                <p className="font-medium">Failed to generate questions</p>
                <p className="text-sm text-gray-400">
                  Please check your connection and try again.
                </p>
              </div>
            </div>
          </div>
        ),
        {
          duration: 3000,
        },
      );
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />
      {step == "setup" && (
        <div className="relative">
          <ProfileSetup
            onStart={(data) => generateInterviewQuestions(data)}
            savedProfileData={profileData}
          />

          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <Loader />
            </div>
          )}
        </div>
      )}

      {step == "interview" && (
        <InterviewLayout
          questions={questions}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          name={profileData?.name}
          setQuestions={setQuestions}
          savedProfileData={profileData}
          setStep={setStep}
        />
      )}
      {step == "result" && (
        <FinalResult
          questions={questions}
          setStep={setStep}
          setQuestions={setQuestions}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </>
  );
}

export default App;
