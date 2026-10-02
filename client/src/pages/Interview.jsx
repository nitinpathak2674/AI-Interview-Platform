import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [answers, setAnswers] = useState({});
  const [recording, setRecording] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [evaluating, setEvaluating] = useState({});
  const [analyzing, setAnalyzing] = useState({});
  const [error, setError] = useState("");

  const recognitionRefs = useRef({});
  const transcriptRefs = useRef({});
  const silenceTimers = useRef({});
  const processingRefs = useRef({});
  const conversationRefs = useRef({});


  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await apiRequest(
          "/interviews",
          "GET",
          null,
          token
        );

        const foundInterview = data.interviews.find(
          (item) => item._id === id
        );

        if (!foundInterview) {
          setError("Interview not found");
          return;
        }

        setInterview(foundInterview);

        const existingAnswers = {};

        foundInterview.questions?.forEach((question) => {
          existingAnswers[question._id] =
            question.answer || "";
        });

        setAnswers(existingAnswers);
      } catch (error) {
        console.error("Fetch Interview Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);



  const generateQuestions = async () => {
    try {
      setGenerating(true);
      setError("");

      const token = localStorage.getItem("token");

      const data = await apiRequest(
        `/interviews/${id}/generate`,
        "POST",
        null,
        token
      );

      setInterview((prev) => ({
        ...prev,
        questions: data.questions,
      }));

      const newAnswers = {};

      data.questions.forEach((question) => {
        newAnswers[question._id] = "";
      });

      setAnswers(newAnswers);
    } catch (error) {
      console.error("Generate Questions Error:", error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };


  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    transcriptRefs.current[questionId] = value;
  };



  const speakQuestion = (text, onFinished = null) => {
    if (!("speechSynthesis" in window)) {
      setError(
        "Text-to-Speech is not supported in this browser."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onend = () => {
      if (onFinished) {
        onFinished();
      }
    };

    window.speechSynthesis.speak(speech);
  };



  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };



  const analyzeVoiceIntent = async (
    questionId,
    transcript
  ) => {
    try {
      const token = localStorage.getItem("token");

      setAnalyzing((prev) => ({
        ...prev,
        [questionId]: true,
      }));

      const data = await apiRequest(
        `/interviews/${id}/questions/${questionId}/voice-intent`,
        "POST",
        {
          transcript,
        },
        token
      );

      console.log(
        "AI CONVERSATION RESULT:",
        data
      );

      return data;
    } catch (error) {
      console.error(
        "Voice Conversation Error:",
        error
      );

      setError(
        error.message ||
          "AI could not understand your response."
      );

      return null;
    } finally {
      setAnalyzing((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };



  const submitVoiceAnswer = async (
    questionId,
    finalAnswer
  ) => {
    const cleanAnswer = finalAnswer.trim();

    if (!cleanAnswer) {
      setError("No answer was detected.");
      return false;
    }

    try {
      setSubmitting((prev) => ({
        ...prev,
        [questionId]: true,
      }));

      setError("");

      const token = localStorage.getItem("token");

      const data = await apiRequest(
        `/interviews/${id}/questions/${questionId}/answer`,
        "POST",
        {
          answer: cleanAnswer,
        },
        token
      );

      setAnswers((prev) => ({
        ...prev,
        [questionId]: cleanAnswer,
      }));

      setInterview((prev) => ({
        ...prev,
        questions: prev.questions.map(
          (question) =>
            question._id === questionId
              ? {
                  ...question,
                  answer: data.question.answer,
                }
              : question
        ),
      }));

      return true;
    } catch (error) {
      console.error(
        "Submit Answer Error:",
        error
      );

      setError(error.message);
      return false;
    } finally {
      setSubmitting((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };



  const evaluateAnswer = async (questionId) => {
    try {
      setEvaluating((prev) => ({
        ...prev,
        [questionId]: true,
      }));

      const token = localStorage.getItem("token");

      const data = await apiRequest(
        `/interviews/${id}/questions/${questionId}/evaluate`,
        "POST",
        null,
        token
      );

      setInterview((prev) => ({
        ...prev,
        questions: prev.questions.map(
          (question) =>
            question._id === questionId
              ? {
                  ...question,
                  evaluation: data.evaluation,
                }
              : question
        ),
      }));

      return data.evaluation;
    } catch (error) {
      console.error(
        "Evaluate Answer Error:",
        error
      );

      setError(error.message);
      return null;
    } finally {
      setEvaluating((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };

  

  const startNextQuestion = (currentIndex) => {
    const nextIndex = currentIndex + 1;

    if (
      !interview?.questions ||
      nextIndex >= interview.questions.length
    ) {
      console.log("Interview finished.");
      return;
    }

    const nextQuestion =
      interview.questions[nextIndex];

    const nextQuestionId = nextQuestion._id;

    transcriptRefs.current[nextQuestionId] = "";
    conversationRefs.current[nextQuestionId] = false;
    processingRefs.current[nextQuestionId] = false;

    setAnswers((prev) => ({
      ...prev,
      [nextQuestionId]: "",
    }));

    setTimeout(() => {
      speakQuestion(
        nextQuestion.question,
        () => {
          setTimeout(() => {
            startVoiceInput(
              nextQuestionId,
              nextIndex
            );
          }, 400);
        }
      );
    }, 700);
  };

  

  const finishVoiceAnswer = async (
    questionId,
    questionIndex
  ) => {
    if (processingRefs.current[questionId]) {
      return;
    }

    const finalTranscript =
      transcriptRefs.current[questionId] || "";

    if (!finalTranscript.trim()) {
      return;
    }

    processingRefs.current[questionId] = true;

    const recognition =
      recognitionRefs.current[questionId];

    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {}
    }

    // Clear silence timer
    if (silenceTimers.current[questionId]) {
      clearTimeout(
        silenceTimers.current[questionId]
      );

      silenceTimers.current[questionId] = null;
    }

    setRecording((prev) => ({
      ...prev,
      [questionId]: false,
    }));

    console.log(
      "ANALYZING SPEECH:",
      finalTranscript
    );

    const result = await analyzeVoiceIntent(
      questionId,
      finalTranscript
    );

    if (!result) {
      processingRefs.current[questionId] =
        false;

      return;
    }

    console.log(
      "DETECTED INTENT:",
      result.intent
    );


    if (result.intent === "TALKING") {
      processingRefs.current[questionId] =
        false;

      if (result.response) {
        speakQuestion(
          result.response,
          () => {
            startVoiceInput(
              questionId,
              questionIndex
            );
          }
        );
      } else {
        startVoiceInput(
          questionId,
          questionIndex
        );
      }

      return;
    }

   
    if (result.intent === "WAIT") {
      transcriptRefs.current[questionId] = "";

      setAnswers((prev) => ({
        ...prev,
        [questionId]: "",
      }));

      processingRefs.current[questionId] =
        false;

      if (result.response) {
        speakQuestion(
          result.response,
          () => {
            setTimeout(() => {
              startVoiceInput(
                questionId,
                questionIndex
              );
            }, 300);
          }
        );
      } else {
        startVoiceInput(
          questionId,
          questionIndex
        );
      }

      return;
    }

 

    if (result.intent === "REPEAT") {
      transcriptRefs.current[questionId] = "";

      setAnswers((prev) => ({
        ...prev,
        [questionId]: "",
      }));

      processingRefs.current[questionId] =
        false;

      speakQuestion(
        interview.questions[questionIndex]
          .question,
        () => {
          setTimeout(() => {
            startVoiceInput(
              questionId,
              questionIndex
            );
          }, 300);
        }
      );

      return;
    }

   

    if (result.intent === "HINT") {
      transcriptRefs.current[questionId] = "";

      setAnswers((prev) => ({
        ...prev,
        [questionId]: "",
      }));

      processingRefs.current[questionId] =
        false;

      if (result.response) {
        speakQuestion(
          result.response,
          () => {
            setTimeout(() => {
              startVoiceInput(
                questionId,
                questionIndex
              );
            }, 300);
          }
        );
      } else {
        startVoiceInput(
          questionId,
          questionIndex
        );
      }

      return;
    }

   

    if (result.intent === "SKIP") {
      transcriptRefs.current[questionId] = "";

      setAnswers((prev) => ({
        ...prev,
        [questionId]: "",
      }));

      processingRefs.current[questionId] =
        false;

      speakQuestion(
        result.response ||
          "Okay, let's move to the next question.",
        () => {
          startNextQuestion(questionIndex);
        }
      );

      return;
    }

 

    if (result.intent === "ANSWER") {
      const answerToSubmit =
        result.answer?.trim() ||
        finalTranscript.trim();

      if (!answerToSubmit) {
        processingRefs.current[questionId] =
          false;

        setError("No answer detected.");

        return;
      }

      console.log(
        "FINAL TECHNICAL ANSWER:",
        answerToSubmit
      );

      
      transcriptRefs.current[questionId] =
        answerToSubmit;

      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerToSubmit,
      }));

   

      const submitted =
        await submitVoiceAnswer(
          questionId,
          answerToSubmit
        );

      if (!submitted) {
        processingRefs.current[questionId] =
          false;

        return;
      }

      

      const evaluation =
        await evaluateAnswer(questionId);

      if (!evaluation) {
        processingRefs.current[questionId] =
          false;

        return;
      }

     

      processingRefs.current[questionId] =
        false;

      startNextQuestion(questionIndex);

      return;
    }

    // Unknown intent
    processingRefs.current[questionId] =
      false;
  };

  

  const startVoiceInput = (
    questionId,
    questionIndex
  ) => {
    setError("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    // Prevent starting multiple microphones
    const oldRecognition =
      recognitionRefs.current[questionId];

    if (oldRecognition) {
      try {
        oldRecognition.stop();
      } catch (error) {}
    }

    // If starting a fresh conversation,
    // keep existing transcript if it exists.
    let finalTranscript =
      transcriptRefs.current[questionId] || "";

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setRecording((prev) => ({
        ...prev,
        [questionId]: true,
      }));

      console.log(
        "MIC STARTED:",
        questionId
      );
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript +=
            transcript + " ";

          transcriptRefs.current[
            questionId
          ] = finalTranscript;
        } else {
          interimTranscript += transcript;
        }
      }

      const displayText =
        finalTranscript +
        interimTranscript;

      setAnswers((prev) => ({
        ...prev,
        [questionId]: displayText,
      }));

   

      if (
        silenceTimers.current[questionId]
      ) {
        clearTimeout(
          silenceTimers.current[questionId]
        );
      }

      

      silenceTimers.current[questionId] =
        setTimeout(() => {
          finishVoiceAnswer(
            questionId,
            questionIndex
          );
        }, 3000);
    };

    

    recognition.onerror = (event) => {
      console.error(
        "Speech Recognition Error:",
        event.error
      );

      setRecording((prev) => ({
        ...prev,
        [questionId]: false,
      }));

      if (
        silenceTimers.current[questionId]
      ) {
        clearTimeout(
          silenceTimers.current[questionId]
        );

        silenceTimers.current[questionId] =
          null;
      }

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission denied. Please allow microphone access."
        );
      }

      if (event.error === "no-speech") {
        console.log(
          "No speech detected."
        );
      }
    };

   

    recognition.onend = () => {
      setRecording((prev) => ({
        ...prev,
        [questionId]: false,
      }));

      /*
       * Do NOT immediately process here.
       *
       * Browser can stop recognition automatically.
       * We give it a moment and restart it if
       * the candidate is still in conversation.
       */

      if (processingRefs.current[questionId]) {
        return;
      }

      const currentTranscript =
        transcriptRefs.current[
          questionId
        ] || "";

      if (!currentTranscript.trim()) {
        return;
      }

      // If there is an active silence timer,
      // let that timer decide when to process.
      if (
        silenceTimers.current[questionId]
      ) {
        return;
      }

      // Restart recognition
      setTimeout(() => {
        if (
          !processingRefs.current[
            questionId
          ]
        ) {
          try {
            startVoiceInput(
              questionId,
              questionIndex
            );
          } catch (error) {
            console.log(
              "Recognition restart error:",
              error
            );
          }
        }
      }, 300);
    };

    recognitionRefs.current[questionId] =
      recognition;

    try {
      recognition.start();
    } catch (error) {
      console.log(
        "Recognition start error:",
        error
      );
    }
  };

  // =====================================================
  // MANUAL STOP RECORDING
  // =====================================================

  const stopVoiceInput = (questionId) => {
    const recognition =
      recognitionRefs.current[questionId];

    if (
      silenceTimers.current[questionId]
    ) {
      clearTimeout(
        silenceTimers.current[questionId]
      );

      silenceTimers.current[questionId] =
        null;
    }

    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {}
    }

    setRecording((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading interview...</p>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

          <h1 className="text-3xl font-bold mb-3">
            {interview.role}
          </h1>

          <p className="text-gray-600 mb-3">
            Experience: {interview.experience}
          </p>

          <div className="flex flex-wrap gap-2">
            {interview.techStack?.map(
              (tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {tech}
                </span>
              )
            )}
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* GENERATE */}

        {(!interview.questions ||
          interview.questions.length === 0) && (

          <div className="bg-white rounded-xl shadow-sm p-8 text-center">

            <h2 className="text-2xl font-semibold mb-3">
              Ready for your AI interview?
            </h2>

            <p className="text-gray-600 mb-6">
              AI will generate 5 questions based
              on your role and technology stack.
            </p>

            <button
              onClick={generateQuestions}
              disabled={generating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {generating
                ? "Generating Questions..."
                : "Generate AI Questions"}
            </button>

          </div>
        )}

        {/* QUESTIONS */}

        {interview.questions &&
          interview.questions.length > 0 && (

          <div className="space-y-6">

            <h2 className="text-2xl font-bold">
              AI Voice Interview
            </h2>

            {interview.questions.map(
              (question, index) => {

                const isRecording =
                  recording[question._id];

                const evaluation =
                  question.evaluation;

                const isAnalyzing =
                  analyzing[question._id];

                return (
                  <div
                    key={question._id}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >

                    <p className="text-sm text-gray-500 mb-2">
                      Question {index + 1} of{" "}
                      {interview.questions.length}
                    </p>

                    <h3 className="text-lg font-semibold mb-4">
                      {question.question}
                    </h3>

                    {/* LISTEN */}

                    <div className="flex flex-wrap gap-3 mb-4">

                      <button
                        onClick={() => {
                          stopSpeaking();

                          transcriptRefs.current[
                            question._id
                          ] = "";

                          conversationRefs.current[
                            question._id
                          ] = true;

                          setAnswers((prev) => ({
                            ...prev,
                            [question._id]: "",
                          }));

                          speakQuestion(
                            question.question,
                            () => {
                              setTimeout(() => {
                                startVoiceInput(
                                  question._id,
                                  index
                                );
                              }, 400);
                            }
                          );
                        }}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        🔊 Listen & Answer
                      </button>

                      <button
                        onClick={stopSpeaking}
                        className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        ⏹ Stop Voice
                      </button>

                    </div>

                    {/* ANSWER / CONVERSATION */}

                    <textarea
                      value={
                        answers[question._id] || ""
                      }
                      onChange={(e) =>
                        handleAnswerChange(
                          question._id,
                          e.target.value
                        )
                      }
                      rows={6}
                      placeholder={
                        isRecording
                          ? "Listening... speak naturally."
                          : "Your conversation / answer will appear here..."
                      }
                      className="w-full border rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {/* MIC STATUS */}

                    <div className="mt-3">

                      {isRecording ? (

                        <div className="flex items-center gap-3">

                          <span className="text-red-600 font-semibold">
                            🔴 Listening...
                          </span>

                          <button
                            onClick={() =>
                              stopVoiceInput(
                                question._id
                              )
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                          >
                            Stop Recording
                          </button>

                        </div>

                      ) : (

                        <span className="text-gray-500">
                          Microphone is off
                        </span>

                      )}

                    </div>

                    {/* AI ANALYZING */}

                    {isAnalyzing && (
                      <p className="mt-4 text-indigo-600">
                        AI is understanding your response...
                      </p>
                    )}

                    {/* SUBMITTING */}

                    {submitting[
                      question._id
                    ] && (
                      <p className="mt-4 text-blue-600">
                        Saving your answer...
                      </p>
                    )}

                    {/* EVALUATING */}

                    {evaluating[
                      question._id
                    ] && (
                      <p className="mt-2 text-green-600">
                        AI is evaluating your answer...
                      </p>
                    )}

                    {/* EVALUATION */}

                    {evaluation && (

                      <div className="mt-6 border-t pt-6">

                        <p className="text-2xl font-bold mb-4">
                          Score:{" "}
                          {evaluation.score}/10
                        </p>

                        <div className="mb-4">

                          <h4 className="font-semibold">
                            Feedback
                          </h4>

                          <p className="text-gray-700">
                            {evaluation.feedback}
                          </p>

                        </div>

                        <div className="mb-4">

                          <h4 className="font-semibold">
                            Strengths
                          </h4>

                          <p className="text-gray-700">
                            {evaluation.strengths}
                          </p>

                        </div>

                        <div>

                          <h4 className="font-semibold">
                            Improvements
                          </h4>

                          <p className="text-gray-700">
                            {evaluation.improvements}
                          </p>

                        </div>

                      </div>
                    )}

                  </div>
                );
              }
            )}

            {/* FINAL RESULT */}

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">

              <button
                onClick={() =>
                  navigate(
                    `/interview/${id}/result`
                  )
                }
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                View Final Result
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Interview;