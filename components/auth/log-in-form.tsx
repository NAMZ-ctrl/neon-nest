"use client";

import Link from "next/link";
import { loginSchema, LoginSchema } from "@/libs/validators";
import { Button } from "../ui/button";
import { Input } from "@base-ui/react/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [logInErrorMessage, SetLogInErrorMessage] = useState("");
  const [togglePasswordVisibility, setTogglePasswordVisibility] =
    useState(false);
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    const resp = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (resp?.error) {
      SetLogInErrorMessage("Invalid credentials");
    } else {
      router.push("/income");
      router.refresh();
    }
  };

  const handleRedirect = () => {
    router.push(`/forgot-password?email=${form.getValues("email") ?? ""}`)
  }
  
  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* email input */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-widest text-black/50"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={form.formState.isSubmitting}
            className="w-full px-3.5 py-2.5 border border-black/15 rounded-lg text-sm bg-white transition-all duration-200 outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 disabled:opacity-50 text-black"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-600 font-medium">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* password input */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-widest text-black/50"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Input
              id="password"
              placeholder="Enter your password"
              disabled={form.formState.isSubmitting}
              className="w-full px-3.5 py-2.5 pr-11 border border-black/15 rounded-lg text-sm bg-white transition-all duration-200 outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 disabled:opacity-50 text-black"
              {...form.register("password")}
              type={togglePasswordVisibility ? "text" : "password"}
            />
            <Button
              type="button"
              tabIndex={-1}
              onClick={() => setTogglePasswordVisibility((prev) => !prev)}
              className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center text-black/40 hover:text-black transition-colors bg-transparent border-0 rounded-r-lg cursor-pointer"
            >
              {togglePasswordVisibility ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-600 font-medium">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
          <div>
            {logInErrorMessage && <p className="text-xs text-red-600 font-medium">
                {logInErrorMessage}
            </p>}
          </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full mt-2 inline-flex items-center justify-center rounded-lg text-sm font-semibold uppercase tracking-wide h-11 px-4 bg-black text-white transition-all duration-200 hover:bg-black/85 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-black/50">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-black hover:underline underline-offset-4"
        >
          Create one
        </Link>
      </p>

      <Button onClick={handleRedirect}>
          Forget Password
      </Button>
    </div>
  );
}
