import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-950 text-white py-28">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <span className="inline-block bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
          AI Powered Interview Preparation
        </span>

        <h1 className="text-5xl md:text-7xl font-bold mt-8 leading-tight">
          Ace Your <span className="text-blue-500">Interview</span> with AI
        </h1>

        <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
          Practice real interview questions, analyze your resume, improve your
          communication skills, and track your progress—all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">

          {/* Start Mock Interview */}
          <button
            onClick={() => navigate("/interview/new")}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition"
          >
            Start Mock Interview
          </button>

          {/* Analyze Resume */}
          <button
            onClick={() => navigate("/resume-analyzer")}
            className="border border-gray-600 hover:border-blue-500 hover:text-blue-400 px-8 py-4 rounded-xl transition"
          >
            Analyze Resume
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-semibold">
              AI Interview
            </h3>
            <p className="text-gray-400 mt-2">
              Practice technical and HR interviews with AI.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-semibold">
              Resume Analysis
            </h3>
            <p className="text-gray-400 mt-2">
              Get ATS score and AI suggestions to improve your resume.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-semibold">
              Performance Reports
            </h3>
            <p className="text-gray-400 mt-2">
              Track your interview performance and progress over time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;