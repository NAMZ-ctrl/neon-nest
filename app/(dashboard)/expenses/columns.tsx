"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "../../../components/shared/data-table-features";

import { EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { useEffect, useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { ConvertedExpense, RemoveDialogProp } from "@/libs/types";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const expenseColumnHelper = createColumnHelper<
  DataTableFeatures,
  ConvertedExpense
>();

export const DeleteExpenseDialog = (props: RemoveDialogProp) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm();

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        const response = await axios.delete(`/api/expense/${props.id}`);

        if (response.status === 200) {
          toast.success(response.data.message);
        }

        router.refresh();
        props.setDeleteOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ?? "Unable to delete expense",
          );
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  };

  return (
    <Dialog open={props.open} onOpenChange={props.setDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>

          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            expense.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">No</Button>} />

            <Button type="submit">{isPending ? "Deleting..." : "Yes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const expenseColumns = expenseColumnHelper.columns([
  expenseColumnHelper.accessor("id", {
    header: "id",
  }),

  expenseColumnHelper.accessor("accountId", {
    header: "Account",

    cell: ({ row }) => {
      const [accountName, setAccountName] = useState<string | null>(null);

      const accountId = row.getValue("accountId") as string;

      useEffect(() => {
        const fetchAccountName = async () => {
          try {
            const response = await axios.get(
              `/api/financial-accounts/${accountId}`,
            );

            setAccountName(response.data.data || "NaN");
          } catch (error) {
            console.error("Error fetching account name:", error);
          }
        };

        fetchAccountName();
      }, [accountId]);

      return <span>{accountName}</span>;
    },
  }),

  expenseColumnHelper.accessor("amount", {
    header: "Amount",
  }),

  expenseColumnHelper.accessor("category", {
    header: "Category",
  }),

  expenseColumnHelper.accessor("date", {
    header: "Date",

    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));

      const shortDayMonth = date.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
      });

      return <span>{shortDayMonth}</span>;
    },
  }),

  expenseColumnHelper.accessor("description", {
    header: "Description",
  }),

  expenseColumnHelper.display({
    id: "actions",

    cell: ({ row }) => {
      const [deleteOpen, setDeleteOpen] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <EllipsisVertical />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => console.log("edit")}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setDeleteOpen(true)}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteExpenseDialog
            open={deleteOpen}
            setDeleteOpen={setDeleteOpen}
            id={row.getValue("id")}
          />
        </>
      );
    },
  }),
]);
