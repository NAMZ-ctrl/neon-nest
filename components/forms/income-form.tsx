"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { incomeSchema } from "@/libs/validators";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FinancialAccountResponse } from "@/libs/api-helper";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import axios from "axios";
import { ConvertedFinancialAccount } from "@/libs/types";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { ro } from "zod/v4/locales";

interface IncomeFormProps {
  financialAccountData: ConvertedFinancialAccount[] | null | undefined;
}
export default function IncomeForm({ financialAccountData }: IncomeFormProps) {
  const updatedFinancialAccountData = financialAccountData?.map(
    (account) => ({
      value: account.id,
      label: account.name,
      isActive: account.isActive,
    })
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const disabled =
    !updatedFinancialAccountData || updatedFinancialAccountData.length === 0;
  // used z.input because of the number type issue
  const form = useForm<z.input<typeof incomeSchema>>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: 0,
      source: "",
      date: new Date(),
      accountId: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.input<typeof incomeSchema>) => {
    startTransition(async () => {
      try {
        const response = await axios.post("/api/income", values);
        if (response.status === 200){
          toast.success(response.data.message)
        }
        router.refresh();
        setOpen(false)
      } catch (error) {
        if (axios.isAxiosError(error)){
          toast.error(error.response?.data.message)
        }else{
          toast.error("something went wrong");
        }
      }
    })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={"outline"}>Add income</Button>} />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">
              Add income
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Record a new income entry against one of your accounts.
            </DialogDescription>
          </DialogHeader>

          {disabled && (
            <div className="rounded-md border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
              <p>You need a financial account before you can add income.</p>
              <Link
                href="/financial-accounts"
                className="mt-1 inline-block text-sm font-medium text-muted-foreground underline underline-offset-4 decoration-muted-foreground/40 transition-colors hover:text-foreground"
              >
                Create a financial account
              </Link>
            </div>
          )}

          <fieldset
            disabled={disabled}
            className="space-y-5 disabled:opacity-50"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="amount"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...form.register("amount", { required: true })}
                />
                {form.formState.errors.amount && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="date"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Date
                </Label>
                <Input id="date" type="date" {...form.register("date")} />
                {form.formState.errors.date && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="source"
                className="text-xs font-medium text-muted-foreground"
              >
                Source
              </Label>
              <Input
                id="source"
                placeholder="e.g. Salary, Freelance client"
                {...form.register("source", { required: true })}
              />
              {form.formState.errors.source && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.source.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="account"
                className="text-xs font-medium text-muted-foreground"
              >
                Account
              </Label>
              <Controller
                render={({ field }) => (
                  <Select
                    items={updatedFinancialAccountData}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="account" className="w-full">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {updatedFinancialAccountData?.map(
                          (account) =>
                            account.isActive && (
                              <SelectItem
                                key={account.value}
                                value={account.value}
                              >
                                {account.label}
                              </SelectItem>
                            ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                control={form.control}
                name="accountId"
              />
              {form.formState.errors.accountId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.accountId.message}
                </p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-medium text-muted-foreground"
              >
                Description
              </Label>
              <Input
                id="description"
                placeholder="Optional note"
                {...form.register("description")}
              />
            </div>
          </fieldset>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add income"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
