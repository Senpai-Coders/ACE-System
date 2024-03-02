"use client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { ColumnDef } from "@tanstack/react-table";

import { Copy, MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TMemberAttendeesWithRegistrationAssistance } from "@/types";
import UserAvatar from "@/components/user-avatar";

const Actions = ({ member, }: { member: TMemberAttendeesWithRegistrationAssistance;}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MenuIcon className="size-7 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none shadow-2" align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `${member.passbookNumber}`
                        );
                        toast.success("coppied");
                    }}
                >
                    <Copy strokeWidth={2} className="h-4" />
                    Copy passbook No.
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const columns: ColumnDef<TMemberAttendeesWithRegistrationAssistance>[] = [
    {
        id: "actions",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start">
                <Actions member={row.original} />
            </div>
        ),
    },
    {
        accessorKey: "firstName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="first Name" />
        ),
        cell: ({ row }) => {
            const img =
                row.original.picture === null
                    ? "/images/default.png"
                    : row.original.picture;
            return (
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={img} />
                        <AvatarFallback className="bg-primary text-accent">
                            {row.original.firstName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="font-medium">{row.original.firstName}</h1>
                </div>
            );
        },
    },
    {
        accessorKey: "middleName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="middle" />
        ),
        cell: ({ row }) => <div className="">{row.original.middleName}</div>,
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="last Name" />
        ),
        cell: ({ row }) => <div className=""> {row.original.lastName}</div>,
    },
    {
        id: "registered by",
        accessorKey: "registeredBy",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="registered by" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.registeredBy ? (
                    <>
                        <UserAvatar
                            className="size-7"
                            src={row.original.registeredBy.picture as ""}
                            fallback={row.original.registeredBy.name.substring(
                                0,
                                2
                            )}
                        />
                        {row.original.registeredBy.name}
                    </>
                ) : (
                    "Self Registered"
                )}
            </div>
        ),
    },
    {
        accessorKey: "passbookNumber",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="passbook N0." />
        ),
        cell: ({ row }) => (
            <div className="">{row.original.passbookNumber}</div>
        ),
    },
    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="contact" />
        ),
        cell: ({ row }) => <div className="">{row.original.contact}</div>,
    },
    {
        accessorKey: "emailAddress",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="email" />
        ),
        cell: ({ row }) => <div className="">{row.original.emailAddress}</div>,
    },
    {
        accessorKey: "gender",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="gender" />
        ),
        cell: ({ row }) => <div className="">{row.original.gender}</div>,
    },
];

export default columns;
