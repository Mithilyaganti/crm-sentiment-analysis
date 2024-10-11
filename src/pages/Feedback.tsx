import React, { useState } from "react";
import { supabase } from "../utils/db";
import { respond } from "../utils/ai";

const generateId = (n: number) => {
  let id = "";
  while (id.length < n) {
    id += Math.random().toString(36).slice(2);
  }
  return id.slice(0, n);
};

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = generateId(8);
    try {
      supabase.from("feedback").insert([
        {
          id,
          email,
          feedback,
          sentiment: "unknown",
          overview: "unknown",
        },
      ]);
      setSubmitted(true);
      setEmail("");
      setFeedback("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h2 className="form-title">Business Feedback</h2>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
          placeholder="Enter your email"
        />
      </div>
      <div className="form-group">
        <label htmlFor="feedback" className="form-label">
          Feedback:
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          className="form-input form-textarea"
          placeholder="Enter your feedback"
        />
      </div>
      <button type="submit" className="form-button">
        Submit Feedback
      </button>
      {submitted && (
        <p className="success-message">Thank you for your feedback!</p>
      )}
    </form>
  );
}
