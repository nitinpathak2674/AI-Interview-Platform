function Developer() {
  return (
    <div className="min-h-screen tech-background text-white">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            AI Interview Platform
          </h1>

          <a
            href="/"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Home
          </a>
        </div>
      </header>

      {/* Developer Section */}
      <main className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-12">
          <p className="text-blue-400 font-medium mb-3">
            ABOUT THE DEVELOPER
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nitin Pathak
          </h2>

          <p className="text-xl text-slate-400">
            MERN Stack Developer
          </p>
        </div>

        {/* Developer Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <h3 className="text-2xl font-bold mb-6">
            Developer Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Name
              </p>
              <p className="font-semibold">
                Nitin Pathak
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Role
              </p>
              <p className="font-semibold">
                MERN Stack Developer
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Education
              </p>
              <p className="font-semibold">
                Bachelor of Computer Applications (BCA)
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Location
              </p>
              <p className="font-semibold">
                Uttarakhand, India
              </p>
            </div>

          </div>

          {/* Links */}
          <div className="mt-8 pt-8 border-t border-slate-800">

            <h3 className="text-xl font-bold mb-5">
              Connect With Me
            </h3>

            <div className="flex flex-wrap gap-4">

              <a
                href="https://github.com/nitinpathak2674"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-lg border border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 transition"
              >
                GitHub
              </a>

              <a
                href="https://linkedin.com/in/nitin2674/"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-lg border border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 transition"
              >
                LinkedIn
              </a>

              <a
                href="https://portfolio-ai-roan.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-lg border border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 transition"
              >
                Portfolio
              </a>

            </div>
          </div>

        </div>

        {/* About Project */}
        <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-8">

          <h3 className="text-2xl font-bold mb-4">
            About This Project
          </h3>

          <p className="text-slate-400 leading-7">
            AI Interview Platform is a web application designed to help
            candidates prepare for interviews using AI-powered interview
            practice, resume analysis and performance reports.
          </p>

          <p className="text-slate-400 leading-7 mt-4">
            The platform combines interview preparation and career-focused
            tools into a single application.
          </p>

        </div>

      </main>
    </div>
  );
}

export default Developer;