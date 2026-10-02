import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await apiRequest(
          `/interviews/${id}/result`,
          "GET",
          null,
          token
        );

        setResult(data.result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading result...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold">
            Interview Result
          </h1>

          <p className="text-gray-600 mt-2">
            {result.role} • {result.experience}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {result.techStack?.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500">
              Average Score
            </p>

            <p className="text-4xl font-bold mt-2">
              {result.averageScore}/10
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500">
              Attempted
            </p>

            <p className="text-4xl font-bold mt-2">
              {result.attemptedQuestions}/
              {result.totalQuestions}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500">
              Evaluated
            </p>

            <p className="text-4xl font-bold mt-2">
              {result.evaluatedQuestions}/
              {result.totalQuestions}
            </p>
          </div>

        </div>

        {/* Question Results */}
        <div className="space-y-5">

          <h2 className="text-2xl font-bold">
            Question-wise Results
          </h2>

          {result.questions.map((question, index) => (
            <div
              key={question.questionId}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between gap-4 mb-4">
                <h3 className="font-semibold text-lg">
                  {question.question}
                </h3>

                <span className="font-bold whitespace-nowrap">
                  {question.score !== null
                    ? `${question.score}/10`
                    : "Not attempted"}
                </span>
              </div>

              {/* Answer */}
              <div className="mb-4">
                <h4 className="font-semibold mb-1">
                  Your Answer
                </h4>

                <p className="text-gray-700 whitespace-pre-line">
                  {question.answer || "No answer submitted."}
                </p>
              </div>

              {/* Feedback */}
              {question.score !== null && (
                <>
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold mb-1">
                      Feedback
                    </h4>

                    <p className="text-gray-700">
                      {question.feedback}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">
                      Strengths
                    </h4>

                    <p className="text-gray-700">
                      {question.strengths}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">
                      Improvements
                    </h4>

                    <p className="text-gray-700">
                      {question.improvements}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}

        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/interview/new")}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            New Interview
          </button>

        </div>

      </div>
    </div>
  );
};

export default InterviewResult;