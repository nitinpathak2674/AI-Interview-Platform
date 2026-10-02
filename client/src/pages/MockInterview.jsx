import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MockInterview = () => {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [interviewType, setInterviewType] = useState("Technical");
  const [role, setRole] = useState("MERN Stack Developer");
  const [experience, setExperience] = useState("Fresher");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState([]);

  const questions = [
    "Tell me about yourself and your experience with MERN Stack development.",

    "What is the difference between React state and props?",

    "Explain the difference between MongoDB and a SQL database.",

    "What is middleware in Express.js?",

    "What is the purpose of useEffect in React?",

    "Explain how authentication works using JWT.",

    "What is the difference between PUT and PATCH requests?",

    "How would you improve the performance of a React application?",
  ];

  const startInterview = () => {
    setStarted(true);
    setFinished(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setAnswer("");
  };

  const handleNext = () => {
    if (!answer.trim()) {
      return;
    }

    const updatedAnswers = [
      ...answers,
      {
        question: questions[currentQuestion],
        answer: answer,
      },
    ];

    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
    } else {
      setFinished(true);
      setStarted(false);
    }
  };

  const handleFinish = () => {
    if (answer.trim()) {
      setAnswers([
        ...answers,
        {
          question: questions[currentQuestion],
          answer: answer,
        },
      ]);
    }

    setFinished(true);
    setStarted(false);
  };

  const restartInterview = () => {
    setStarted(false);
    setFinished(false);
    setCurrentQuestion(0);
    setAnswer("");
    setAnswers([]);
  };

  

  if (!started && !finished) {
    return (
      <div className="min-h-screen bg-gray-100">

        {/* Navbar */}
        <nav className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

            <h1 className="text-xl font-bold">
              AI Interview Platform
            </h1>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </button>

          </div>
        </nav>

        {/* Main */}
        <main className="max-w-4xl mx-auto px-6 py-10">

          <div className="text-center mb-10">

            <h2 className="text-4xl font-bold text-gray-900">
              AI Mock Interview
            </h2>

            <p className="text-gray-600 mt-3">
              Practice real interview questions and improve your
              technical and communication skills.
            </p>

          </div>

          {/* Interview Setup */}

          <div className="bg-white rounded-2xl shadow-sm p-8">

            <h3 className="text-2xl font-bold mb-6">
              Interview Setup
            </h3>

            <div className="space-y-6">

              {/* Interview Type */}

              <div>
                <label className="block font-medium mb-2">
                  Interview Type
                </label>

                <select
                  value={interviewType}
                  onChange={(e) =>
                    setInterviewType(e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option>Technical</option>
                  <option>HR</option>
                  <option>Mixed</option>
                </select>
              </div>

              {/* Role */}

              <div>
                <label className="block font-medium mb-2">
                  Job Role
                </label>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option>MERN Stack Developer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Software Developer</option>
                </select>
              </div>

              {/* Experience */}

              <div>
                <label className="block font-medium mb-2">
                  Experience Level
                </label>

                <select
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option>Fresher</option>
                  <option>0-1 Years</option>
                  <option>1-3 Years</option>
                  <option>3+ Years</option>
                </select>
              </div>

              {/* Info */}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

                <h4 className="font-semibold text-blue-800">
                  Interview Details
                </h4>

                <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">

                  <div>
                    <p className="text-gray-500">
                      Type
                    </p>
                    <p className="font-semibold">
                      {interviewType}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Role
                    </p>
                    <p className="font-semibold">
                      {role}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Experience
                    </p>
                    <p className="font-semibold">
                      {experience}
                    </p>
                  </div>

                </div>

              </div>

              {/* Start */}

              <button
                onClick={startInterview}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
              >
                Start Mock Interview
              </button>

            </div>

          </div>

        </main>
      </div>
    );
  }

 

  if (started) {
    const progress =
      ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-100">

        {/* Navbar */}

        <nav className="bg-white border-b">

          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">

            <h1 className="text-xl font-bold">
              AI Mock Interview
            </h1>

            <span className="text-sm text-gray-500">
              {role}
            </span>

          </div>

        </nav>

        <main className="max-w-4xl mx-auto px-6 py-10">

          {/* Progress */}

          <div className="mb-8">

            <div className="flex justify-between text-sm mb-2">

              <span className="font-medium">
                Question {currentQuestion + 1} of{" "}
                {questions.length}
              </span>

              <span className="text-gray-500">
                {Math.round(progress)}%
              </span>

            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full">

              <div
                className="h-2 bg-purple-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />

            </div>

          </div>

          {/* Question */}

          <div className="bg-white rounded-2xl shadow-sm p-8">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                🤖
              </div>

              <div>
                <p className="font-semibold">
                  AI Interviewer
                </p>

                <p className="text-sm text-gray-500">
                  {interviewType} Interview
                </p>
              </div>

            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">

              <p className="text-xl font-semibold text-gray-900 leading-8">
                {questions[currentQuestion]}
              </p>

            </div>

            {/* Answer */}

            <label className="block font-semibold mb-2">
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              rows="8"
              placeholder="Type your answer here..."
              className="w-full border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row gap-4 mt-6">

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleFinish}
                  disabled={!answer.trim()}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  Finish Interview
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answer.trim()}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  Next Question
                </button>
              )}

              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Exit
              </button>

            </div>

          </div>

        </main>
      </div>
    );
  }

  // ==========================================
  // RESULT SCREEN
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-white border-b">

        <div className="max-w-5xl mx-auto px-6 py-4">

          <h1 className="text-xl font-bold">
            AI Interview Platform
          </h1>

        </div>

      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">

        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl mb-5">
            ✓
          </div>

          <h2 className="text-3xl font-bold">
            Interview Completed
          </h2>

          <p className="text-gray-600 mt-3">
            Great job! You completed your mock interview.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mt-8">

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 text-sm">
                Questions
              </p>
              <p className="text-3xl font-bold mt-2">
                {answers.length}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 text-sm">
                Role
              </p>
              <p className="font-bold mt-2">
                {role}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500 text-sm">
                Type
              </p>
              <p className="font-bold mt-2">
                {interviewType}
              </p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

            <button
              onClick={restartInterview}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Start Another Interview
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Back to Profile
            </button>

          </div>

        </div>

      </main>

    </div>
  );
};

export default MockInterview;