import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GLogin = () => {
  const handleLoginSuccess = (credentialResponse) => {
    console.log("Google login successful:", credentialResponse);

    // Redirect to backend route for authentication
    window.location.href = `http://localhost:5000/auth/google?token=${credentialResponse.credential}`;
  };

  const handleLoginFailure = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId="">
      <div>
        <h1>Login with Google</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GLogin;
