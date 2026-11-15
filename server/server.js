
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { generateTestCases } = require("./gemini");

const app = express();

// Check API Key
console.log(
  "Gemini API Key Loaded:",
  Boolean(process.env.GEMINI_API_KEY)
);

// Middleware
app.use(cors());
app.use(express.json());

// GET Test Route
app.get("/", (req, res) => {
  res.send("AI Test Case Generator Backend is Running!");
});

// POST Connection Test Route
app.post("/api/test-post", (req, res) => {
  console.log("POST connection successful!");

  res.json({
    success: true,
    message: "POST API is working!",
    receivedData: req.body,
  });
});

// Gemini API Route
app.post("/api/generate", async (req, res) => {
  console.log("Generate API route called!");

  try {
    console.log("Calling Gemini API...");

    const {
      projectName,
      requirements,
      testingType,
      numberOfCases,
    } = req.body;

    // Validate Project Details
    if (!projectName || !requirements) {
      return res.status(400).json({
        success: false,
        message: "Project name and requirements are required.",
      });
    }

    // Validate Number of Cases
    const count = Number(numberOfCases);

    if (!Number.isInteger(count) || count < 1 || count > 50) {
      return res.status(400).json({
        success: false,
        message: "Number of cases must be between 1 and 50.",
      });
    }

    // Generate Detailed Test Cases
    const testCases = await generateTestCases({
      projectName,
      requirements,
      testingType,
      numberOfCases: count,
    });

    // Log Generated Test Cases
    console.log("Generated Test Cases:", testCases);
    console.log("Total Test Cases:", testCases.length);

    // Send JSON Response to Frontend
    return res.status(200).json({
      success: true,
      total: testCases.length,
      testCases: testCases,
    });

  } catch (error) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate test cases.",
    });
  }
});

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
