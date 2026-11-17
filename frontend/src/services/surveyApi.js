// Handles all HTTP communication with the FastAPI Student Survey service.

const API_URL = "/api/surveys";

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const error = await response.json();

      if (typeof error.detail === "string") {
        message = error.detail;
      } else if (Array.isArray(error.detail)) {
        message = error.detail
          .map(item => `${item.loc.join(".")}: ${item.msg}`)
          .join("; ");
      }
    } catch {
      // Keep the default HTTP error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getSurveys() {
  return request(API_URL);
}

export function getSurvey(id) {
  return request(`${API_URL}/${id}`);
}

export function createSurvey(data) {
  return request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function updateSurvey(id, data) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function deleteSurvey(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}
