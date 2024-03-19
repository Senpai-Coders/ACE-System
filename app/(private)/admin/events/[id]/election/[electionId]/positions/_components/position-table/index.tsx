"use client";
import React, { useState } from "react";
import { Plus, SearchIcon } from "lucide-react";
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
import SearchInput from "@/components/data-table/table-search-input";
import { cn } from "@/lib/utils";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";
import { TPositionWithEventID } from "@/types";
import CreatePostionModal from "../modals/create-position-modal";

type Props = {
   data:TPositionWithEventID[]
   electionId:number
   params: { id: number; electionId: number };
};

const PositionTable = ({data,electionId,params}: Props) => {
   const [globalFilter, setGlobalFilter] = useState<string>("");
   const [createPosition, setCreatePosition] = useState(false);
   
   if(!data) return null
   

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
      initialState: {
         pagination: { pageIndex: 0, pageSize: 20 },
      },
      onGlobalFilterChange: setGlobalFilter,
   });

   return (
      <div className="flex flex-1 flex-col gap-y-2 ">
         <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 ">
            <CreatePostionModal
               params={params}
               electionId={electionId}
               state={createPosition}
               onClose={(state) => setCreatePosition(state)}
            />
            <div className="flex items-center gap-x-4 text-muted-foreground">
               <div className="relative">
                  <SearchIcon className="absolute  w-4 h-auto top-3 left-2" />
                  <SearchInput
                     
                     setGlobalFilter={(e) => setGlobalFilter(e)}
                     globalFilter={globalFilter}
                  ></SearchInput>
               </div>
            </div>
            <div className="flex items-center gap-x-2 md:gap-x-4">
               <DataTableViewOptions table={table} />
               <Button
                  onClick={() => {
                     setCreatePosition(true);
                  }}
                  size="sm"
                  className={cn(
                     "flex rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                  )}
               >
                  Add Position
                  <Plus className="w-4 h-4" />
               </Button>
            </div>
         </div>
         <DataTable
            className="flex-1 bg-background/50 rounded-xl"
            table={table}
         />
          <div className="lg:hidden">
           <DataTableBasicPagination2 table={table} />
           </div>
           <div className="hidden lg:block">
           <DataTablePagination pageSizes={[5,10,15]} table={table} />
           </div>
      </div>
   );
};

export default PositionTable;
