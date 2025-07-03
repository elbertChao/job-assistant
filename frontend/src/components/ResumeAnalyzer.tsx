import { useState } from "react";

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  const handleAnalyze = () => {
    // Replace with analyzeResume API later
    setResult({
      score: 85,
      feedback: "Great resume! Strong alignment with job requirements.",
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Resume Analyzer</h2>
      <textarea
        rows={6}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Paste your resume here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <button onClick={handleAnalyze} className="mt-4 w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">
        Analyze Resume
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Feedback:</strong> {result.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
