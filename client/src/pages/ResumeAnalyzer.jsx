import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeAnalyzer = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setError("");
    setAnalysis(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF resumes are supported.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume size must be less than 5MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };



  const handleAnalyzeResume = async () => {
    console.log("🔥 ANALYZE BUTTON CLICKED");

    if (!file) {
      setError("Please select your resume first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const formData = new FormData();

      formData.append("resume", file);

      console.log("📄 Uploading resume:", file.name);

    const response = await fetch(
  "https://ai-interview-platform-99li.onrender.com/api/resume/analyze",
  {
    method: "POST",
    body: formData,
  }
);

      const data = await response.json();

      console.log("📥 API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Resume analysis failed."
        );
      }

      if (!data.analysis) {
        throw new Error(
          "AI analysis was not returned by the server."
        );
      }

      

    const currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser?.id) {
  throw new Error("User session not found. Please login again.");
}

const resumeKey = `resumeAnalysis_${currentUser.id}`;

localStorage.setItem(
  resumeKey,
  JSON.stringify(data.analysis)
);

      console.log(
        "✅ Latest resume analysis saved:",
        data.analysis
      );

      setAnalysis(data.analysis);

      // Go to Reports page
      navigate("/reports");

    } catch (error) {
      console.error(
        "❌ Resume Analysis Error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while analyzing the resume."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">

          <h1 className="text-3xl font-bold mb-3">
            Resume Analyzer
          </h1>

          <p className="text-gray-600 mb-6">
            Upload your resume and let AI analyze your
            skills, ATS score, strengths and improvements.
          </p>

          {/* FILE UPLOAD */}

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="block mx-auto"
            />

            {file && (
              <div className="mt-5">

                <p className="font-semibold text-gray-800">
                  {file.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>
            )}

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* ANALYZE BUTTON */}

          <button
            onClick={handleAnalyzeResume}
            disabled={!file || loading}
            className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Analyzing Resume..."
              : "Analyze Resume"}
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">

            <div className="text-xl font-semibold">
              AI is analyzing your resume...
            </div>

            <p className="text-gray-500 mt-2">
              This may take a few seconds.
            </p>

          </div>
        )}

        {/* ANALYSIS RESULT */}

        {analysis && !loading && (

          <div className="space-y-6">

            {/* SCORES */}

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white rounded-xl shadow-sm p-6 text-center">

                <p className="text-gray-500">
                  Overall Score
                </p>

                <p className="text-5xl font-bold text-purple-600 mt-3">
                  {analysis.overallScore ?? 0}

                  <span className="text-2xl text-gray-400">
                    /100
                  </span>
                </p>

              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 text-center">

                <p className="text-gray-500">
                  ATS Score
                </p>

                <p className="text-5xl font-bold text-green-600 mt-3">
                  {analysis.atsScore ?? 0}

                  <span className="text-2xl text-gray-400">
                    /100
                  </span>
                </p>

              </div>

            </div>

            {/* SUMMARY */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Resume Summary
              </h2>

              <p className="text-gray-700 leading-7">
                {analysis.summary ||
                  "No summary available."}
              </p>

            </div>

            {/* SKILLS */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Skills
              </h2>

              {analysis.skills?.length > 0 ? (

                <div className="flex flex-wrap gap-2">

                  {analysis.skills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
                      >
                        {typeof skill === "string"
                          ? skill
                          : skill.name ||
                            JSON.stringify(skill)}
                      </span>

                    )
                  )}

                </div>

              ) : (
                <p className="text-gray-500">
                  No skills detected.
                </p>
              )}

            </div>

            {/* STRENGTHS */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Strengths
              </h2>

              {analysis.strengths?.length > 0 ? (

                <ul className="list-disc pl-5 space-y-2">

                  {analysis.strengths.map(
                    (item, index) => (

                      <li
                        key={index}
                        className="text-gray-700"
                      >
                        {typeof item === "string"
                          ? item
                          : JSON.stringify(item)}
                      </li>

                    )
                  )}

                </ul>

              ) : (
                <p className="text-gray-500">
                  No strengths detected.
                </p>
              )}

            </div>

            {/* WEAKNESSES */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Weaknesses
              </h2>

              {analysis.weaknesses?.length > 0 ? (

                <ul className="list-disc pl-5 space-y-2">

                  {analysis.weaknesses.map(
                    (item, index) => (

                      <li
                        key={index}
                        className="text-gray-700"
                      >
                        {typeof item === "string"
                          ? item
                          : JSON.stringify(item)}
                      </li>

                    )
                  )}

                </ul>

              ) : (
                <p className="text-gray-500">
                  No weaknesses detected.
                </p>
              )}

            </div>

            {/* MISSING SKILLS */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Missing Skills
              </h2>

              {analysis.missingSkills?.length > 0 ? (

                <ul className="list-disc pl-5 space-y-2">

                  {analysis.missingSkills.map(
                    (item, index) => (

                      <li
                        key={index}
                        className="text-gray-700"
                      >
                        {typeof item === "string"
                          ? item
                          : JSON.stringify(item)}
                      </li>

                    )
                  )}

                </ul>

              ) : (
                <p className="text-gray-500">
                  No missing skills identified.
                </p>
              )}

            </div>

            {/* PROJECTS */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Projects
              </h2>

              {analysis.projects?.length > 0 ? (

                <div className="space-y-4">

                  {analysis.projects.map(
                    (project, index) => (

                      <div
                        key={index}
                        className="border rounded-lg p-4"
                      >

                        <h3 className="font-semibold text-lg">
                          {typeof project === "string"
                            ? project
                            : project.name ||
                              `Project ${index + 1}`}
                        </h3>

                        {typeof project === "object" && (
                          <>
                            {project.technologies && (
                              <p className="text-sm text-blue-600 mt-1">
                                {project.technologies}
                              </p>
                            )}

                            {project.description && (
                              <p className="text-gray-600 mt-2">
                                {project.description}
                              </p>
                            )}
                          </>
                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (
                <p className="text-gray-500">
                  No projects detected.
                </p>
              )}

            </div>

            {/* EXPERIENCE */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Experience
              </h2>

              {analysis.experience?.length > 0 ? (

                <div className="space-y-4">

                  {analysis.experience.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="border rounded-lg p-4"
                      >

                        {typeof item === "string" ? (
                          <p className="text-gray-700">
                            {item}
                          </p>
                        ) : (
                          <>
                            <h3 className="font-semibold text-lg">
                              {item.role ||
                                item.position ||
                                item.title ||
                                `Experience ${index + 1}`}
                            </h3>

                            {item.company && (
                              <p className="text-blue-600 mt-1">
                                {item.company}
                              </p>
                            )}

                            {item.duration && (
                              <p className="text-sm text-gray-500 mt-1">
                                {item.duration}
                              </p>
                            )}

                            {item.description && (
                              <p className="text-gray-600 mt-2">
                                {item.description}
                              </p>
                            )}

                            {item.details && (
                              <ul className="list-disc pl-5 mt-2 space-y-1">
                                {item.details.map(
                                  (detail, detailIndex) => (
                                    <li key={detailIndex}>
                                      {detail}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </>
                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (
                <p className="text-gray-500">
                  No experience detected.
                </p>
              )}

            </div>

            {/* ATS ISSUES */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                ATS Issues
              </h2>

              {analysis.atsIssues?.length > 0 ? (

                <ul className="list-disc pl-5 space-y-2">

                  {analysis.atsIssues.map(
                    (item, index) => (

                      <li
                        key={index}
                        className="text-gray-700"
                      >
                        {typeof item === "string"
                          ? item
                          : JSON.stringify(item)}
                      </li>

                    )
                  )}

                </ul>

              ) : (
                <p className="text-gray-500">
                  No major ATS issues detected.
                </p>
              )}

            </div>

            {/* IMPROVEMENTS */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Recommended Improvements
              </h2>

              {analysis.improvements?.length > 0 ? (

                <ul className="list-disc pl-5 space-y-2">

                  {analysis.improvements.map(
                    (item, index) => (

                      <li
                        key={index}
                        className="text-gray-700"
                      >
                        {typeof item === "string"
                          ? item
                          : JSON.stringify(item)}
                      </li>

                    )
                  )}

                </ul>

              ) : (
                <p className="text-gray-500">
                  No improvements available.
                </p>
              )}

            </div>

            {/* RECOMMENDED ROLES */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4">
                Recommended Roles
              </h2>

              {analysis.recommendedRoles?.length > 0 ? (

                <div className="flex flex-wrap gap-3">

                  {analysis.recommendedRoles.map(
                    (role, index) => (

                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg"
                      >
                        {typeof role === "string"
                          ? role
                          : JSON.stringify(role)}
                      </span>

                    )
                  )}

                </div>

              ) : (
                <p className="text-gray-500">
                  No recommended roles available.
                </p>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeAnalyzer;