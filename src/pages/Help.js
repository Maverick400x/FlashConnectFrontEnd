import React from "react";
import { Mail, HelpCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import "../styles/help.css";

export default function Help() {
  return (
    <div className="help-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="help-content">
        {/* Header */}
        <div className="help-header">
          <h1>Help & Support</h1>
          <p>Find answers to common questions or reach out to our team for assistance.</p>
        </div>

        {/* Main Grid */}
        <div className="help-main">
          {/* FAQ Section */}
          <div className="help-section">
            <h2><HelpCircle size={20} /> Frequently Asked Questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h4>How do I reset my password?</h4>
                <p>Click on the "Forgot Password" link on the login page and follow the instructions.</p>
              </div>
              <div className="faq-item">
                <h4>How do I update my profile?</h4>
                <p>Visit your profile page and click the "Edit" button to update your information.</p>
              </div>
              <div className="faq-item">
                <h4>How do I contact support?</h4>
                <p>You can use the contact form on this page or email us at <a href="mailto:support@flashconnect.com">support@flashconnect.com</a>.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="help-section">
            <h2><Mail size={20} /> Contact Support</h2>
            <form className="help-form">
              <label>Your Name</label>
              <input type="text" placeholder="Enter your name" required />

              <label>Your Email</label>
              <input type="email" placeholder="Enter your email" required />

              <label>Your Message</label>
              <textarea placeholder="Describe your issue..." rows="5" required></textarea>

              <button type="submit" className="help-submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}