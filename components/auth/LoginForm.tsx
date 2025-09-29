"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginFormSchema,
  LoginFormValues,
} from "@/zod schemas/authSchemas/authSchema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

const LoginForm = ({ onRegister }: { onRegister: () => void }) => {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginForms = Object.keys(form.getValues()) as (keyof LoginFormValues)[];

  const { isSubmitting } = form.formState;

  async function onSubmit() {
    const username = form.getValues("username");
    const password = form.getValues("password");

    const response = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (response?.ok) {
      toast("Login Successfully, Please wait for redirection");
      router.refresh();
    } else {
      const errorMessage = response?.error || "an unknown error occured";
      toast(errorMessage);
    }
  }

  const isDisabled = isSubmitting;

  return (
    <Card className="lg:w-[420px] md:w-[70%] w-[90%] ">
      <CardHeader>
        <CardTitle className="text-center text-xl uppercase">Login</CardTitle>
      </CardHeader>
      <CardContent className="">
        <Form {...form}>
          <form className=" space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {loginForms.map((input) => (
              <FormField
                key={input}
                control={form.control}
                name={input}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{input}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={input === "password" ? "password" : "text"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button className="w-full mt-6" type="submit" disabled={isDisabled}>
              {isDisabled && <LoaderCircle className="animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
        <div className="flex gap-2 items-center my-4 relative ">
          <Separator className="flex-1" />
          <h1 className="font-medium uppercase">or</h1>
          <Separator className="flex-1" />
        </div>
        <Button
          className="w-full"
          onClick={() => signIn("google")}
          disabled={isDisabled}
        >
          {isDisabled && <LoaderCircle className="animate-spin" />}
          Sign in with Google
        </Button>
        <Button
          disabled={isDisabled}
          variant={"ghost"}
          className=" w-full underline mt-4 underline-offset-2"
          onClick={onRegister}
        >
          Create an account
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
