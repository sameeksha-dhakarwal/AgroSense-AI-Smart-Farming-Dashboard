import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-green-600" />
          <div className="font-bold">AgroSense AI</div>
        </div>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 text-sm"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-3xl bg-white border border-gray-200 p-10">
          <div className="text-4xl font-extrabold leading-tight">
            Empowering Farmers with <span className="text-green-600">AI-Powered</span>{" "}
            Agriculture
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl">
            Real-time monitoring, weather forecasting, smart irrigation, disease detection,
            and marketplace tools — built into one farmer-friendly dashboard.
          </p>

          <div className="flex gap-3 mt-6">
            <Link
              to="/dashboard"
              className="px-5 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 font-semibold"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-5 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold"
            >
              View Features
            </a>
          </div>
        </div>

        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            {
              title: "Environmental Monitoring",
              desc: "Track soil moisture, temperature, humidity, and rainfall with weekly trends.",
            },
            {
              title: "AI Disease Detection",
              desc: "Upload leaf images to detect diseases early and get treatment suggestions.",
            },
            {
              title: "E-Commerce Marketplace",
              desc: "Buy seeds, fertilizers, and tools — and connect with trusted sellers.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white border border-gray-200 p-6">
              <div className="font-bold">{f.title}</div>
              <div className="text-sm text-gray-600 mt-2">{f.desc}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
