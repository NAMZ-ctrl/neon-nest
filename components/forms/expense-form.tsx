"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { expenseSchema } from "@/libs/validators";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
import { ExpenseCategory } from "@/prisma/app/generated/prisma/enums";

interface ExpenseFormProps {
  financialAccountData: ConvertedFinancialAccount[] | null | undefined;
}

const expenseCategoryOptions = Object.values(ExpenseCategory).map((type) => ({
  value: type,
  label: type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, " "),
}));
export default function ExpenseForm({
  financialAccountData,
}: ExpenseFormProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updatedFinancialAccountData = financialAccountData?.map((account) => ({
    value: account.id,
    label: account.name,
    isActive: account.isActive,
  }));

  const disabled =
    !updatedFinancialAccountData || updatedFinancialAccountData.length === 0;

  const form = useForm<z.input<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),

    defaultValues: {
      amount: 0,
      category: "FOOD",
      date: new Date(),
      accountId: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.input<typeof expenseSchema>) => {
    startTransition(async () => {
      try {
        const response = await axios.post("/api/expense", values);

        if (response.status === 200) {
          toast.success(response.data.message);

          form.reset();
          router.refresh();
          setOpen(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message ?? "Unable to add expense");
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline">Add expense</Button>} />

      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">
              Add expense
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground">
              Record a new expense against one of your accounts.
            </DialogDescription>
          </DialogHeader>

          {disabled && (
            <div className="rounded-md border border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
              <p>You need a financial account before you can add an expense.</p>

              <Link
                href="/financial-accounts"
                className="mt-1 inline-block text-sm font-medium underline underline-offset-4"
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
              {/* Amount */}

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
                  {...form.register("amount")}
                />

                {form.formState.errors.amount && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>

              {/* Date */}

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

            {/* Category */}

            <div className="space-y-1.5">
              <Label
                htmlFor="category"
                className="text-xs font-medium text-muted-foreground"
              >
                Type
              </Label>
              <Controller
                render={({ field }) => (
                  <Select
                    items={expenseCategoryOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {expenseCategoryOptions.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                control={form.control}
                name="category"
              />
              {form.formState.errors.category && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            {/* Account */}

            <div className="space-y-1.5">
              <Label
                htmlFor="account"
                className="text-xs font-medium text-muted-foreground"
              >
                Account
              </Label>

              <Controller
                control={form.control}
                name="accountId"
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
              />

              {form.formState.errors.accountId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.accountId.message}
                </p>
              )}
            </div>

            {/* Description */}

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

            <Button type="submit" disabled={isPending || disabled}>
              {isPending ? "Adding..." : "Add expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
