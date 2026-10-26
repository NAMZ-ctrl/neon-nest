"use client";

import { defineStepper } from "@stepperize/react";
import ForgotPasswordEmailInput from "./forgot-password-input";
import OtpInput from "./otp-input";
import { useState, useEffect } from "react";
import { title } from "process";
import NewPassword from "./write-new-password";

interface StepperProps {
  email: string;
}

const otpStepper = defineStepper([
  {
    id: "email",
    title: "Forgot password?",
    description: "Enter your email and we'll send you a verification code.",
  },
  {
    id: "otp",
    title: "Check your email",
    description: "Enter the 6-digit verification code we sent to your email.",
  },
  {
    id: "write-password",
    title: "Write new password",
    description: "enter your new password"
  }
]);

export const StepperComponent = ({ email }: StepperProps) => {
  const stepper = otpStepper.useStepper();
  const [stepperInput, setStepperInput] = useState("");
  console.log("stepper input", stepperInput);
  useEffect(() => {
  const savedStep = sessionStorage.getItem("password-reset-step");

  if (savedStep === "otp") {
    stepper.goTo("otp");
  }

  if (savedStep === "write-password") {
    stepper.goTo("write-password");
  }
}, []);
  return (
    <section className="h-[430px] w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
          {stepper.current.title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {stepper.current.description}
        </p>
      </div>

      {stepper.match({
        email: () => (
          <ForgotPasswordEmailInput
            emailInput={stepperInput}
            setEmailInput={setStepperInput}
            email={email}
            onSuccess={() => {
              sessionStorage.setItem("password-reset-step", "otp");
              stepper.next();
            }}
          />
        ),
        otp: () => (
          <OtpInput
            email={stepperInput}
            onSuccess={() => {
              sessionStorage.setItem("password-reset-step", "write-password");
              stepper.next();
            }}
            
          />
        ),
        "write-password": () => (
            <NewPassword />
        )
      })},
      
    </section>
  );
};
