import axios from "axios";
import moment from "moment";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TCreateMember, TMember, TMemberAttendeesWithRegistrationAssistance } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";

export const getAllEventMembers = (eventId: number) => {
    const positions = useQuery<TMember[], string>({
        queryKey: ["all-event-members-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `/api/v1/admin/event/${eventId}/member`
                );
                return response.data;
            } catch (e) {
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });
    return positions;
};

export const getMembers = () => {
    const getAllMember = useQuery<TMember[]>({
        queryKey: ["get-all-member-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/v1/member/`);
                return response.data;
            } catch (e) {
                throw handleAxiosErrorMessage(e);
            }
        },
    });
    return getAllMember;
};

export const deleteMember = () => {
    const queryClient = useQueryClient();
    const deleteMemberMutation = useMutation<any, Error, { eventId: number,memberId:string }>({
        mutationKey: ["delete-member-query"],
        mutationFn: async ({ eventId,memberId }) => {
            try {
                const response = await axios.delete(
                    `/api/v1/admin/event/${eventId}/member/${memberId}`
                );
                queryClient.invalidateQueries({
                    queryKey: ["all-event-members-list-query"],
                });
                toast.success("Member deleted successfully");
                return response.data;
            } catch (e) {
                throw handleAxiosErrorMessage(e);
            }
        },
    });

    return deleteMemberMutation;
};

type Props = {
    onCancelandReset: () => void;
};

export const createMember = ({ onCancelandReset }: Props) => {
    const queryClient = useQueryClient();
    const addMember = useMutation<any, Error, { member: TCreateMember,eventId:number }>({
        mutationKey: ["create-member-query"],
        mutationFn: async ({ member,eventId }) => {
            try {
                const newBirthday = moment(member.birthday).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                const newMember = { ...member, birthday: newBirthday };
                const response = await axios.post(`/api/v1/admin/event/${eventId}/member/`, newMember);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => addMember.mutate({ member,eventId }),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: ["all-event-members-list-query"],
            });
            toast.success("Member added successfully");
            onCancelandReset();
        }
    });

    return addMember;
};

export const updateMember = ({ onCancelandReset }: Props) => {
    const queryClient = useQueryClient();
    const updateMember = useMutation<any,Error,  { member: TCreateMember, memberId: string, eventId:number }
    >({
        mutationKey: ["update-member-query"],
        mutationFn: async ({ member, memberId, eventId }) => {
            try {
                const response = await axios.patch(`/api/v1/admin/event/${eventId}/member/${memberId}`,member);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () =>
                            updateMember.mutate({ member, memberId,eventId }),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: ["all-event-members-list-query"],
            });
            toast.success("Member updated successfully");
            onCancelandReset();
        }
    });

    return updateMember;
};

export const createManyMember = ({ onCancelandReset }: Props) => {
    const queryClient = useQueryClient();
    const addMember = useMutation<
        any,
        Error,
        { member: TCreateMember[] | unknown; eventId: number }
    >({
        mutationKey: ["delete-member-query"],
        mutationFn: async ({ member, eventId }) => {
            try {
                const response = await axios.post(
                    `/api/v1/member/bulk-create/${eventId}`,
                    member
                );
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => addMember.mutate({ member, eventId }),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: ["all-event-members-list-query"],
            });
            toast.success("Members Added successfully");
            onCancelandReset();
        }
    });

    return addMember;
};

export const useBroadcastOTP = (eventId: number) => {
    const {
        data: broadcastData,
        isPending: isBroadcasting,
        mutate: broadcastOTP,
    } = useMutation<
        { sentCount: 0; invalidEmailAddress: 0; failedSend: 0 },
        string
    >({
        mutationKey: [`broadcast-otp-${eventId}`],
        mutationFn: async () => {
            try {
                const request = await axios.post(
                    `/api/v1/admin/event/${eventId}/otp/broadcast-otp`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { broadcastData, broadcastOTP, isBroadcasting };
};

export const useOtpSend = (eventId: number, passbookNumber: string) => {
    const { isPending: isSendingOtp, mutate: sendOtp } = useMutation<
        any,
        string
    >({
        mutationKey: [`send-otp-${eventId}`],
        mutationFn: async () => {
            try {
                const request = await axios.post(
                    `/api/v1/admin/event/${eventId}/otp/specific-send`,
                    { passbookNumber }
                );
                toast.success("OTP has been sent");
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { isSendingOtp, sendOtp };
};
