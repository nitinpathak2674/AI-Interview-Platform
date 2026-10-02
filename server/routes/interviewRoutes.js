import express from "express";
import Interview from "../models/Interview.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ai from "../config/gemini.js";

const router = express.Router();

const generateAIContent = async (prompt, attempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

      return response;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini attempt ${attempt}/${attempts} failed:`,
        error.message
      );

      // Retry only for temporary service problems
      if (error.status !== 503 && error.status !== 429) {
        throw error;
      }

      if (attempt < attempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, attempt * 2000)
        );
      }
    }
  }

  throw lastError;
};

// =====================================================
// CREATE INTERVIEW
// POST /api/interviews
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { role, experience, techStack } = req.body;

    if (!role || !experience || !techStack) {
      return res.status(400).json({
        message: "Role, experience and techStack are required",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      role,
      experience,
      techStack,
    });

    res.status(201).json({
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Create Interview Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// =====================================================
// GET USER'S INTERVIEWS
// GET /api/interviews
// =====================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      interviews,
    });
  } catch (error) {
    console.error("Get Interviews Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// =====================================================
// GENERATE AI INTERVIEW QUESTIONS
// POST /api/interviews/:id/generate
// =====================================================

router.post("/:id/generate", authMiddleware, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const previousInterviews = await Interview.find({
      user: req.user._id,
      _id: { $ne: interview._id },
    });

    const previousQuestions = previousInterviews.flatMap(
      (oldInterview) =>
        oldInterview.questions?.map((q) => q.question) || []
    );

    const previousQuestionsText =
      previousQuestions.length > 0
        ? previousQuestions.join("\n")
        : "No previous questions.";

    const prompt = `
You are an expert technical interviewer.

Generate exactly 5 NEW technical interview questions.

Candidate role:
${interview.role}

Experience:
${interview.experience}

Tech stack:
${interview.techStack.join(", ")}

Rules:
- Generate exactly 5 questions.
- Questions must be relevant to the role and technology stack.
- Cover different concepts.
- Do not repeat previous questions.
- Do not generate questions extremely similar to previous questions.
- Return ONLY the questions.
- Number them 1 to 5.
- Do not provide answers.
- Do not provide explanations.

Previous questions:
${previousQuestionsText}
`;

    const response = await generateAIContent(prompt);
    
    const text = response.text || "";

    const questions = text
      .split("\n")
      .map((question) =>
        question
          .replace(/^\s*\d+[\).\-\:]\s*/, "")
          .trim()
      )
      .filter((question) => question.length > 0)
      .slice(0, 5);

    if (questions.length === 0) {
      return res.status(500).json({
        message: "AI did not generate questions",
      });
    }

    interview.questions = questions.map((question) => ({
      question,
      answer: "",
    }));

    await interview.save();

    res.json({
      message: "AI questions generated successfully",
      questions: interview.questions,
    });
  } catch (error) {
    console.error("Generate Questions Error:", error);

    res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
});

// =====================================================
// AI CONVERSATION / ANSWER ANALYSIS
//
// POST /api/interviews/:interviewId/questions/:questionId/voice-intent
//
// This endpoint decides whether the candidate is:
// - TALKING
// - WAIT
// - REPEAT
// - HINT
// - SKIP
// - ANSWER
// =====================================================

router.post(
  "/:interviewId/questions/:questionId/voice-intent",
  authMiddleware,
  async (req, res) => {
    try {
      const { interviewId, questionId } = req.params;
      const { transcript } = req.body;

      if (!transcript || !transcript.trim()) {
        return res.status(400).json({
          message: "Transcript is required",
        });
      }

      const interview = await Interview.findOne({
        _id: interviewId,
        user: req.user._id,
      });

      if (!interview) {
        return res.status(404).json({
          message: "Interview not found",
        });
      }

      const question = interview.questions.id(questionId);

      if (!question) {
        return res.status(404).json({
          message: "Question not found",
        });
      }

      const prompt = `
You are a smart AI technical interviewer having a natural conversation with a candidate.

Current interview question:
"${question.question}"

Candidate's latest speech:
"${transcript}"

Your job is to understand what the candidate is doing.

IMPORTANT:

The candidate may talk normally before answering.

Examples:

Candidate:
"Can you repeat the question?"

Intent:
REPEAT

Candidate:
"Can you give me a hint?"

Intent:
HINT

Candidate:
"Wait, let me think."

Intent:
WAIT

Candidate:
"Okay, I am ready."

Intent:
TALKING

Candidate:
"Can I use AI for this?"

Intent:
TALKING

Candidate:
"I know Virtual DOM. It is a lightweight representation of the real DOM..."

Intent:
ANSWER

Candidate:
"I don't know this one, let's skip it."

Intent:
SKIP

IMPORTANT RULE:

Do NOT treat normal conversational sentences as technical answers.

Only use ANSWER when the candidate has actually started giving a meaningful answer to the interview question.

If the candidate is still talking, thinking, asking something, or having a normal conversation, do NOT save their speech as an answer.

When the candidate is giving an answer, return the cleaned technical answer only.

Return ONLY valid JSON.

Format:

{
  "intent": "TALKING",
  "answer": "",
  "response": ""
}

Allowed intents:

TALKING
WAIT
REPEAT
HINT
SKIP
ANSWER

Rules:

TALKING:
- Candidate is talking normally.
- Do not save as answer.
- Give a short natural response only if necessary.
- Otherwise response can be empty.

WAIT:
- Candidate needs time.
- Give a short encouraging response.
- Do not save as answer.

REPEAT:
- Candidate wants the question repeated.
- Response should repeat or clarify the question.
- Do not save as answer.

HINT:
- Candidate asks for help.
- Give a useful but incomplete hint.
- Do not give the complete answer.
- Do not save as answer.

SKIP:
- Candidate wants to skip.
- Give a short acknowledgement.
- Do not save as answer.

ANSWER:
- Candidate is actually answering the question.
- Put ONLY the technical answer in "answer".
- response should be empty.

Do not give a score.
Do not evaluate.
Do not use markdown.
`;
const response = await generateAIContent(prompt);

      const text = (response.text || "").trim();

      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const result = JSON.parse(cleanedText);

      const allowedIntents = [
        "TALKING",
        "WAIT",
        "REPEAT",
        "HINT",
        "SKIP",
        "ANSWER",
      ];

      if (!allowedIntents.includes(result.intent)) {
        return res.status(500).json({
          message: "Invalid AI intent",
        });
      }

      res.json({
        message: "Voice conversation analyzed successfully",
        intent: result.intent,
        answer: result.answer || "",
        response: result.response || "",
      });
    } catch (error) {
      console.error("Voice Intent Error:", error);

      res.status(500).json({
        message: "Failed to analyze voice conversation",
        error: error.message,
      });
    }
  }
);

// =====================================================
// SUBMIT ANSWER
// POST /api/interviews/:interviewId/questions/:questionId/answer
// =====================================================

router.post(
  "/:interviewId/questions/:questionId/answer",
  authMiddleware,
  async (req, res) => {
    try {
      const { interviewId, questionId } = req.params;
      const { answer } = req.body;

      if (!answer || !answer.trim()) {
        return res.status(400).json({
          message: "Answer is required",
        });
      }

      const interview = await Interview.findOne({
        _id: interviewId,
        user: req.user._id,
      });

      if (!interview) {
        return res.status(404).json({
          message: "Interview not found",
        });
      }

      const question = interview.questions.id(questionId);

      if (!question) {
        return res.status(404).json({
          message: "Question not found",
        });
      }

      question.answer = answer.trim();

      await interview.save();

      res.json({
        message: "Answer submitted successfully",
        question,
      });
    } catch (error) {
      console.error("Submit Answer Error:", error);

      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// =====================================================
// EVALUATE ANSWER
// POST /api/interviews/:interviewId/questions/:questionId/evaluate
// =====================================================

router.post(
  "/:interviewId/questions/:questionId/evaluate",
  authMiddleware,
  async (req, res) => {
    try {
      const { interviewId, questionId } = req.params;

      const interview = await Interview.findOne({
        _id: interviewId,
        user: req.user._id,
      });

      if (!interview) {
        return res.status(404).json({
          message: "Interview not found",
        });
      }

      const question = interview.questions.id(questionId);

      if (!question) {
        return res.status(404).json({
          message: "Question not found",
        });
      }

      if (!question.answer || !question.answer.trim()) {
        return res.status(400).json({
          message: "Please submit an answer first",
        });
      }

      const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's answer.

Question:
${question.question}

Candidate's answer:
${question.answer}

Return ONLY valid JSON:

{
  "score": 8,
  "feedback": "Brief technical feedback.",
  "strengths": "What the candidate explained correctly.",
  "improvements": "What the candidate should improve."
}

Rules:
- Score must be between 0 and 10.
- Be technically accurate.
- Consider correctness, depth, clarity and relevance.
- Do not penalize minor speech-to-text grammar mistakes heavily.
- Focus primarily on technical understanding.
- Return ONLY JSON.
- Do not use markdown.
`;

     const response = await generateAIContent(prompt);

      const text = (response.text || "").trim();

      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const evaluation = JSON.parse(cleanedText);

      question.evaluation = {
        score: Math.max(
          0,
          Math.min(10, Number(evaluation.score))
        ),
        feedback: evaluation.feedback || "",
        strengths: evaluation.strengths || "",
        improvements: evaluation.improvements || "",
      };

      await interview.save();

      res.json({
        message: "Answer evaluated successfully",
        evaluation: question.evaluation,
      });
    } catch (error) {
      console.error("Evaluate Answer Error:", error);

      res.status(500).json({
        message: "Failed to evaluate answer",
        error: error.message,
      });
    }
  }
);

