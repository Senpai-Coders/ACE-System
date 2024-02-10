"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import { Copy, Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { toast } from "sonner";
import UserAvatar from "@/components/user-avatar";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TEvent, TEventWithElection } from "@/types/event/TCreateEvent";
import moment from "moment"

const Actions = ({ event }: { event: TEventWithElection }) => {
    const { onOpen: onOpenConfirmModal } = useConfirmModal();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none shadow-2" align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        navigator.clipboard.writeText(`${event.id}`)
                        toast.success("coppied")
                    }}
                >
                    {" "}
                    <Copy strokeWidth={2} className="h-4" />
                    Copy event ID
                </DropdownMenuItem>
                <DropdownMenuItem className="px-2 gap-x-2">
                    <Pencil strokeWidth={2} className="h-4" /> Edit Event
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        onOpenConfirmModal({
                            title: event.deleted
                                ? "Permanent Delete 🗑️"
                                : "Delete Event 🗑️",
                            description: event.deleted
                            + "Are you sure to delete this event permanently? This cannot be undone.",
                            onConfirm: () => {
                                toast.success("deleted");
                            },
                        })
                    }
                    className="px-2 gap-x-2 text-destructive"
                >
                    <Trash strokeWidth={2} className="h-4" />{" "}
                    {event.deleted ? "Permanent Delete" : "Delete"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const columns: ColumnDef<TEvent>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="id" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
        enableSorting : false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="title" />
        ),
        cell: ({ row }) => {
            console.log(row.original.title)
            return <div className=""> {row.original.title}</div>

        },
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="description" />
        ),
        cell: ({ row }) => (
            <div className=""> {row.original.description}</div>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="date" />
        ),
        cell: ({ row }) => (
            <div className="">{moment(row.original.date).format("LL")}</div>
        ),
    },
    {
        accessorKey: "Address",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Address" />
        ),
        cell: ({ row }) => (
            <div className="">{ row.original.location }</div>
        ),
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="type" />
        ),
        cell: ({ row }) => (
            <div className="">{ row.original.category }</div>
        ),
    },
      // will fix tom
    // {
    //     id: "actions",
    //     enableHiding: false,
    //     cell: ({ row }) =>{
    //         return row.original.election ? <Button variant={"outline"}>add Election</Button>:""
    //     }
    // },


    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <div className="flex justify-end">
                {/* <Actions event={row.original} /> */}
            </div>
        ),
    },
];

export default columns;
