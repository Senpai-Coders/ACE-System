import z from "zod"
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SettingsType } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { eventRegistrationSettingsSchema } from "@/validation-schema/event-settings";

type TParams = {
   params:{id:number,electionId:number}
}

export const updateElectionSettings = ({params}:TParams) => {
     const queryClient = useQueryClient();
     const router = useRouter()
     const udateSettingsMutation = useMutation<SettingsType, number, { data: SettingsType }>({
        mutationKey: ["update-settings"],
        mutationFn: async ({data}) => {
           try {
            console.log(params)
              const response = await axios.patch(`/api/v1/admin/event/${params.id}/election/${params.electionId}`,data);
              toast.success("Election updated successfully");
              queryClient.invalidateQueries({queryKey: ["get-election-query"],});
              router.refresh();
              return response.data;
           } catch (e) {
            console.log(e)
              const errorMessage = handleAxiosErrorMessage(e);
              toast.error(errorMessage, {
                 action: {
                    label: "try agian",
                    onClick: () => udateSettingsMutation.mutate({data}),
                 },
              });
              throw errorMessage;
           }
        },
     });
     return udateSettingsMutation;
  };

type TRegistrationSetting = z.infer<typeof eventRegistrationSettingsSchema>

export const useRegistrationSettings = (eventId : number) => {
    const { data : existingSettings, isLoading, isRefetching } = useQuery<TRegistrationSetting, string>({
        queryKey : [`event-${eventId}-settings`],
        queryFn : async () => {
            try{
                const request = await axios.get(`/api/v1/admin/event/${eventId}/settings/registration`)
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData : { registrationOnEvent : false }
    })

    return { existingSettings, isLoading, isRefetching }
}

export const useUpdateRegistrationSettings = (eventId : number) => {
    const queryClient = useQueryClient();

    const { data : updatedData, mutate : updateSettings, isPending } = useMutation<TRegistrationSetting, string, TRegistrationSetting>({
        mutationKey : [`event-${eventId}-update-settings`],
        mutationFn : async (settings) => {
            try{
                const request = await axios.post(`/api/v1/admin/event/${eventId}/settings/registration`, settings)
                queryClient.invalidateQueries({ queryKey : [`event-${eventId}-settings`]})
                return request.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    })

    return { updatedData, updateSettings, isPending }
}