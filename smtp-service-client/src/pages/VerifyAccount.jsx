import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Verify = () => {
  const { verifyAccount } = useAuth();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      await verifyAccount(token);
      setLoading(false);
    };

    if (token) {
      verify();
    }
  }, [token, verifyAccount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Account Verification</h2>

      {loading && <p className="text-gray-600">Verifying your account...</p>}

      {!loading && (
        <p className="text-green-600 font-medium">
          ✅ Your account has been verified successfully!
        </p>
      )}
    </div>
  );
};

export default Verify;
