import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Mic, MicOff } from "lucide-react";

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [lang, setLang] = useState("en-IN");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = false;

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (command) => {
    let response = "Sorry, I did not understand.";

    if (command.includes("water") || command.includes("irrigation")) {
      response =
        lang === "te-IN"
          ? "మీ పంటకు ఈ రోజు మోస్తరు నీటిపారుదల అవసరం."
          : "Your crop needs moderate irrigation today.";
    }

    if (command.includes("soil")) {
      response =
        lang === "te-IN"
          ? "మీ నేల ఆరోగ్యంగా ఉంది."
          : "Your soil condition looks healthy.";
    }

    speak(response);
  };

  const startListening = () => {
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.toLowerCase();
      setText(spokenText);
      handleCommand(spokenText);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-5 max-w-3xl">
          <div className="bg-white border rounded-2xl p-6 text-center">
            <div className="font-bold text-lg mb-4">
              AgroSense Voice Assistant
            </div>

            <select
              className="border p-2 rounded-xl mb-4"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="en-IN">English</option>
              <option value="te-IN">తెలుగు</option>
            </select>

            <div className="flex justify-center mb-4">
              <button
                onClick={startListening}
                className="bg-green-600 text-white p-6 rounded-full"
              >
                {listening ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              {text
                ? `You said: "${text}"`
                : "Tap the mic and speak"}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
