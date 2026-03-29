import React from "react";

function NextSubmit() {
  return (
    <div className="flex justify-end gap-3">
      <button className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
        Next Question →
      </button>
      <button className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
        Submit
      </button>
    </div>
  );
}

export default NextSubmit;
