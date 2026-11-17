
// Displays the homepage and navigation to survey features.

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home">
      <h1>Welcome to George Mason University</h1>

      <p>
        We would love to hear about your campus visit!
        Complete our Student Survey and share your experience.
      </p>

      <div className="home-actions">
        <Link to="/survey" className="btn">
          Take Student Survey
        </Link>

        <Link to="/surveys" className="btn btn-secondary">
          View All Surveys
        </Link>
      </div>
    </section>
  );
}
