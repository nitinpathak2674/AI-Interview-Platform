import ai from "../config/gemini.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume PDF.",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF resumes are supported.",
      });
    }

    const base64Resume = req.file.buffer.toString("base64");

    const prompt = `
You are an expert technical recruiter and resume reviewer.

Analyze the uploaded resume carefully.

Return the result in valid JSON with exactly these fields:

{
  "overallScore": 0,
  "summary": "",
  "skills": [],
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "projects": [],
  "experience": [],
  "atsScore": 0,
  "atsIssues": [],
  "improvements": [],
  "recommendedRoles": []
}

Rules:
- overallScore must be between 0 and 100.
- atsScore must be between 0 and 100.
- Do not invent information that is not present in the resume.
- Give practical suggestions for improving the resume.
- Focus especially on ATS compatibility and technical job applications.
- Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Resume,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

   // Gemini response se text safely nikalo
let resultText;

if (typeof response.text === "function") {
  resultText = response.text();
} else {
  resultText = response.text;
}

// Fallback in case response.text is not available
if (!resultText) {
  resultText = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("");
}

if (!resultText) {
  console.error("Gemini returned empty response:", response);

  return res.status(500).json({
    message: "Gemini returned an empty response.",
  });
}

resultText = resultText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("Gemini Resume Analysis:", resultText);

    let analysis;

    try {
      analysis = JSON.parse(resultText);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", parseError);
      console.error("Gemini Response:", resultText);

      return res.status(500).json({
        message: "AI returned an invalid analysis.",
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Resume Analysis Error:", error);

    return res.status(500).json({
      message:
        error.message || "Failed to analyze resume.",
    });
  }
};