/*
Author: Meet Rajesh Popat
Course: SWE 645
Purpose: Client-side behavior and validation for the Student Survey, including the raffle-number requirement.
*/

const form = document.getElementById("studentSurvey");
const raffleInput = document.getElementById("raffle");
const raffleError = document.getElementById("raffleError");
const formMessage = document.getElementById("formMessage");
const surveyDate = document.getElementById("surveyDate");

// Pre-fill the survey date with today's date while still allowing the user to change it.
if (surveyDate && !surveyDate.value) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  surveyDate.value = localDate;
}

function validateRaffle() {
  const rawValue = raffleInput.value.trim();

  if (!rawValue) {
    raffleError.textContent = "Raffle is required.";
    raffleInput.setCustomValidity("Please enter the raffle numbers.");
    return false;
  }

  const values = rawValue.split(",").map(value => value.trim());

  if (values.length < 10) {
    raffleError.textContent = "Please enter at least 10 comma-separated numbers.";
    raffleInput.setCustomValidity("At least 10 numbers are required.");
    return false;
  }

  const invalidValue = values.find(value => {
    if (!/^\d+$/.test(value)) {
      return true;
    }

    const number = Number(value);
    return number < 1 || number > 100;
  });

  if (invalidValue !== undefined) {
    raffleError.textContent = "Every raffle entry must be a whole number from 1 through 100.";
    raffleInput.setCustomValidity("Numbers must be whole numbers from 1 through 100.");
    return false;
  }

  raffleError.textContent = "";
  raffleInput.setCustomValidity("");
  return true;
}

raffleInput.addEventListener("input", validateRaffle);

form.addEventListener("submit", event => {
  event.preventDefault();

  const raffleIsValid = validateRaffle();

  if (!form.checkValidity() || !raffleIsValid) {
    form.reportValidity();
    formMessage.classList.remove("show");
    return;
  }

  formMessage.textContent =
    "Survey submitted successfully. Thank you for sharing your feedback!";
  formMessage.classList.add("show");
  formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
});

form.addEventListener("reset", () => {
  raffleError.textContent = "";
  raffleInput.setCustomValidity("");
  formMessage.textContent = "";
  formMessage.classList.remove("show");

  // Restore today's date after the browser completes the reset.
  window.setTimeout(() => {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    surveyDate.value = localDate;
  }, 0);
});
