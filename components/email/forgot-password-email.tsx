
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ForgotPasswordEmailProps {
  otp: string;
}

export default function ForgotPasswordEmail({
  otp,
}: ForgotPasswordEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        Your NeonNest password reset code is {otp}
      </Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Brand */}
          <Section style={header}>
            <Text style={logo}>NeonNest</Text>
          </Section>

          <Heading style={heading}>Reset your password</Heading>

          <Text style={paragraph}>
            We received a request to reset the password for your NeonNest
            account. Use the verification code below to continue.
          </Text>

          {/* OTP */}
          <Section style={otpContainer}>
            <Text style={otpLabel}>YOUR VERIFICATION CODE</Text>

            <Text style={otpCode}>{otp}</Text>

            <Text style={expiry}>
              This code expires in <strong>10 minutes</strong>.
            </Text>
          </Section>

          {/* Warning */}
          <Section style={warning}>
            <Text style={warningTitle}>Keep this code private</Text>

            <Text style={warningText}>
              Do not share this code with anyone. NeonNest will never ask you
              to provide this code outside the password reset process.
            </Text>
          </Section>

          <Text style={paragraph}>
            If you didn't request a password reset, you can safely ignore this
            email. Your password will remain unchanged.
          </Text>
    
          <Hr style={divider} />

          <Text style={footer}>
            This is an automated security email from NeonNest.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: "40px 12px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "40px",
};

const header = {
  marginBottom: "32px",
};

const logo = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0",
};

const heading = {
  color: "#111827",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#4b5563",
  fontSize: "15px",
  lineHeight: "24px",
};

const otpContainer = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  margin: "28px 0",
  padding: "24px",
  textAlign: "center" as const,
};

const otpLabel = {
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  margin: "0 0 12px",
};

const otpCode = {
  color: "#111827",
  fontSize: "40px",
  fontWeight: "800",
  letterSpacing: "8px",
  lineHeight: "1",
  margin: "12px 0 18px",
};

const expiry = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0",
};

const warning = {
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "8px",
  margin: "24px 0",
  padding: "16px 18px",
};

const warningTitle = {
  color: "#9a3412",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 5px",
};

const warningText = {
  color: "#9a3412",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "32px 0 20px",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
};