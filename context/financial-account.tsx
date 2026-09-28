"use client";

import { ConvertedFinancialAccount } from "@/libs/types";
import { createContext } from "react";

export const FinancialContext = createContext<ConvertedFinancialAccount[] | null>(null)