"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { accountSchema } from "@/libs/validators";
import { AccountType } from "@/prisma/app/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const accountTypeOptions = Object.values(AccountType).map((type) => ({
  value: type,
  label: type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, " "),
}));

export default function FinancialAccountsForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      balance: 0,
      accountNumber: "",
      type: "BANK",
    },
  });

  const onSubmit = async (values: z.input<typeof accountSchema>) => {
    startTransition(async () => {
      try {
        const response = await axios.post("/api/financial-accounts", values);
        router.refresh();
        if (response.status === 200){
          toast.success(response.data.message)
        }
        setOpen(false)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("something went wrong");
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant={"outline"}>Add account</Button>}
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">
              Add account
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Add a new financial account to track balances and transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-medium text-muted-foreground"
            >
              Account name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Main checking"
              {...form.register("name", { required: true })}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="balance"
                className="text-xs font-medium text-muted-foreground"
              >
                Balance
              </Label>
              <Input
                id="balance"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="0.00"
                {...form.register("balance", { required: true })}
              />
              {form.formState.errors.balance && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.balance.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="type"
                className="text-xs font-medium text-muted-foreground"
              >
                Type
              </Label>
              <Controller
                render={({ field }) => (
                  <Select
                    items={accountTypeOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {accountTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                control={form.control}
                name="type"
              />
              {form.formState.errors.type && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="accountNumber"
              className="text-xs font-medium text-muted-foreground"
            >
              Account number
            </Label>
            <Input
              id="accountNumber"
              placeholder="Optional"
              {...form.register("accountNumber")}
            />
            {form.formState.errors.accountNumber && (
              <p className="text-xs text-destructive">
                {form.formState.errors.accountNumber.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isPending}>Add account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
