import React from "react";
import { Routes, Route } from "react-router-dom";
import VerifyAccount from "./pages/VerifyAccount";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import Navbar from "./components/Navbar";
import ApiKeys from "./pages/ApiKeys";
import Documentations from "./pages/Documentations";
import CheckColor from "./pages/CheckColor";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-16">
        {" "}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<VerifyAccount />} />
          <Route path="/documentations" element={<Documentations />} />
          <Route path="/checkcolor" element={<CheckColor />} />

          {/* protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/apikeys" element={<ApiKeys />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
