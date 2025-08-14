import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar() {
  return (
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

      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
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
  );
}