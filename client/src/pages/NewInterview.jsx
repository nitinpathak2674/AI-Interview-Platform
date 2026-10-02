import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const NewInterview = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    techStack: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.role || !formData.experience || !formData.techStack) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const techStackArray = formData.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);

      const data = await apiRequest(
        "/interviews",
        "POST",
        {
          role: formData.role,
          experience: formData.experience,
          techStack: techStackArray,
        },
        token
      );

      // Open newly created interview
      navigate(`/interview/${data.interview._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">

        <h1 className="text-3xl font-bold mb-2">
          Create New Interview
        </h1>

        <p className="text-gray-600 mb-6">
          Tell us about the interview you want to practice.
        </p>

        {error && (
          <div className="mb-5 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Role */}
          <div>
            <label className="block font-medium mb-2">
              Job Role
            </label>

            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. MERN Stack Developer"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block font-medium mb-2">
              Experience
            </label>

            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Select experience
              </option>

              <option value="Fresher">
                Fresher
              </option>

              <option value="0-1 Years">
                0-1 Years
              </option>

              <option value="1-3 Years">
                1-3 Years
              </option>

              <option value="3-5 Years">
                3-5 Years
              </option>

              <option value="5+ Years">
                5+ Years
              </option>
            </select>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block font-medium mb-2">
              Tech Stack
            </label>

            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, Express, MongoDB"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separate technologies with commas.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Interview"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default NewInterview;