import { BarGraphDataTypes } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const getPositionVotesTotal = ( params: { id: number; electionId: number}) => {
     const {data,isLoading,isError} = useQuery<BarGraphDataTypes[]>({
           queryKey: ["graph-position-votes-query"],
           queryFn: async () => {
              try {
                 const electionId = Number(params.electionId)
                 const id = Number(params.id)

                 const response = await axios.get(`/api/v1/admin/event/${id}/election/${electionId}/candidate/`);
                 return response.data;
              } catch (e) {
                 throw handleAxiosErrorMessage(e);
              }
           },
           refetchInterval: 1 * 60 * 1000
        });
        return {votes:data,isError,isLoading} 
     };