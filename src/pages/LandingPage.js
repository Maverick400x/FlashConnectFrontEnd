import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  FaUserMd,
  FaUserFriends,
  FaBrain,
  FaUserTie,
  FaCalculator,
  FaNetworkWired,
  FaCogs,
  FaLock,
  FaHeadset,
} from "react-icons/fa"; // Added icons for Why Choose Us
import "../styles/LandingPage.css";

const experts = [
  {
    title: "Doctors",
    description:
      "Get trusted health advice and personalized consultations from certified professionals.",
    icon: <FaUserMd size={48} color="#007bff" />,
  },
  {
    title: "Engineers",
    description:
      "Access expert guidance for technical projects, career growth, and innovative solutions.",
    icon: <FaUserTie size={48} color="#28a745" />,
  },
  {
    title: "Chartered Accountants",
    description:
      "Plan your finances, manage taxes, and grow your business with professional CA support.",
    icon: <FaCalculator size={48} color="#ffc107" />,
  },
  {
    title: "Mental Health Experts",
    description:
      "Receive compassionate support from licensed counselors and mental health specialists.",
    icon: <FaBrain size={48} color="#e83e8c" />,
  },
  {
    title: "Friends",
    description:
      "Meet like-minded people, share interests, and build meaningful connections.",
    icon: <FaUserFriends size={48} color="#6f42c1" />,
  },
];

export default function LandingPage() {
  return (
    <div
      className="landing-container vh-100 d-flex flex-column"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        position: "relative",
      }}
    >
      <div
        className="overlay flex-grow-1 d-flex flex-column"
        style={{
          backgroundColor: "rgba(12, 25, 47, 0.85)",
          paddingTop: "60px",
          paddingLeft: "3rem",
          paddingRight: "3rem",
          paddingBottom: "2rem",
          overflowY: "auto",
        }}
      >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-transparent px-4">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            ⚡ Flash Connect
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-center gap-3">
              <li className="nav-item">
                <a className="nav-link text-white" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#about">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#contact">
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <Link to="/login" className="btn btn-success px-4">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Hero Content */}
        <header
          className="header-content mt-5 pt-5 fade-in-up"
          style={{ maxWidth: "650px", marginBottom: "4rem" }}
        >
          <h1 className="display-4 fw-bold">
            ⚡ Your Trusted Partner in Business Growth
          </h1>
          <p className="lead text-white mb-4">
            We help businesses unlock their potential with expert consultancy
            services. Strategy, technology, and innovation — all tailored to your
            success.
          </p>
          <Link to="/register" className="btn btn-success btn-lg">
            Schedule a Consultation
          </Link>
        </header>

        {/* Services Section */}
        <section
          id="services"
          className="mb-5 fade-in-up text-center"
          style={{ maxWidth: "900px", margin: "auto" }}
        >
          <h2 className="text-white mb-4">Our Services</h2>
          <p className="text-light mb-5">
            Connecting you with trusted professionals to help you grow, innovate, and succeed.
          </p>
          <div className="row gy-4 justify-content-center">
            {experts.map((expert, index) => (
              <div className="col-md-4" key={index}>
                <div className="card bg-dark text-white h-100 shadow-sm d-flex flex-column align-items-center">
                  <div className="card-body d-flex flex-column align-items-center text-center">
                    <div style={{ marginBottom: "1rem" }}>{expert.icon}</div>
                    <h5 className="card-title mb-3 text-white">{expert.title}</h5>
                    <p className="card-text">{expert.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section
          className="mb-5 fade-in-up text-center"
          style={{ maxWidth: "900px", margin: "auto" }}
        >
          <h2 className="text-white mb-4">Why Choose Flash Connect?</h2>
          <div className="row gy-4">
            <div className="col-md-3">
              <div className="p-3 border rounded bg-dark text-white h-100">
                <FaNetworkWired size={40} color="#17a2b8" className="mb-3" />
                <h5>Expert Network</h5>
                <p>Work with certified professionals across industries.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-dark text-white h-100">
                <FaCogs size={40} color="#ffc107" className="mb-3" />
                <h5>Tailored Solutions</h5>
                <p>Every service is customized to your unique needs.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-dark text-white h-100">
                <FaLock size={40} color="#28a745" className="mb-3" />
                <h5>Secure & Private</h5>
                <p>Your data is safe and handled with utmost care.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-dark text-white h-100">
                <FaHeadset size={40} color="#e83e8c" className="mb-3" />
                <h5>24/7 Support</h5>
                <p>Get help anytime from our dedicated support team.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section
          id="about"
          className="mb-5 fade-in-up"
          style={{ maxWidth: "900px", margin: "auto" }}
        >
          <h2 className="text-white mb-4 text-center">About Flash Connect</h2>
          <p className="lead text-white mb-4">
            Flash Connect is a consultancy firm dedicated to empowering
            businesses to achieve sustainable growth. With years of experience
            across industries, our team combines strategic insights with
            technological expertise. Our mission is to provide personalized
            services that meet the unique needs of each client.
          </p>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="fade-in-up"
          style={{ marginBottom: "3rem" }}
        >
          <div className="container d-flex flex-column align-items-center text-center">
            <h2 className="text-white mb-4">Get In Touch</h2>
            <form style={{ width: "100%", maxWidth: "500px" }}>
              <div className="mb-3 text-start">
                <label htmlFor="name" className="form-label text-white">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Your name"
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="email" className="form-label text-white">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="message" className="form-label text-white">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  placeholder="Your message"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-success">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}