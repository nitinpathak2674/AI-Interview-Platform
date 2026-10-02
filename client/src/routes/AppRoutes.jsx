import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ResumeAnalyzer from "../pages/ResumeAnalyzer";
import MockInterview from "../pages/MockInterview";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import NotFound from "../pages/notfound";
import InterviewResult from "../pages/InterviewResult";
import Developer from "../pages/developer";

import NewInterview from "../pages/NewInterview";
import Interview from "../pages/Interview";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/developer" element={<Developer />} />

      {/* Interview */}
      <Route
        path="/interview/new"
        element={<NewInterview />}
      />

      <Route
        path="/interview/:id"
        element={<Interview />}
      />

      <Route
  path="/interview/:id/result"
  element={<InterviewResult />}
/>

      {/* Other Pages */}
      <Route
        path="/resume-analyzer"
        element={<ResumeAnalyzer />}
      />

      <Route
        path="/mock-interview"
        element={<MockInterview />}
      />

      <Route
        path="/reports"
        element={<Reports />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;