// Meet Popat
// Displays submitted surveys and provides edit and delete operations.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSurveys, deleteSurvey } from "../services/surveyApi";

export default function SurveyList() {
  const navigate = useNavigate();

  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSurveys() {
      try {
        const data = await getSurveys();
        setSurveys(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSurveys();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this survey?")) {
      return;
    }

    try {
      await deleteSurvey(id);

      setSurveys(prev =>
        prev.filter(survey => survey.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p>Loading surveys...</p>;
  }

  return (
    <section className="list-card">
      <div className="page-header">
        <h1>Submitted Student Surveys</h1>

        <Link to="/survey" className="btn">
          Add New Survey
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {surveys.length === 0 ? (
        <p>No surveys have been submitted yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {surveys.map(survey => (
                <tr key={survey.id}>
                  <td>{survey.id}</td>

                  <td>
                    {survey.first_name} {survey.last_name}
                  </td>

                  <td>{survey.email}</td>
                  <td>{survey.survey_date}</td>

                  <td>{survey.recommendation || "N/A"}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-small"
                        onClick={() =>
                          navigate(`/surveys/${survey.id}/edit`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(survey.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
