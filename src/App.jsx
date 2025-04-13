import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home";
import InsightsPage from "./Pages/InsightsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subject/:subject_id" element={<InsightsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
