"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Countdown from "react-countdown";
import { useState, useEffect } from "react";
export default function OtpInput() {
  const [countdownDate, setCountdownDate] = useState<number | null>(null);

  useEffect(() => {
    setCountdownDate(Date.now() + 60_000);
  }, []);
  return (
    <>
      <Field className="w-full">
        <FieldLabel
          htmlFor="digits-only"
          className="text-sm font-medium text-gray-700"
        >
          Verification code
        </FieldLabel>

        <InputOTP
          id="digits-only"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          className="w-full"
        >
          <InputOTPGroup className="grid w-full grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-12 w-full rounded-md border border-gray-300 bg-white text-lg text-gray-950 shadow-sm"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Field>
      <div className="mt-5 text-center text-sm text-gray-500">
        <span>Didn't receive the code? </span>

        {countdownDate && (
          <Countdown
            date={countdownDate}
            renderer={({ seconds, completed }) => {
              if (completed) {
                return (
                  <button
                    type="button"
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Resend code
                  </button>
                );
              }

              return (
                <span className="font-medium text-gray-700">
                  Resend in {seconds}s
                </span>
              );
            }}
          />
        )}
      </div>
    </>
  );
}
