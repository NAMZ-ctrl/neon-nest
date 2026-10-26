"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseCategory } from "@/prisma/app/generated/prisma/enums";
import { z } from "zod";
import { budgetSchema, BudgetFormData } from "@/libs/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Check, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const expenseCategories = Object.values(ExpenseCategory);

export default function BudgetForm() {
  const [open, setOpen] = useState(false);
  const currentDate = new Date();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Temporary inputs before they become a pill
  const [category, setCategory] = useState<ExpenseCategory | "">("");

  const [amount, setAmount] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),

    defaultValues: {
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      categories: [],
    },
  });

  const selectedCategories = watch("categories");

  const addCategory = () => {
    if (!category || !amount) return;

    const parsedAmount = Number(amount);

    if (parsedAmount <= 0) return;

    const alreadyExists = selectedCategories.some(
      (item) => item.category === category,
    );

    if (alreadyExists) return;

    setValue(
      "categories",
      [
        ...selectedCategories,
        {
          category,
          amount: parsedAmount,
        },
      ],
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    // Clear the small category form
    setCategory("");
    setAmount("");
  };

  const removeCategory = (categoryToRemove: ExpenseCategory) => {
    setValue(
      "categories",
      selectedCategories.filter((item) => item.category !== categoryToRemove),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const totalBudget = selectedCategories.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const onSubmit = async (values: BudgetFormData) => {
    startTransition(async () => {
      try {
        const response = await axios.post("/api/budget", values);
        if (response.status === 200) {
          toast.success(response.data.message);
        }
        router.refresh();
        setOpen(false);
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
        render={
          <Button>
            <Plus className="size-4" />
            Create Budget
          </Button>
        }
      />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>

          <DialogDescription>
            Set your monthly spending limits by category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Month + Year */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>

              <Controller
                control={control}
                name="month"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>

                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem
                          key={month.value}
                          value={String(month.value)}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.month && (
                <p className="text-sm text-destructive">
                  {errors.month.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium">
                Year
              </label>

              <Input
                id="year"
                type="number"
                className="w-full"
                {...register("year", {
                  valueAsNumber: true,
                })}
              />

              {errors.year && (
                <p className="text-sm text-destructive">
                  {errors.year.message}
                </p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Budget categories</h3>

              <p className="text-sm text-muted-foreground">
                Add a spending limit for each category.
              </p>
            </div>

            {/* Pills */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((item) => (
                  <Popover key={item.category}>
                    <PopoverTrigger>
                      <Badge
                        variant="outline"
                        className="cursor-pointer gap-2 border-green-200 bg-green-50 px-3 py-2 text-green-700"
                      >
                        <Check className="size-3.5" />

                        {formatCategory(item.category)}

                        <span className="font-semibold">
                          ₦{item.amount.toLocaleString()}
                        </span>

                        <MoreHorizontal className="size-3.5" />
                      </Badge>
                    </PopoverTrigger>

                    <PopoverContent align="start" className="w-56">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">
                            {formatCategory(item.category)}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            ₦{item.amount.toLocaleString()} spending limit
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => removeCategory(item.category)}
                        >
                          <Trash2 className="size-4" />
                          Remove
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            )}

            {/* Add Category */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>

                <Select
                  value={category}
                  onValueChange={(value) =>
                    setCategory(value as ExpenseCategory)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {expenseCategories.map((expenseCategory) => {
                      const alreadyAdded = selectedCategories.some(
                        (item) => item.category === expenseCategory,
                      );

                      return (
                        <SelectItem
                          key={expenseCategory}
                          value={expenseCategory}
                          disabled={alreadyAdded}
                        >
                          {formatCategory(expenseCategory)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="categoryAmount" className="text-sm font-medium">
                  Spending limit
                </label>

                <Input
                  id="categoryAmount"
                  type="number"
                  min="1"
                  placeholder="₦ 0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addCategory}
                disabled={!category || !amount}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>

            {errors.categories?.message && (
              <p className="text-sm text-destructive">
                {errors.categories.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total monthly budget
              </p>

              <p className="mt-1 text-xl font-semibold">
                ₦{totalBudget.toLocaleString()}
              </p>
            </div>

            <DialogFooter>
              <DialogClose
                render={
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                }
              />

              <Button type="submit">
                {isPending ? "Creating" : "Create budget"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function formatCategory(category: ExpenseCategory) {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
