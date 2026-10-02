import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Reports() {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
   const currentUser = JSON.parse(localStorage.getItem("user"));

const resumeKey = currentUser?.id
  ? `resumeAnalysis_${currentUser.id}`
  : null;

const savedAnalysis = resumeKey
  ? localStorage.getItem(resumeKey)
  : null;

if (savedAnalysis) {
  setAnalysis(JSON.parse(savedAnalysis));
}

    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis));
      } catch (error) {
        console.error("Failed to load resume analysis:", error);
      }
    }
  }, []);

  if (!analysis) {
    return (
      <div className="reports-page min-h-screen">
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

        <main className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <h2 className="text-3xl font-bold mb-3">
              Resume Report
            </h2>

            <p className="text-gray-600 mb-8">
              Upload and analyze your resume first to see your detailed
              report here.
            </p>

            <button
              onClick={() => navigate("/resume-analyzer")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Analyze Resume
            </button>
          </div>
        </main>
      </div>
    );
  }

  const {
    overallScore,
    atsScore,
    summary,
    skills = [],
    strengths = [],
    weaknesses = [],
    missingSkills = [],
    projects = [],
    experience = [],
    atsIssues = [],
    improvements = [],
    recommendedRoles = [],
  } = analysis;

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

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">
            Resume Report
          </h2>

          <p className="text-gray-600 mt-2">
            AI-powered analysis of your resume
          </p>
        </div>

        {/* Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-3">
              Overall Score
            </p>

            <div className="text-5xl font-bold text-purple-600">
              {overallScore}
              <span className="text-2xl text-gray-400">
                /100
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-3">
              ATS Score
            </p>

            <div className="text-5xl font-bold text-green-600">
              {atsScore}
              <span className="text-2xl text-gray-400">
                /100
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">
          <h3 className="text-2xl font-bold mb-4">
            Resume Summary
          </h3>

          <p className="text-gray-700 leading-7">
            {summary || "No summary available."}
          </p>
        </section>

        {/* Skills */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">
          <h3 className="text-2xl font-bold mb-5">
            Skills
          </h3>

          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span
  key={index}
  className="px-4 py-2 bg-[#1b1f24] text-[#d1d5db] rounded-full text-sm font-medium border border-[#292f36]"
>
  {typeof skill === "string"
    ? skill
    : skill.name || JSON.stringify(skill)}
</span>
              ))
            ) : (
              <p className="text-gray-500">
                No skills found.
              </p>
            )}
          </div>
        </section>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-2xl shadow-sm p-7">
            <h3 className="text-2xl font-bold mb-5">
              Strengths
            </h3>

            <div className="space-y-3">
              {strengths.length > 0 ? (
                strengths.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-green-50 rounded-lg text-gray-700"
                  >
                    <span className="text-green-600 font-bold mr-2">
                      ✓
                    </span>
                    {typeof item === "string"
                      ? item
                      : JSON.stringify(item)}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No strengths available.
                </p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-7">
            <h3 className="text-2xl font-bold mb-5">
              Weaknesses
            </h3>

            <div className="space-y-3">
              {weaknesses.length > 0 ? (
                weaknesses.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-red-50 rounded-lg text-gray-700"
                  >
                    <span className="text-red-600 font-bold mr-2">
                      !
                    </span>
                    {typeof item === "string"
                      ? item
                      : JSON.stringify(item)}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No weaknesses available.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Missing Skills */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">
          <h3 className="text-2xl font-bold mb-5">
            Missing Skills
          </h3>

          <div className="flex flex-wrap gap-3">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full"
                >
                  {typeof skill === "string"
                    ? skill
                    : JSON.stringify(skill)}
                </span>
              ))
            ) : (
              <p className="text-gray-500">
                No missing skills identified.
              </p>
            )}
          </div>
        </section>

        {/* Projects */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">
          <h3 className="text-2xl font-bold mb-6">
            Projects
          </h3>

          <div className="space-y-5">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <h4 className="text-xl font-semibold mb-2">
                    {project.name || `Project ${index + 1}`}
                  </h4>

                  {project.technologies && (
                    <div className="mb-3">
                      <span className="font-medium text-gray-700">
                        Technologies:
                      </span>

                      <span className="text-gray-600 ml-2">
                        {project.technologies}
                      </span>
                    </div>
                  )}

                  {project.description && (
                    <p className="text-gray-600 leading-6">
                      {project.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No projects found.
              </p>
            )}
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">
          <h3 className="text-2xl font-bold mb-6">
            Experience
          </h3>

          <div className="space-y-5">
            {experience.length > 0 ? (
              experience.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <h4 className="text-xl font-semibold mb-2">
                    {item.role ||
                      item.position ||
                      `Experience ${index + 1}`}
                  </h4>

                  {item.company && (
                    <p className="text-blue-600 font-medium mb-2">
                      {item.company}
                    </p>
                  )}

                  {item.duration && (
                    <p className="text-sm text-gray-500 mb-3">
                      {item.duration}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-gray-600 leading-6">
                      {item.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No experience information found.
              </p>
            )}
          </div>
        </section>

        {/* ATS Issues */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">
          <h3 className="text-2xl font-bold mb-5">
            ATS Issues
          </h3>

          <div className="space-y-3">
            {atsIssues.length > 0 ? (
              atsIssues.map((issue, index) => (
                <div
                  key={index}
                  className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-gray-700"
                >
                  <span className="font-bold text-yellow-600 mr-2">
                    ⚠
                  </span>

                  {typeof issue === "string"
                    ? issue
                    : JSON.stringify(issue)}
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No major ATS issues found.
              </p>
            )}
          </div>
        </section>

        {/* Improvements */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-6">
          <h3 className="text-2xl font-bold mb-5">
            Recommended Improvements
          </h3>

          <div className="space-y-3">
            {improvements.length > 0 ? (
              improvements.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 bg-purple-50 rounded-lg"
                >
                  <span className="font-bold text-purple-600">
                    {index + 1}.
                  </span>

                  <span className="text-gray-700">
                    {typeof item === "string"
                      ? item
                      : JSON.stringify(item)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No improvements available.
              </p>
            )}
          </div>
        </section>

        {/* Recommended Roles */}
        <section className="bg-white rounded-2xl shadow-sm p-7 mb-10">
          <h3 className="text-2xl font-bold mb-5">
            Recommended Roles
          </h3>

          <div className="flex flex-wrap gap-3">
            {recommendedRoles.length > 0 ? (
              recommendedRoles.map((role, index) => (
                <span
                  key={index}
                  className="px-5 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium"
                >
                  {typeof role === "string"
                    ? role
                    : JSON.stringify(role)}
                </span>
              ))
            ) : (
              <p className="text-gray-500">
                No recommended roles available.
              </p>
            )}
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <button
            onClick={() => navigate("/resume-analyzer")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Analyze Another Resume
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default Reports;