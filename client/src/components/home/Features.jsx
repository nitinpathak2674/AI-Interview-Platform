import { Brain, FileText, BarChart3 } from "lucide-react";

function Features() {
  const features = [
    {
      icon: <Brain size={40} className="text-blue-500" />,
      title: "AI Mock Interview",
      desc: "Practice HR and technical interviews with AI and receive instant feedback.",
    },
    {
      icon: <FileText size={40} className="text-green-500" />,
      title: "Resume Analyzer",
      desc: "Upload your resume and get ATS score with improvement suggestions.",
    },
    {
      icon: <BarChart3 size={40} className="text-purple-500" />,
      title: "Performance Reports",
      desc: "Track interview performance and monitor your growth over time.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-slate-900 text-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Powerful Features
        </h2>

        <p className="text-center text-gray-400 mb-14">
          Everything you need to prepare for your next interview.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >
              {feature.icon}

              <h3 className="text-2xl font-semibold mt-6">
                {feature.title}
              </h3>

              <p className="text-gray-400 mt-4">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;