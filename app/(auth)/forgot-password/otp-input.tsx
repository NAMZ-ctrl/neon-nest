"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import Countdown from "react-countdown";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface OtpInputProps {
  email: string;
  onSuccess: () => void;

}

export default function OtpInput({ email, onSuccess }: OtpInputProps) {
  const [otp, setOtp] = useState("");
  const [countdownDate, setCountdownDate] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Start the countdown when the OTP step appears
  useEffect(() => {

    setCountdownDate(Date.now() + 60_000);
  }, []);

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit verification code");
      return;
    }

    try {
      setIsVerifying(true);

      const response = await axios.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      if (response.status === 200) {
        toast.success(response.data.message ?? "Code verified");

        // Move Stepperize to the next step
        onSuccess();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      setIsResending(true);

      const response = await axios.post("/api/auth/forgot-password", {
        email,
      });

      if (response.status === 200) {
        toast.success(response.data.message ?? "New code sent");

        // Clear the old OTP
        setOtp("");

        // Restart countdown
        setCountdownDate(Date.now() + 60_000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Unable to resend code");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Field className="w-full">
        <FieldLabel
          htmlFor="verification-code"
          className="text-sm font-medium text-black"
        >
          Verification code
        </FieldLabel>

        <InputOTP
          id="verification-code"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
          className="w-full"
        >
          <InputOTPGroup className="grid w-full grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-12 w-full rounded-md border border-gray-300 bg-white text-lg text-black shadow-sm"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Field>

      {/* Resend section */}
      <div className="text-center text-sm text-gray-500">
        <span>Didn't receive the code? </span>
        {countdownDate && (
          <Countdown
            key={countdownDate}
            date={countdownDate}
            renderer={({ seconds, completed }) => {
              if (completed) {
                return (
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isResending}
                    className="font-medium text-black hover:underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend code"}
                  </button>
                );
              }

              return (
                <span className="font-medium text-gray-700">
                  Resend in 00:{String(seconds).padStart(2, "0")}
                </span>
              );
            }}
          />
        )}
      </div>

      {/* Verify button */}
      <Button
        type="button"
        onClick={verifyOtp}
        disabled={otp.length !== 6 || isVerifying}
        className="h-11 w-full bg-black text-white hover:bg-gray-800"
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify code"
        )}
      </Button>
    </div>
  );
}
