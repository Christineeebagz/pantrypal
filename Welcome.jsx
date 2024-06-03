import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signin");
  };

  return (
    <div>
      Welcome Page Hello new new
      <button onClick={handleSignUpClick}>Sign In</button>
    </div>
  );
};

export default Welcome;
