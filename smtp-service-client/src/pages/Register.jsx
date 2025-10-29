import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // success or error

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await handleRegister(name, email, password);

    if (result.success) {
      setMessage(
        "✅ Registration successful! Please check your email to verify. Please check you inbox or spam box as well!w"
      );
      // Optionally redirect after few seconds
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setMessage(` ${result.message}`);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm mx-auto mt-10 p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Register</h2>

      {message && (
        <div
          className={`p-2 mb-3 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <input
        type="text"
        placeholder="Name"
        className="border w-full p-2 mb-3 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border w-full p-2 mb-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border w-full p-2 mb-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
