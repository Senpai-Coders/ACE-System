"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Plus, SearchIcon } from "lucide-react";

import columns from "./column";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/data-table";
import CreateIncentiveModal from "../modals/create-incentive-modal";

import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import { incentiveListWithClaimCount } from "@/hooks/api-hooks/incentive-api-hooks";

const IncentivesTable = ({ eventId } : { eventId : number }) => {
    const [createModal, setCreateModal] = useState(false)
    const [globalFilter, setGlobalFilter] = React.useState("");
    const onFocusSearch = useRef<HTMLInputElement | null>(null);

    const { data, isFetching, isLoading, isError } = incentiveListWithClaimCount(eventId);

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
            pagination : { pageIndex : 0, pageSize : 20 },
            columnVisibility : {
                Id : false
            }
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
        <div className="flex flex-1 flex-col  gap-y-5 ">
            <CreateIncentiveModal eventId={eventId} state={createModal} onClose={()=>setCreateModal(false)}/>
            <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 bg-primary dark:border dark:bg-secondary/70 ">
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
                        size="sm"
                        className="flex rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem] "
                        onClick={() => setCreateModal(true)}
                    >
                        Add Item
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <DataTable className="flex-1 bg-background dark:bg-secondary/30 rounded-2xl" isError={isError} isLoading={isLoading || isFetching} table={table} />
            <DataTablePagination pageSizes={[20,40,60,80,100]} table={table}/>
        </div>
    );
};

export default IncentivesTable;
