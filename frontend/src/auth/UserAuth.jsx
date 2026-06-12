import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(userContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [token, userData, navigate]);
  

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserAuth;