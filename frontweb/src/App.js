import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./templates/Login";
import Register from "./templates/Register";
import Home from "./templates/Home";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import Admin from "./templates/Admin";
import Reports from "./templates/Reports";
import Chat from "./templates/Chat";
import Settings from "./templates/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
  <Route path="/home" element={<AuthenticatedLayout><Home /></AuthenticatedLayout>} />
  <Route path="/admin" element={<AuthenticatedLayout><Admin /></AuthenticatedLayout>} />
  <Route path="/reports" element={<AuthenticatedLayout><Reports /></AuthenticatedLayout>} />
  <Route path="/chat" element={<AuthenticatedLayout><Chat /></AuthenticatedLayout>} />
  <Route path="/settings" element={<AuthenticatedLayout><Settings /></AuthenticatedLayout>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
