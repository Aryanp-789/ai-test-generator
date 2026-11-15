
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronDown
} from "lucide-react";

function TestCaseResults({ testCases = [] }) {

  // Export CSV Function
  const handleExport = () => {
    const headers = [
      "Test Case ID",
      "Test Scenario",
      "Preconditions",
      "Test Steps",
      "Test Data",
      "Expected Result",
      "Actual Result",
      "Type",
      "Priority",
      "Status"
    ];

    const rows = testCases.map((test) => [
      test.id,
      test.title,
      test.preconditions,
      Array.isArray(test.steps) ? test.steps.join(" | ") : test.steps,
      test.testData,
      test.expectedResult,
      test.actualResult,
      test.type,
      test.priority,
      test.status
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(","))
    ].join("\r\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "AI_Generated_Test_Cases.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-8">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

        <div className="flex items-center gap-3">
          <div className="bg-violet-100 p-3 rounded-xl">
            <FileText className="text-violet-600" size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Generated Test Cases
            </h2>

            <p className="text-sm text-slate-500">
              {testCases.length} AI-generated test cases available.
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={testCases.length === 0}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl transition"
        >
          <Download size={18} />
          Export CSV
        </button>

      </div>

      {/* Test Cases Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm">
              <th className="p-4">Test Case ID</th>
              <th className="p-4">Test Scenario</th>
              <th className="p-4">Type</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>

          <tbody>
            {testCases.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-slate-400">
                  No test cases generated yet.
                </td>
              </tr>
            ) : (
              testCases.map((test, index) => (

                <tr
                  key={test.id || index}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >

                  <td className="p-4 font-semibold text-violet-600">
                    {test.id}
                  </td>

                  <td className="p-4 text-sm text-slate-700 min-w-64">
                    {test.title}
                  </td>

                  <td className="p-4 text-sm">
                    {test.type}
                  </td>

                  <td className="p-4 text-sm">
                    {test.priority}
                  </td>

                  <td className="p-4">
                    {test.status === "Pass" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={16} />
                        Pass
                      </span>
                    ) : test.status === "Fail" ? (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle size={16} />
                        Fail
                      </span>
                    ) : (
                      <span className="text-yellow-600 text-sm">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <details className="group">
                      <summary className="cursor-pointer flex items-center gap-1 text-violet-600 text-sm font-medium list-none">
                        View
                        <ChevronDown
                          size={16}
                          className="group-open:rotate-180 transition"
                        />
                      </summary>

                      <div className="absolute z-10 bg-white border border-slate-200 shadow-xl rounded-xl p-5 mt-2 w-80 max-h-96 overflow-y-auto">

                        <h3 className="font-bold text-slate-900 mb-3">
                          Test Case Details
                        </h3>

                        <p className="text-sm font-semibold mb-1">
                          Preconditions
                        </p>
                        <p className="text-sm text-slate-600 mb-4">
                          {test.preconditions || "Not provided"}
                        </p>

                        <p className="text-sm font-semibold mb-1">
                          Test Steps
                        </p>
                        <ol className="list-decimal pl-5 text-sm text-slate-600 mb-4 space-y-1">
                          {Array.isArray(test.steps)
                            ? test.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))
                            : <li>{test.steps || "Not provided"}</li>
                          }
                        </ol>

                        <p className="text-sm font-semibold mb-1">
                          Test Data
                        </p>
                        <p className="text-sm text-slate-600 mb-4">
                          {test.testData || "Not provided"}
                        </p>

                        <p className="text-sm font-semibold mb-1">
                          Expected Result
                        </p>
                        <p className="text-sm text-slate-600 mb-4">
                          {test.expectedResult || "Not provided"}
                        </p>

                        <p className="text-sm font-semibold mb-1">
                          Actual Result
                        </p>
                        <p className="text-sm text-slate-600">
                          {test.actualResult || "Not provided"}
                        </p>

                      </div>
                    </details>
                  </td>

                </tr>

              ))
            )}
          </tbody>

        </table>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Test cases generated using Gemini AI.
      </p>

    </div>
  );
}

export default TestCaseResults;
