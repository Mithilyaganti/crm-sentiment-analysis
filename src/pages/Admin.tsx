import React, { useState, useEffect } from "react";
import { supabase } from "../utils/db";

interface FeedbackType {
  id: number;
  email: string;
  feedback: string;
  sentiment: number;
  overview: string;
  created_at: string;
}

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to generate the image
    // For this example, we'll just set a placeholder
    setGeneratedImage(
      `https://via.placeholder.com/400x400?text=${encodeURIComponent(prompt)}`
    );
  };

  return (
    <div className="image-generator">
      <h3>Generate Image for Social Media</h3>
      <form onSubmit={handleGenerateImage}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image prompt"
          className="form-input"
        />
        <button type="submit" className="form-button">
          Generate Image
        </button>
      </form>
      {generatedImage && (
        <div className="generated-image">
          <img src={generatedImage} alt="Generated social media image" />
        </div>
      )}
    </div>
  );
};

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"feedbacks" | "image-generator">(
    "feedbacks"
  );
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "feedbacks") {
      fetchFeedbacks();
    }
  }, [activeTab]);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "feedbacks" ? "active" : ""}`}
          onClick={() => setActiveTab("feedbacks")}
        >
          Customer Feedbacks
        </button>
        <button
          className={`tab-button ${
            activeTab === "image-generator" ? "active" : ""
          }`}
          onClick={() => setActiveTab("image-generator")}
        >
          Generate Image
        </button>
      </div>

      {activeTab === "feedbacks" && (
        <div className="feedbacks-tab">
          <h2 className="admin-title">Customer Feedbacks</h2>
          {loading ? (
            <p>Loading feedbacks...</p>
          ) : (
            <div className="feedback-list">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="feedback-item">
                  <p className="feedback-email">
                    <strong>Email:</strong> {feedback.email}
                  </p>
                  <p className="feedback-text">
                    <strong>Feedback:</strong> {feedback.feedback}
                  </p>
                  <p className="feedback-sentiment">
                    <strong>Sentiment Score:</strong> {feedback.sentiment}
                    {" - "}
                    {feedback.sentiment === 0
                      ? "Bad"
                      : feedback.sentiment === 1
                      ? "Neutral"
                      : "Good"}
                  </p>
                  <p className="feedback-overview">
                    <strong>AI Overview:</strong> {feedback.overview}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "image-generator" && <ImageGenerator />}
    </div>
  );
};

export default Admin;
