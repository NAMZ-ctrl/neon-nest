"use client";

import { AccountType } from "@/prisma/app/generated/prisma/enums";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  useActionState,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { ChevronDown, EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FinancialAccount } from "@/prisma/app/generated/prisma/client";
import {
  ConvertedFinancialAccount,
  RemoveDialogProp,
  RemoveArchiveProp,
} from "@/libs/types";
import { CurrencyContext } from "@/context/currency-provider";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "react-toastify";
import EditFinancialAccountForm from "@/app/(dashboard)/financial-accounts/financial-accounts-edit-form";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

type NameProp = "ALL" | AccountType;

const filterOptions: { value: NameProp; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "BANK", label: "Bank" },
  { value: "WALLET", label: "Wallet" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
];

function DeleteDialog(props: RemoveDialogProp) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const form = useForm();

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        const response = await axios.delete(
          `/api/financial-accounts/${props.id}`,
        );
        if (response.status === 200) {
          toast.success(response.data.message);
        }
        router.refresh()
        props.setDeleteOpen(false)
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
              particular account data
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogFooter>
              <DialogClose render={<Button variant={"outline"}>no</Button>} />
              <Button type="submit" disabled={isPending}>
                {isPending ? "deleting..." : "delete"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ArchiveDialog(props: RemoveArchiveProp) {
  return (
    <>
      <Dialog open={props.open} onOpenChange={props.setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive account?</DialogTitle>
            <DialogDescription>
              This account will be archived and removed from your active
              accounts. Your financial history will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant={"outline"}>no</Button>} />
            <Button>yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AccountList({
  acc,
}: {
  acc: ConvertedFinancialAccount[];
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<NameProp>("ALL");

  const filterAccounts = (
    accounts: ConvertedFinancialAccount[],
    filter: NameProp,
  ) => {
    if (filter === "ALL") return accounts;
    return accounts.filter((a) => a.type === filter);
  };

  const accounts = filterAccounts(acc, name);
  const currentLabel =
    filterOptions.find((o) => o.value === name)?.label ?? "All";

  return (
    <Card className={cn("flex h-full flex-col")}>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Accounts</CardTitle>
        <DropdownMenu onOpenChange={setOpen}>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <span className="flex items-center gap-1.5">
              {currentLabel}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="hidden">options</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={name} onValueChange={setName}>
                {filterOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="max-h-[400px] flex-1 overflow-y-auto px-2 sm:px-4">
        <AccountTable accounts={accounts} />
      </CardContent>
    </Card>
  );
}

export function AccountTable({
  accounts,
}: {
  accounts: ConvertedFinancialAccount[];
}) {
  const { formatCurrency } = useContext(CurrencyContext);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeAccount, setActiveAccount] =
    useState<ConvertedFinancialAccount | null>(null);

  return (
    <Table>
      <TableHeader className="hidden">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.length ? (
          accounts.map((account, index) => (
            <TableRow key={index} className="border-none">
              <TableCell className="py-2.5 font-medium">
                {account.name}
              </TableCell>
              <TableCell className="py-2.5 text-right sm:text-left">
                {formatCurrency(account.balance)}
              </TableCell>
              <TableCell className="w-10 py-2.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8">
                        <EllipsisVertical className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setActiveAccount(account);
                        setEditOpen(true);
                      }}
                    >
                      edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setArchiveOpen(true)}
                      className={cn("text-blue-600")}
                    >
                      archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteOpen(true)}
                    >
                      delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DeleteDialog
                  open={deleteOpen}
                  setDeleteOpen={setDeleteOpen}
                  id={account.id}
                />
                <ArchiveDialog
                  open={archiveOpen}
                  setArchiveOpen={setArchiveOpen}
                  id={account.id}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={3}
              className="py-8 text-center text-muted-foreground"
            >
              No accounts found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      {activeAccount && (
        <EditFinancialAccountForm
          account={activeAccount}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </Table>
  );
}
