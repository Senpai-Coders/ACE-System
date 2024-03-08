"use client";
import React, { useEffect, useRef } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { HandHeart, MonitorSmartphone, SearchIcon } from "lucide-react";

import columns from "./column";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import { useClaimsMasterList } from "@/hooks/api-hooks/incentive-api-hooks";
import {
  DataTableFacetedFilter,
  FacetedOptionType,
} from "@/components/data-table/data-table-facited-filter";

const claimFromFilter: FacetedOptionType[] = [
  {
    label: "Assisted",
    value: "Assisted",
    icon: HandHeart,
  },
  {
    label: "Online",
    value: "Online",
    icon: MonitorSmartphone,
  },
];

const ClaimListTable = ({ eventId }: { eventId: number }) => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const onFocusSearch = useRef<HTMLInputElement | null>(null);

  const { claimList, isError, isLoading, isFetching } =
    useClaimsMasterList(eventId);

  const table = useReactTable({
    data: claimList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 20 },
      columnVisibility: {
        id: false,
      },
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
      <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 bg-primary dark:border dark:bg-secondary/70 ">
        <div className="flex items-center gap-x-4 text-muted-foreground">
          <div className="relative text-white flex items-center gap-x-1">
            <SearchIcon className="absolute w-4 h-auto top-3 left-2" />
            <Input
              ref={onFocusSearch}
              placeholder="Search..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-full pl-8 bg-transparent border-white placeholder:text-white/70 border-0 border-b text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <DataTableFacetedFilter
              options={claimFromFilter}
              column={table.getColumn("Claim Mode")}
              title="Claim Mode"
            />
          </div>
        </div>
        <div className="flex items-center gap-x-2 md:gap-x-4">
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <DataTable
        className="flex-1 bg-background dark:bg-secondary/30 rounded-2xl"
        isError={isError}
        isLoading={isLoading || isFetching}
        table={table}
      />
      <DataTablePagination pageSizes={[20, 40, 60, 80, 100]} table={table} />
    </div>
  );
};

export default ClaimListTable;
