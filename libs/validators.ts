import { AccountType } from "@/prisma/app/generated/prisma/enums";
import path from "path"
import {email, z} from "zod"

// schema definition for authentication
export const signupSchema = z.object({
    firstName: z.string().min(1, "first name is required"),
    lastName: z.string().min(1, "last name is requied"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 8 characters long")
})

// for input schema
export const incomeSchema = z.object({
    amount:z.coerce.number().positive("Amount must be greater than 0"),
    source: z.string("source is required"),
    date:z.coerce.date("date is required"),
    accountId: z.string("account is required"),
    description: z.optional(z.string())
})

// for account schema
export const accountSchema = z.object({
    name: z.string().min(1, "account name is required"),
    accountNumber: z.optional(z.string()),
    type: z.enum(AccountType),
    balance: z.coerce.number("account balance is required")
})


// forgot password input
export const forgotPasswordSchema = z.object({
    email: z.email("invalid email address")
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type SignUpSchema = z.infer<typeof signupSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type IncomeSchema = z.infer<typeof incomeSchema>
export type AccountSchema = z.infer<typeof accountSchema>
