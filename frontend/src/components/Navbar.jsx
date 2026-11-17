// Displays navigation links for the Student Survey application.

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        George Mason University
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/survey">Take Survey</Link>
        <Link to="/surveys">View Surveys</Link>
      </nav>
    </header>
  );
}
