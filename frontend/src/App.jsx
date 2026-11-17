// Meet Popat
// Defines navigation routes for the survey application.

import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SurveyForm from "./components/SurveyForm";
import Home from "./pages/Home";
import SurveyList from "./pages/SurveyList";
import EditSurvey from "./pages/EditSurvey";

export default function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey" element={<SurveyForm />} />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/surveys/:id/edit" element={<EditSurvey />} />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </main>
    </>
  );
}
