import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await apiRequest(
          "/interviews",
          "GET",
          null,
          token
        );

        setInterviews(data.interviews || []);
      } catch (error) {
        setError(error.message);

        if (
          error.message.toLowerCase().includes("token") ||
          error.message.toLowerCase().includes("unauthorized")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-xl font-bold">
            AI Interview Platform
          </h1>

          <div className="flex items-center gap-4">

            {user && (
              <span className="text-gray-600">
                Hi, {user.name}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              Dashboard
            </h2>

            <p className="text-gray-600 mt-1">
              Practice your technical interviews with AI.
            </p>
          </div>

          {/* Dashboard Actions */}
          <div className="flex gap-3">

            {/* Resume Analyzer */}
            <button
              onClick={() => navigate("/resume-analyzer")}
              className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Analyze Resume
            </button>

            {/* New Interview */}
            <button
              onClick={() => navigate("/interview/new")}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + New Interview
            </button>

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            Loading interviews...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          interviews.length === 0 && (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm">

              <h3 className="text-xl font-semibold mb-2">
                No interviews yet
              </h3>

              <p className="text-gray-600 mb-6">
                Create your first AI-powered interview.
              </p>

              <button
                onClick={() => navigate("/interview/new")}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Interview
              </button>

            </div>
          )}

        {/* Interviews */}
        {!loading && interviews.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {interviews.map((interview) => (

              <div
                key={interview._id}
                className="bg-white rounded-xl shadow-sm p-6"
              >

                <h3 className="text-xl font-semibold mb-3">
                  {interview.role}
                </h3>

                <p className="text-gray-600 mb-2">
                  Experience: {interview.experience}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">

                  {interview.techStack?.map(
                    (tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-sm rounded"
                      >
                        {tech}
                      </span>
                    )
                  )}

                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Questions:{" "}
                  {interview.questions?.length || 0}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/interview/${interview._id}`
                    )
                  }
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open Interview
                </button>

              </div>

            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;