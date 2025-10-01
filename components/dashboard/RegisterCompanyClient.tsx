import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import RegisterCompanyForm from "./RegisterCompanyForm";

const RegisterCompanyClient = () => {
  console.log("meow meow");
  return (
    <Dialog open>
      <DialogContent className="lg:min-w-[700px]">
        <DialogHeader>
          <DialogTitle>Register Company</DialogTitle>
        </DialogHeader>
        <RegisterCompanyForm />
      </DialogContent>
    </Dialog>
  );
};

export default RegisterCompanyClient;
