import React, { useState } from "react";
import { Mic, X } from "lucide-react";

export default function VoiceAssistantPanel({ onClose }) {

  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async (message) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      console.log("AI RESPONSE:", data); // 🔥 DEBUG

      if (data.error) {
        setResponse("❌ " + data.error);
        return;
      }

      if (!data.reply) {
        setResponse("⚠️ No reply from AI");
        return;
      }

      setResponse(data.reply);

      const speech = new SpeechSynthesisUtterance(data.reply);
      speech.lang = "en-IN";

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);

    } catch (err) {
      console.error("FRONTEND ERROR:", err);
      setResponse("❌ Failed to connect to AI");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;

      setText(speechText);
      setListening(false);

      askAI(speechText);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  return (
    <div className="fixed right-6 top-20 w-96 bg-white border rounded-2xl shadow-lg z-50">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="font-semibold"> Farmer AI Assistant</div>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-5">

        {/* MIC CENTER FIX */}
        <div className="flex justify-center items-center">
          <button
            onClick={startListening}
            className={`w-20 h-20 flex items-center justify-center rounded-full text-white transition ${
              listening ? "bg-red-500" : "bg-green-600"
            }`}
          >
            <Mic size={30} />
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          {listening ? "Listening..." : "Tap mic and speak"}
        </div>

        {/* USER TEXT */}
        {text && (
          <div className="bg-gray-100 p-3 rounded-xl text-sm">
            You: {text}
          </div>
        )}

        {/* AI RESPONSE */}
        {loading ? (
          <div className="text-sm text-gray-500 text-center">
            Thinking...
          </div>
        ) : (
          response && (
            <div className="bg-green-100 p-3 rounded-xl text-sm">
              AI: {response}
            </div>
          )
        )}

      </div>
    </div>
  );
}