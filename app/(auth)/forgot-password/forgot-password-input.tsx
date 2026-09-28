"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

import { ForgotPasswordSchema, forgotPasswordSchema } from "@/libs/validators";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordInputProps {
  email: string;
  onSuccess: () => void
}

export default function ForgotPasswordEmailInput({
  email,
  onSuccess
}: ForgotPasswordInputProps) {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: email ?? "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchema) => {
    try {
      await axios.post("/api/auth/forgot-password", values);

      toast.success("Verification code sent");

      onSuccess()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Unable to send verification code",
        );
      } else {
        toast.error("Something went wrong. Try again.");
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...form.register("email")}
          className="h-11 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-1"
        />

        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-11 w-full bg-gray-950 text-white hover:bg-gray-800"
      >
        {form.formState.isSubmitting ? "Sending..." : "Send verification code"}
      </Button>

      <p className="pt-1 text-center text-sm text-gray-500">
        Remembered your password?{" "}
        <a href="/log-in" className="font-medium text-gray-900 hover:underline">
          Back to login
        </a>
      </p>
    </form>
  );
}
