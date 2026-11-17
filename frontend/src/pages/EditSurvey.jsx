
// Retrieves an existing survey and loads it into the reusable editing form.

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SurveyForm from "../components/SurveyForm";
import { getSurvey } from "../services/surveyApi";

export default function EditSurvey() {
  const { id } = useParams();

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSurvey() {
      try {
        const data = await getSurvey(id);
        setSurvey(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSurvey();
  }, [id]);

  if (loading) {
    return <p>Loading survey...</p>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <SurveyForm
      key={id}
      surveyId={id}
      initialData={survey}
    />
  );
}
