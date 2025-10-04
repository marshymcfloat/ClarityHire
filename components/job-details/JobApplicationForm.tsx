"use client";

import { useForm } from "react-hook-form";
import { Form } from "../ui/form";

const JobApplicationForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <form action=""></form>
    </Form>
  );
};

export default JobApplicationForm;