// =====================================================
// FINAL INTERVIEW RESULT
// GET /api/interviews/:interviewId/result
// =====================================================

router.get(
  "/:interviewId/result",
  authMiddleware,
  async (req, res) => {
    try {
      const interview = await Interview.findOne({
        _id: req.params.interviewId,
        user: req.user._id,
      });

      if (!interview) {
        return res.status(404).json({
          message: "Interview not found",
        });
      }

      if (
        !interview.questions ||
        interview.questions.length === 0
      ) {
        return res.status(400).json({
          message: "No questions found for this interview",
        });
      }

      const totalQuestions =
        interview.questions.length;

      const evaluatedQuestions =
        interview.questions.filter(
          (question) =>
            question.evaluation &&
            question.evaluation.score !== null
        );

      const attemptedQuestions =
        interview.questions.filter(
          (question) =>
            question.answer &&
            question.answer.trim() !== ""
        );

      const evaluatedCount =
        evaluatedQuestions.length;

      const totalScore =
        evaluatedQuestions.reduce(
          (sum, question) =>
            sum + Number(question.evaluation.score),
          0
        );

      const averageScore =
        evaluatedCount > 0
          ? Number(
              (
                totalScore / evaluatedCount
              ).toFixed(1)
            )
          : 0;

      const questionResults =
        interview.questions.map(
          (question) => ({
            questionId: question._id,
            question: question.question,
            answer: question.answer,
            score:
              question.evaluation?.score ??
              null,
            feedback:
              question.evaluation?.feedback ??
              "",
            strengths:
              question.evaluation?.strengths ??
              "",
            improvements:
              question.evaluation
                ?.improvements ?? "",
          })
        );

      res.json({
        message:
          "Interview result fetched successfully",

        result: {
          interviewId: interview._id,
          role: interview.role,
          experience: interview.experience,
          techStack: interview.techStack,

          totalQuestions,
          attemptedQuestions:
            attemptedQuestions.length,
          evaluatedQuestions:
            evaluatedCount,

          averageScore,

          questions: questionResults,
        },
      });
    } catch (error) {
      console.error(
        "Get Interview Result Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get interview result",
        error: error.message,
      });
    }
  }
);

export default router;