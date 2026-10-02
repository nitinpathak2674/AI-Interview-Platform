function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white">
          AI <span className="text-blue-500">Interview</span>
        </h1>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-300">
          <li>
            <a href="/" className="hover:text-blue-500 transition">
              Home
            </a>
          </li>

          <li>
            <a href="#features" className="hover:text-blue-500 transition">
              Features
            </a>
          </li>

          <li>
            <a href="/reports" className="hover:text-blue-500 transition">
              Reports
            </a>
          </li>

          <li>
            <a href="/profile" className="hover:text-blue-500 transition">
              Profile
            </a>
          </li>
         

<li>
  <a
    href="/developer"
    className="hover:text-blue-500 transition"
  >
    Developer
  </a>
</li>
        </ul>
          
        {/* Buttons */}
        <div className="flex gap-3">
          <a
            href="/login"
            className="px-5 py-2 border border-slate-600 rounded-lg text-white hover:border-blue-500 transition"
          >
            Login
          </a>

          <a
            href="/register"
            className="px-5 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
          >
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;