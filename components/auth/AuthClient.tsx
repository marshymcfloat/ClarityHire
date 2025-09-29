"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type ContentType = "LOGIN" | "REGISTER";
const AuthClient = () => {
  const [content, setContent] = useState<ContentType>("LOGIN");

  return (
    <>
      {content === "LOGIN" ? (
        <LoginForm onRegister={() => setContent("REGISTER")} />
      ) : (
        <RegisterForm onBack={() => setContent("LOGIN")} />
      )}
    </>
  );
};

export default AuthClient;
