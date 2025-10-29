// src/components/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 border p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
