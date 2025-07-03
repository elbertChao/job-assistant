import { useState } from "react";

const GeneratedAnswer = () => {
  const [question, setQuestion] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const handleGenerate = () => {
    // Replace with generateAnswer API later
    setAnswer(`This is a tailored answer for: ${question}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tailored Answer Generator</h2>
      <input
        type="text"
        placeholder="Enter your interview question..."
        className="w-full p-2 border border-gray-300 rounded mb-3"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        autoComplete="question"
      />
      <textarea
        rows={4}
        placeholder="Paste job description here..."
        className="w-full p-2 border border-gray-300 rounded"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button onClick={handleGenerate} className="mt-4 w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">
        Generate Answer
      </button>
      {answer && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>Generated Answer:</strong> {answer}</p>
        </div>
      )}
    </div>
  );
};

export default GeneratedAnswer;
