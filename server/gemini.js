
async function generateTestCases({
  projectName,
  requirements,
  testingType,
  numberOfCases,
}) {
  const { GoogleGenAI } = await import("@google/genai");

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are a senior QA engineer.

Generate exactly ${numberOfCases} detailed software test cases.

Project: ${projectName}
Requirements: ${requirements}
Testing Type: ${testingType}

Return a JSON array only.

MANDATORY: Every test case MUST contain all these properties:

{
  "id": "TC_001",
  "title": "Verify successful login",
  "preconditions": "User has a registered account",
  "steps": [
    "Open the login page",
    "Enter valid email",
    "Enter valid password",
    "Click Login"
  ],
  "testData": "Email: user@example.com, Password: Test@123",
  "expectedResult": "User should log in successfully",
  "actualResult": "Not Executed",
  "type": "Positive",
  "priority": "High",
  "status": "Pending"
}

IMPORTANT RULES:
- Generate exactly ${numberOfCases} test cases.
- Include all 10 properties in every object.
- Do not omit or rename any property.
- Steps must be an array of strings.
- Include positive, negative and boundary cases where relevant.
- Return valid JSON only. No Markdown.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const rawResponse = response.text;

  console.log("GEMINI RAW RESPONSE:", rawResponse);

  if (!rawResponse) {
    throw new Error("Gemini returned an empty response.");
  }

  let testCases;

  try {
    testCases = JSON.parse(rawResponse);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON.");
  }

  if (!Array.isArray(testCases)) {
    throw new Error("Gemini response must be a JSON array.");
  }

  const requiredFields = [
    "id",
    "title",
    "preconditions",
    "steps",
    "testData",
    "expectedResult",
    "actualResult",
    "type",
    "priority",
    "status",
  ];

  testCases.forEach((test, index) => {
    const missingFields = requiredFields.filter(
      (field) => !Object.prototype.hasOwnProperty.call(test, field)
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Test case ${index + 1} is missing fields: ${missingFields.join(", ")}`
      );
    }

    if (!Array.isArray(test.steps)) {
      throw new Error(
        `Test case ${index + 1}: steps must be an array.`
      );
    }
  });

  if (testCases.length !== Number(numberOfCases)) {
    throw new Error(
      `Expected ${numberOfCases} test cases, but received ${testCases.length}.`
    );
  }

  return testCases;
}

module.exports = { generateTestCases };
