
import { useState } from "react";
import { Sparkles, CheckCircle } from "lucide-react";

function TestCaseForm({ onGenerate }) {

  const [formData, setFormData] = useState({
    projectName: "",
    requirements: "",
    testingType: "Manual Testing",
    numberOfCases: "10"
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setMessage("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.projectName.trim()) {
      setMessage("Please enter project name.");
      return;
    }

    if (!formData.requirements.trim()) {
      setMessage("Please enter application requirements.");
      return;
    }

    // Send form data to parent component
    onGenerate(formData);

    setMessage("Form submitted successfully!");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 mt-8">

      {/* Form Header */}
      <div className="flex items-center gap-3 mb-6">

        <div className="bg-violet-100 p-3 rounded-xl">
          <Sparkles className="text-violet-600" size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Generate Test Cases
          </h2>

          <p className="text-sm text-slate-500">
            Enter your application requirements below.
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit}>

        {/* Application Name */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Project / Application Name
          </label>

          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="e.g. Login Application"
            className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Requirements */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Application Requirements
          </label>

          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="5"
            placeholder="Describe your application requirements here..."
            className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>

        {/* Testing Type and Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Testing Type
            </label>

            <select
              name="testingType"
              value={formData.testingType}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option>Manual Testing</option>
              <option>Functional Testing</option>
              <option>Regression Testing</option>
              <option>API Testing</option>
              <option>Smoke Testing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Number of Test Cases
            </label>

            <select
              name="numberOfCases"
              value={formData.numberOfCases}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="5">5 Test Cases</option>
              <option value="10">10 Test Cases</option>
              <option value="15">15 Test Cases</option>
              <option value="20">20 Test Cases</option>
            </select>
          </div>

        </div>

        {/* Message */}
        {message && (
          <div className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2 bg-green-50 text-green-700">
            <CheckCircle size={18} />
            {message}
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Sparkles size={20} />
          Generate Test Cases
        </button>

      </form>

    </div>
  );
}

export default TestCaseForm;
