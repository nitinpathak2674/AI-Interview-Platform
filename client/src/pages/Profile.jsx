import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  const getInitials = () => {
    if (!user.name) return "U";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

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
      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">

          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {getInitials()}
            </div>

            {/* User Info */}
            <div className="text-center md:text-left">

              <h2 className="text-3xl font-bold text-gray-900">
                {user.name || "User"}
              </h2>

              <p className="text-gray-500 mt-2">
                {user.email || "No email available"}
              </p>

              <span className="inline-block mt-3 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                AI Interview Platform Member
              </span>

            </div>

          </div>

        </div>

        {/* Account Information */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">

          <h3 className="text-2xl font-bold mb-6">
            Account Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="border rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-1">
                Full Name
              </p>

              <p className="font-semibold text-gray-900">
                {user.name || "Not available"}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-1">
                Email Address
              </p>

              <p className="font-semibold text-gray-900 break-all">
                {user.email || "Not available"}
              </p>
            </div>

          </div>

        </section>

        {/* Platform Features */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">

          <h3 className="text-2xl font-bold mb-6">
            Your Interview Tools
          </h3>

          <div className="grid md:grid-cols-3 gap-5">

           {/* AI Interview */}
<button
  onClick={() => navigate("/interview/new")}
  className="text-left border rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition"
>
  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl mb-4">
    🤖
  </div>

  <h4 className="text-lg font-semibold">
    AI Interview
  </h4>

  <p className="text-gray-500 text-sm mt-2">
    Practice technical and HR interviews with AI.
  </p>
</button>

            {/* Resume */}
            <button
              onClick={() => navigate("/resume-analyzer")}
              className="text-left border rounded-xl p-6 hover:border-purple-500 hover:shadow-md transition"
            >

              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl mb-4">
                📄
              </div>

              <h4 className="text-lg font-semibold">
                Resume Analyzer
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Analyze your resume and improve your ATS score.
              </p>

            </button>

            {/* Reports */}
            <button
              onClick={() => navigate("/reports")}
              className="text-left border rounded-xl p-6 hover:border-green-500 hover:shadow-md transition"
            >

              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl mb-4">
                📊
              </div>

              <h4 className="text-lg font-semibold">
                Reports
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                View your resume analysis and performance reports.
              </p>

            </button>

          </div>

        </section>

        {/* Actions */}
        <section className="bg-white rounded-2xl shadow-sm p-7">

          <h3 className="text-2xl font-bold mb-6">
            Account Actions
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Back to Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Profile;