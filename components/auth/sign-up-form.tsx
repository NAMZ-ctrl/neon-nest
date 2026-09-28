"use client";

import { signupSchema, SignUpSchema } from "@/libs/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpSchema) => {
    try {
      const response = await axios.post("/api/auth/signup", values);

      // Automatically sign the user in after successful signup
      if (response.status === 201) {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputClass =
    "h-11 border-gray-300 bg-white text-black placeholder:text-gray-400 " +
    "focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/10";

  const labelClass = "text-sm font-medium text-black";

  const errorClass = "text-xs font-medium text-red-600";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className={labelClass}>
              First name
            </label>

            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="John"
              disabled={isSubmitting}
              className={inputClass}
            />

            {errors.firstName && (
              <p className={errorClass}>
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className={labelClass}>
              Last name
            </label>

            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
              disabled={isSubmitting}
              className={inputClass}
            />

            {errors.lastName && (
              <p className={errorClass}>
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>

          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john.doe@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            className={inputClass}
          />

          {errors.email && (
            <p className={errorClass}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={isSubmitting}
              className={`pr-11 ${inputClass}`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-black"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className={errorClass}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              disabled={isSubmitting}
              className={`pr-11 ${inputClass}`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              disabled={isSubmitting}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-black"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className={errorClass}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Form-level error */}
        {errors.root && (
          <p className="text-sm font-medium text-red-600">
            {errors.root.message}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-2 h-11 w-full rounded-lg
            bg-black text-sm font-semibold text-white
            transition-all duration-200
            hover:bg-gray-800
            active:scale-[0.98]
            disabled:active:scale-100
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/log-in"
          className="font-semibold text-black underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}