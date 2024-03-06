import z from "zod"
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { handleAxiosErrorMessage } from "@/utils"
import { TIncentiveClaimsWithIncentiveAndAssisted, TIncentiveMinimalInfo2, TMemberAttendeesMinimalInfo } from "@/types";
import { createPublicClaimAuthorizationSchema } from "@/validation-schema/incentive";

export const useMyClaims = (eventId : number, enabled : boolean) => {
    const { data : myClaims, isLoading : isLoadingClaims, isError, error } = useQuery<TIncentiveClaimsWithIncentiveAndAssisted[], string>({
        queryKey : ["my-claimed-incentives"],
        queryFn : async () => {
            try{
                const request = await axios.get(`/api/v1/public/event/${eventId}/claim/my-claims`)
                return request.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData : [],
        enabled
    })

    return { myClaims, isLoadingClaims, isError, error }
}

export const useClaimablesList = (eventId : number, enabled : boolean) => {
    const { data : claimables, isLoading : isLoadingClaimables, isError, error } = useQuery<TIncentiveMinimalInfo2[], string>({
        queryKey : ["incentives-claimable"],
        queryFn : async () => {
            try{
                const request = await axios.get(`/api/v1/public/event/${eventId}/incentives/`)
                return request.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData : [],
        enabled
    })

    return { claimables, isLoadingClaimables, isError, error }
}


export const useClaimAuth = (eventId : number) => {
    const { data : myInfo, isLoading, isPending, isError, error }  = useQuery<TMemberAttendeesMinimalInfo, string>({
        queryKey : ["my-claim-minimal-info"],
        queryFn : async () => {
            try{
                const request = await axios.get(`/api/v1/public/event/${eventId}/claim/verify-claim-auth`)
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        retry : 0
    })

    return { myInfo, isLoading, isPending, isError, error }
}

export const useCreateClaimAuth = (eventId : number) => {
    const queryClient = useQueryClient();
    const { data : myInfo, mutate : authorize , isPending, isError, error }  = useMutation<TMemberAttendeesMinimalInfo, string, z.infer<typeof createPublicClaimAuthorizationSchema>>({
        mutationKey : ["create-claim-auth"],
        mutationFn : async (credentials) => {
            try{
                const request = await axios.post(`/api/v1/public/event/${eventId}/claim/authorize-claim`, credentials)
                queryClient.invalidateQueries({ queryKey : ['my-claim-minimal-info']})
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    })

    return { myInfo, authorize, isPending, isError, error }
}