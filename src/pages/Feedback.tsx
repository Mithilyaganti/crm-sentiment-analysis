import React, { useState } from "react";
import { supabase } from "../utils/db";
import { respond } from "../utils/ai";

const generateId = () => {
  return Math.floor(Math.random() * 9007199254740992);
};

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const id = generateId();

    try {
      const aiResult = await respond(feedback);

      if (!aiResult.success) {
        throw new Error("AI sentiment analysis failed");
      }

      const { error } = await supabase.from("feedbacks").insert([
        {
          id,
          email,
          feedback,
          sentiment: aiResult.sentimentScore || 0,
          overview: aiResult.overview || "unknown",
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (error) {
      console.error("Error saving feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
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
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
        {submitted && (
          <p className="success-message">Thank you for your feedback!</p>
        )}
      </form>
    </div>
  );
}
