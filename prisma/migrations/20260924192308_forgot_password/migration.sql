-- CreateTable
CREATE TABLE "PasswordResetOTP" (
    "id" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PasswordResetOTP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PasswordResetOTP" ADD CONSTRAINT "PasswordResetOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
