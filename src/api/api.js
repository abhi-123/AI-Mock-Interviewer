const baseURl = "https://ai-mock-interviewer-354v.onrender.com";
//const baseURl = "http://127.0.0.1:8000";
export const generateQuestions = async (data) => {
  const response = await fetch(baseURl + "/generate-questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // console.log(response);
  if (!response.ok) {
    throw new Error("Failed to generate questions");
  }

  const res = await response.json();
  return res;
};

export const evaluateQuestion = async (currentQuestion, profileData) => {
  const response = await fetch(baseURl + "/evaluate-answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: currentQuestion.question,
      answer: currentQuestion.answer,
      role: profileData.role,
      expLevel: profileData.expLevel,
    }),
  });

  const data = await response.json();
  return data;
};
