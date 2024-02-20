"use client";
import React, { useEffect, useRef, useState } from "react";

import { Plus, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import columns from "./column";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import CreateUserModal from "../modals/create-user-modal";
import { userList } from "@/hooks/api-hooks/user-api-hooks";
import { user } from "next-auth";

const UserTable = ({ currentUser } : { currentUser : user}) => {
    const [createModal, setCreateModal] = useState(false)
    const [globalFilter, setGlobalFilter] = React.useState("");
    const onFocusSearch = useRef<HTMLInputElement | null>(null);

    const allowedToCreate = currentUser && ( currentUser.role === "admin" || currentUser.role === "root" )

    const { data, isFetching, isLoading, isError, refetch } = userList();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        initialState : {
            pagination : { pageIndex : 0, pageSize : 20 }
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    useEffect(() => {
        const shortCutCommand = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey && event.key === "k") ||
                (event.altKey && event.key === "k") ||
                (event.metaKey && event.key === "k")
            ) {
                event.preventDefault();
                onFocusSearch.current?.focus();
            }
        };
        window.addEventListener("keydown", shortCutCommand);
        return () => {
            window.removeEventListener("keydown", shortCutCommand);
        };
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-y-2 ">
            { allowedToCreate && <CreateUserModal state={createModal} editor={currentUser} onClose={(state) => setCreateModal(state)} /> }
            <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 bg-[#4e7563]">
                <div className="flex items-center gap-x-4 text-muted-foreground">
                    <div className="relative text-white">
                        <SearchIcon className="absolute w-4 h-auto top-3 left-2" />
                        <Input
                            ref={onFocusSearch}
                            placeholder="Search..."
                            value={globalFilter}
                            onChange={(event) =>
                                setGlobalFilter(event.target.value)
                            }
                            className="w-full pl-8 bg-transparent border-white placeholder:text-white/70 border-0 border-b text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-x-2 md:gap-x-4">
                    <DataTableViewOptions table={table} />
                    <Button
                        disabled={currentUser.role === "staff"}
                        size="sm"
                        className="flex rounded-md justify-center bg-[#5B9381] hover:bg-[#5B9381]/70 items-center md:space-x-2 md:min-w-[7rem]"
                        onClick={()=>setCreateModal(true)}
                    >
                        Add 
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <DataTable className="flex-1" isError={isError} isLoading={isLoading || isFetching} table={table} />
            <DataTablePagination  table={table}/>
        </div>
    );
};

export default UserTable;
