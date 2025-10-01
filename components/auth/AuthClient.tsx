"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type ContentType = "LOGIN" | "REGISTER";
const AuthClient = ({ className }: { className?: string }) => {
  const [content, setContent] = useState<ContentType>("LOGIN");

  return (
    <>
      {content === "LOGIN" ? (
        <LoginForm
          className={className}
          onRegister={() => setContent("REGISTER")}
        />
      ) : (
        <RegisterForm
          className={className}
          onBack={() => setContent("LOGIN")}
        />
      )}
    </>
  );
};

export default AuthClient;
