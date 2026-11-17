// Meet Popat
// Provides a reusable controlled form for creating and editing student surveys.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSurvey, updateSurvey } from "../services/surveyApi";

const campusOptions = [
  "Students", "Location", "Campus",
  "Atmosphere", "Dorm Rooms", "Sports"
];

const interestOptions = [
  "Friends", "Television", "Internet", "Other"
];

const recommendationOptions = [
  "Very Likely", "Likely", "Unlikely"
];

const emptyForm = {
  first_name: "",
  last_name: "",
  street_address: "",
  city: "",
  state: "",
  zip_code: "",
  telephone: "",
  email: "",
  survey_date: new Date().toLocaleDateString("en-CA"),
  liked_most: [],
  interest_source: "",
  recommendation: "",
  raffle: "",
  comments: ""
};

export default function SurveyForm({ initialData, surveyId }) {
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initialData,
    liked_most: initialData?.liked_most || []
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleCheckbox(event) {
    const { value, checked } = event.target;

    setForm(prev => ({
      ...prev,
      liked_most: checked
        ? [...prev.liked_most, value]
        : prev.liked_most.filter(item => item !== value)
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        ...form,
        interest_source: form.interest_source || null,
        recommendation: form.recommendation || null,
        raffle: form.raffle || null,
        comments: form.comments || null
      };

      if (surveyId) {
        await updateSurvey(surveyId, data);
      } else {
        await createSurvey(data);
      }

      navigate("/surveys");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-card">
      <h1>{surveyId ? "Edit Survey" : "Student Survey Form"}</h1>
      <p>Please share your experience visiting our campus.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            First Name *
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Last Name *
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="full-width">
            Street Address *
            <input
              name="street_address"
              value={form.street_address}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            City *
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            State *
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            ZIP Code *
            <input
              name="zip_code"
              value={form.zip_code}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Telephone Number *
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Date of Survey *
            <input
              type="date"
              name="survey_date"
              value={form.survey_date}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <fieldset>
          <legend>What did you like most about our campus?</legend>

          <div className="options">
            {campusOptions.map(option => (
              <label key={option} className="option">
                <input
                  type="checkbox"
                  value={option}
                  checked={form.liked_most.includes(option)}
                  onChange={handleCheckbox}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>How did you become interested in the university?</legend>

          <div className="options">
            {interestOptions.map(option => (
              <label key={option} className="option">
                <input
                  type="radio"
                  name="interest_source"
                  value={option}
                  checked={form.interest_source === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <label>
          Likelihood of recommending this school
          <select
            name="recommendation"
            value={form.recommendation || ""}
            onChange={handleChange}
          >
            <option value="">Select an option</option>

            {recommendationOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Raffle Numbers (Optional)
          <input
            name="raffle"
            placeholder="Example: 1, 5, 10, 20"
            value={form.raffle || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Additional Comments
          <textarea
            name="comments"
            rows="5"
            value={form.comments || ""}
            onChange={handleChange}
            placeholder="Share your experience..."
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>
            {loading
              ? "Saving..."
              : surveyId ? "Update Survey" : "Submit Survey"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/surveys")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
