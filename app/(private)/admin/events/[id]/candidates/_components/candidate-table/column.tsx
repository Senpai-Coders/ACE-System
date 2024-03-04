"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {  Loader2, Trash2Icon } from "lucide-react";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { useState } from "react";
import { TCandidatewithPosition } from "@/types";
import { deleteCandidate } from "@/hooks/api-hooks/candidate-api-hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UpdateCandidateModal from "../modals/update-candidate-modal";
import { getPosition } from "@/hooks/api-hooks/position-api-hooks";

const columns: ColumnDef<TCandidatewithPosition>[] = [
   {
      accessorKey: "id",
      header: ({ column }) => <DataTableColHeader column={column} title="id" />,
      cell: ({ row }) => (
         <div className="font-medium uppercase">{row.original.id}</div>
      ),
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "firstName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="FirstName" />
      ),
      cell: ({ row }) => {
         const img = row.original.picture === null ? "/images/default.png" :  row.original.picture
         return (
            <div className="flex items-center space-x-2">
               <Avatar>
                  <AvatarImage src={img} />
                  <AvatarFallback className="bg-primary text-accent">{row.original.firstName.charAt(0).toUpperCase()}</AvatarFallback>
               </Avatar>
               <h1 className="font-medium">{row.original.firstName}</h1>
            </div>
         );
      },
   },
   {
      accessorKey: "lastName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="LastName" />
      ),
      cell: ({ row }) => <div className=""> {row.original.lastName}</div>,
   },
   {
      accessorKey: "passbookNumber",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="passbook No." />
      ),
      cell: ({ row }) => <div className=""> {row.original.passbookNumber}</div>,
   },
   {
      accessorKey: "position",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="position" />
      ),
      cell: ({ row }) => (
         <div className=""> {row.original.position.positionName}</div>
      ),
   },
   {
      id:"edit",
      cell:({row})=>{
         const {positions,isError,isLoading}= getPosition(row.original.electionId)
         const [onOpenModal, setOnOpenModal] = useState(false);
         return (
            <>
            <UpdateCandidateModal
               candidate={row.original}
               positions={positions}
               state={onOpenModal}
               onClose={() => setOnOpenModal(false)}
            />
            <Button
               onClick={() => {
                  setOnOpenModal(true);
                  console.log(row.original);
               }}
               variant={"outline"}
            >
               {isLoading ? <Loader2 className=" animate-spin size-4"/>:"edit"}
            </Button>
         </>
         )
      }
   },
   {
      id: "delete",
      cell: ({ row }) => {
         const deleteOperation = deleteCandidate();
         const { onOpen: onOpenConfirmModal } = useConfirmModal();
         return (
            <>
               <Trash2Icon
                  onClick={() => {
                     onOpenConfirmModal({
                        title: "Delete Candidate 🗑️",
                        description:
                           "Are you sure to delete this candidate permanently? This cannot be undone.",
                        onConfirm: () => {
                           deleteOperation.mutate(row.original.id);
                        },
                     })
                  }}
                  className="size-5 text-red-600 hover:scale-105 cursor-pointer"
               />
            </>
         );
      },
   },
   
];

export default columns;
