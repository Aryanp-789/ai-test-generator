
import { useState } from "react";

import {
  LayoutDashboard,
  FileText,
  Settings,
  Sparkles,
  ChevronRight,
  Menu,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

import TestCaseForm from "./components/TestCaseForm";
import TestCaseResults from "./components/TestCaseResults";

function App() {
  const [formData, setFormData] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate Test Cases using Gemini API
  const handleGenerate = async (data) => {
    setFormData(data);
    setTestCases([]);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-test-generator-api-53od.onrender.com/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      // Debug Backend Response
      console.log("AI Backend Response:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to generate test cases"
        );
      }

      // Parse Gemini Response
      let generatedCases =
        typeof result.testCases === "string"
          ? JSON.parse(result.testCases)
          : result.testCases;

      // Validate Response
      if (!Array.isArray(generatedCases)) {
        throw new Error("Invalid test case response from AI");
      }

      console.log("Generated Test Cases:", generatedCases);

      // Save Generated Test Cases
      setTestCases(generatedCases);

    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white min-h-screen p-5 shrink-0">

        <div className="flex items-center gap-3 mb-10">
          <div className="bg-violet-600 p-2 rounded-xl">
            <Sparkles size={24} />
          </div>

          <div>
            <h2 className="font-bold text-lg">TestGen AI</h2>
            <p className="text-xs text-slate-400">
              Smart Testing Platform
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 uppercase mb-4">
          Menu
        </p>

        <nav className="space-y-2">

          <button className="w-full flex items-center gap-3 bg-violet-600 p-3 rounded-xl text-left">
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-800 p-3 rounded-xl text-left">
            <FileText size={20} />
            Test Cases
          </button>

          <button className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-800 p-3 rounded-xl text-left">
            <Settings size={20} />
            Settings
          </button>

        </nav>

        <div className="mt-16 bg-slate-900 p-4 rounded-xl">
          <Sparkles className="text-violet-400 mb-2" />

          <h3 className="font-semibold">
            AI Powered Testing
          </h3>

          <p className="text-xs text-slate-400 mt-2">
            Generate smart test cases using AI.
          </p>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-8">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Welcome to your AI Test Case Generator.
            </p>
          </div>

          <button className="bg-white border p-3 rounded-xl">
            <Menu size={20} />
          </button>

        </header>

        {/* AI Generator Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">

          <div className="flex items-center gap-2 text-violet-600 mb-3">
            <Sparkles size={22} />

            <span className="font-semibold">
              AI Test Generator
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Generate Test Cases with AI
          </h2>

          <p className="text-slate-500 mt-2">
            Create test cases automatically from your requirements.
          </p>

          <button
            onClick={() =>
              document.getElementById("generator-form")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="mt-6 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            Get Started
            <ChevronRight size={20} />
          </button>

        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <FileText className="text-violet-600 mb-4" size={28} />
            <p className="text-slate-500 text-sm">Total Test Cases</p>
            <h2 className="text-3xl font-bold mt-2">
              {testCases.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <CheckCircle className="text-green-600 mb-4" size={28} />
            <p className="text-slate-500 text-sm">Passed</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <XCircle className="text-red-600 mb-4" size={28} />
            <p className="text-slate-500 text-sm">Failed</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Sparkles className="text-blue-600 mb-4" size={28} />
            <p className="text-slate-500 text-sm">AI Generated</p>
            <h2 className="text-3xl font-bold mt-2">
              {testCases.length}
            </h2>
          </div>

        </div>

        {/* Test Case Generator Form */}
        <div id="generator-form">
          <TestCaseForm onGenerate={handleGenerate} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border rounded-xl p-6 mt-6 flex items-center gap-3">
            <Loader2 className="animate-spin text-violet-600" />

            <p className="text-slate-700 font-medium">
              AI is generating your test cases. Please wait...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mt-6">
            {error}
          </div>
        )}

        {/* Submitted Form Details */}
        {formData && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mt-6">

            <h2 className="text-lg font-bold mb-4">
              Submitted Project Details
            </h2>

            <p className="mb-2">
              <strong>Project:</strong> {formData.projectName}
            </p>

            <p className="mb-2">
              <strong>Testing Type:</strong> {formData.testingType}
            </p>

            <p className="mb-2">
              <strong>Number of Cases:</strong> {formData.numberOfCases}
            </p>

            <p className="mb-2">
              <strong>Requirements:</strong> {formData.requirements}
            </p>

          </div>
        )}

        {/* Generated Test Cases */}
        <TestCaseResults testCases={testCases} />

      </main>
    </div>
  );
}

export default App;
