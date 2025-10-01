"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMutation } from "@tanstack/react-query";
import {
  registerFormSchema,
  RegisterFormValue,
} from "@/zod schemas/authSchemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { registerUserAction } from "@/lib/actions/authActions";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const RegisterForm = ({
  onBack,
  className,
}: {
  className?: string;
  onBack: () => void;
}) => {
  const router = useRouter();

  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerForms = Object.keys(
    form.getValues()
  ) as (keyof RegisterFormValue)[];

  const { mutate, isPending } = useMutation({
    mutationFn: registerUserAction,
    onSuccess: async (data) => {
      if (!data.success) {
        toast(data.error);
      } else {
        toast(data.message || "Created user successfully");

        const signInResult = await signIn("credentials", {
          username: data.data?.username,
          password: data.data?.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.refresh();
        } else {
          toast.error(
            "Registration successful, but auto-login failed. Please log in manually."
          );
        }
        onBack();
      }
    },
    onError: (error) => {
      toast.error(
        error.message || "An unexpected error occured during registration"
      );
    },
  });

  function handleSubmission(values: RegisterFormValue) {
    mutate(values);
  }

  const onDisable = isPending;

  return (
    <Card
      className={cn(
        "lg:w-[420px] md:w-[70%] w-[90%] relative bg-gray-200",
        className
      )}
    >
      <ChevronLeft
        onClick={onBack}
        className="absolute left-4 top-4 hover:bg-muted cursor-pointer duration-150 transition-colors rounded-full "
      />
      <CardHeader>
        <CardTitle className="text-center text-xl uppercase">
          Register
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmission)}
          >
            {registerForms.map((input) => (
              <FormField
                control={form.control}
                key={input}
                name={input}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{input}</FormLabel>
                    <FormControl>
                      <Input
                        type={
                          input === "email"
                            ? "email"
                            : input === "username"
                            ? "text"
                            : "password"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button className="w-full my-4" disabled={onDisable}>
              {onDisable && <LoaderCircle className="animate-spin" />}Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
