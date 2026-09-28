"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "@/components/shared/data-table-features";
import { accountSchema } from "@/libs/validators";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RemoveDialogProp } from "@/libs/types";

const accountsColumnHelper = createColumnHelper<DataTableFeatures, z.input<typeof accountSchema>>()

export const DeleteDialog = (props: Omit<RemoveDialogProp, 'id'>) => {
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
          <DialogFooter>
            <DialogClose render={<Button variant={"outline"}>No</Button>} />
            <Button>yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const accountColumns = accountsColumnHelper.columns([
    accountsColumnHelper.accessor("accountNumber", {
        header: "accountNumber"
    }),
    accountsColumnHelper.accessor("name", {
        header: "name"
    }),
    accountsColumnHelper.accessor("type", {
        header: "type"
    }),
    accountsColumnHelper.accessor("balance", {
        header: "balance"
    }),
    accountsColumnHelper.display({
        id: "actions",
        cell: ({row}) => {
            const [deleteOpen, setDeleteOpen] = useState(false);

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
          <DeleteDialog open={deleteOpen} setDeleteOpen={setDeleteOpen} />
        </>
      );
        }
    })
])