import React, { useState } from "react";

function ProfileSetup({ onStart, savedProfileData }) {
  const [profileData, setProfileData] = useState(savedProfileData);
  const [error, setError] = useState({
    name: false,
    expLevel: false,
    role: false,
    questionType: false,
  });

  const handleChange = (e) => {
    console.log(e.target.checked);
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setError((prev) => ({
      ...prev,
      [name]: value.trim() === "",
    }));
  };

  const validate = () => {
    const newErrors = {
      name: profileData.name.trim() === "",
      expLevel: profileData.expLevel.trim() === "",
      role: profileData.role.trim() === "",
      questionType: profileData.questionType.trim() === "",
    };

    setError(newErrors);

    return Object.values(newErrors).some(Boolean);
  };
  console.log(savedProfileData, "savedProfileData");
  const handleProfileSubmit = () => {
    const hasError = validate();
    if (hasError) return;
    onStart(profileData);
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">🧠 AI Mock Interview</h1>
          <p className="text-gray-500 text-sm">
            Get personalized interview questions based on your profile
          </p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="mb-1 text-sm font-semibold text-gray-700">
            <span className="text-red-500 mr-1">*</span>
            Your Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {error.name && (
            <p className="flex items-center gap-2 text-sm text-red-500 mt-1">
              <span>⚠️</span>
              <span>Name is required</span>
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="mb-1 text-sm font-semibold text-gray-700">
            <span className="text-red-500 mr-1">*</span>
            Role
          </label>
          <input
            type="text"
            placeholder="e.g. Frontend Developer, Backend Developer"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
            name="role"
            value={profileData.role}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {error.role && (
            <p className="flex items-center gap-2 text-sm text-red-500 mt-1">
              <span>⚠️</span>
              <span>Role is required</span>
            </p>
          )}
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <label className="mb-1 text-sm font-semibold text-gray-700">
            <span className="text-red-500 mr-1">*</span>
            Experience Level
          </label>
          <div className="relative">
            <select
              className="w-full p-3 pr-10 border rounded-xl outline-none appearance-none focus:ring-2 focus:ring-purple-400"
              name="expLevel"
              value={profileData.expLevel}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
            {/* Custom Caret */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              ▼
            </span>
          </div>

          {error.expLevel && (
            <p className="flex items-center gap-2 text-sm text-red-500 mt-1">
              <span>⚠️</span>
              <span>Experience Level is required</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            <span className="text-red-500 mr-1">*</span>Question Type (Choose
            one)
          </label>

          <div className="grid grid-cols-3 gap-3">
            {["MCQ", "Theory", "Coding"].map((type) => (
              <button
                key={type}
                className={`p-3 rounded-xl border text-sm font-medium transition ${
                  profileData.questionType === type
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 hover:border-purple-400"
                }`}
                onClick={() =>
                  setProfileData((prev) => {
                    return {
                      ...prev,
                      questionType: type,
                    };
                  })
                }
              >
                {type}
              </button>
            ))}
          </div>
          {error.questionType && (
            <p className="flex items-center gap-2 text-sm text-red-500 mt-1">
              <span>⚠️</span>
              <span>Question type is required</span>
            </p>
          )}
        </div>

        {/* Skill */}
        <div className="space-y-2">
          <label className="mb-1 text-sm font-semibold text-gray-700">
            Skills (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. React, Javascript, Node.js"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
            name="skills"
            value={profileData.skills}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* Optional Context */}
        <div className="space-y-1">
          <label className="mb-1 text-sm font-semibold text-gray-700">
            Want specific topics? (optional)
          </label>
          <textarea
            placeholder="e.g. Ask more questions on React useEffect, performance optimization..."
            className="w-full h-28 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            name="context"
            value={profileData.context}
            onChange={handleChange}
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer group mt-4 mb-4">
          <input
            type="checkbox"
            id="deepAnalysis"
            className="mt-1 h-5 w-5 accent-purple-600 cursor-pointer"
            checked={profileData.isDeep}
            name="isDeep"
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                [e.target.name]: e.target.checked,
              }))
            }
          />
          <div>
            <p className="text-gray-800 font-semibold group-hover:text-purple-600 transition">
              🧠 Deep Analysis (Serious Interview Mode)
            </p>

            <p className="text-sm text-gray-500">
              Detailed evaluation with deeper insights and stricter scoring. ⏳
              Slower • 💰 Higher cost
            </p>
          </div>
        </label>

        {/* CTA Button */}
        <button
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition"
          onClick={handleProfileSubmit}
        >
          🚀 Start Interview
        </button>
      </div>
    </div>
  );
}

export default ProfileSetup;
