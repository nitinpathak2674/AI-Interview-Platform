import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  answer: {
    type: String,
    default: "",
  },

  evaluation: {
    score: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },

    strengths: {
      type: String,
      default: "",
    },

    improvements: {
      type: String,
      default: "",
    },
  },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    techStack: {
      type: [String],
      required: true,
    },

    status: {
      type: String,
      default: "created",
    },

    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;