"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "../../../components/shared/data-table-features";
import { incomeSchema } from "@/libs/validators";
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
import z from "zod";
import { ConvertedIncome, RemoveDialogProp } from "@/libs/types";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
const incomeColumnHelper = createColumnHelper<
  DataTableFeatures,
  ConvertedIncome
>();

export const DeleteDialog = (props: RemoveDialogProp) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm();

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        const response = await axios.delete(`/api/income/${props.id}`);
        if (response.status === 200) {
          toast.success(response.data.message);
        }
        router.refresh();
        props.setDeleteOpen(false);
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
    <>
      <Dialog open={props.open} onOpenChange={props.setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              particular income data
            </DialogDescription>
          </DialogHeader>
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogFooter>
              <DialogClose render={<Button variant={"outline"}>No</Button>} />
              <Button type="submit">{isPending ? "Deleting..." : "yes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const incomeColumns = incomeColumnHelper.columns([
  incomeColumnHelper.accessor("id", {
    header: "id",
  }),
  incomeColumnHelper.accessor("accountId", {
    header: "Account",
    cell: ({ row }) => {
      const [accountName, setAccountName] = useState<string | null>(null);
      const accountId = row.getValue("accountId") as string;

      // fetch the account name based on the accountId
      useEffect(() => {
        const fetchAccountName = async () => {
          try {
            const resp = await axios.get(
              `/api/financial-accounts/${accountId}`,
            );
            setAccountName(resp.data.data || "NaN");
          } catch (error) {
            console.error("Error fetching account name:", error);
          }
        };

        fetchAccountName();
      }, []);
      return <span>{accountName}</span>;
    },
  }),
  incomeColumnHelper.accessor("amount", {
    header: "Amount",
  }),
  incomeColumnHelper.accessor("date", {
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
  incomeColumnHelper.accessor("description", {
    header: "Description",
  }),
  incomeColumnHelper.accessor("source", {
    header: "source",
  }),
  incomeColumnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const [deleteOpen, setDeleteOpen] = useState(false);
      console.log("row", row.getValue("source"));
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant={"outline"} />}>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => console.log("edit")}>
                  edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={"text-red-600"}
                  onClick={() => setDeleteOpen(true)}
                >
                  remove
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteDialog
            open={deleteOpen}
            setDeleteOpen={setDeleteOpen}
            id={row.getValue("id")}
          />
        </>
      );
    },
  }),
]);
