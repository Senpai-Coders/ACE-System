"use client"
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
   const router = useRouter();
   
   return (
      <>
         <Button onClick={() => router.back()} variant={"ghost"} className="text-[min(14px,3vw)]">
            <ArrowLeft className="size-4"></ArrowLeft>
            back
         </Button>
      </>
   );
};

export default BackButton;
