import { api } from "@/api/api";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AchievementStateList, STATE_ACTION, StateUpdate } from "trucksim-completionist-common";

// stale time is set in milliseconds. 1000ms * 60s * 60m * 12h
const DEFAULT_STALE_TIME = 1_000 * 60 * 60 * 12;

const DEFAULT_QUERY_OPTS = (uuid: string, game: string) => ({
    queryKey: [uuid, game],
    queryFn: () => api.get(`/${uuid}/${game}`).then(res => res.data),
    staleTime: DEFAULT_STALE_TIME
});

interface MutationArgs {
    uid: string;
    game: string;
    achID: string;
    objid?: string;
    n?: number;
    shouldMarkOff?: boolean;
    subobjid?: string;
}

export function useRemoteFuncMarkAchievementComplete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({uid, game, achID, shouldMarkOff}: MutationArgs) => {
            const payload: StateUpdate = {
                type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
                achID: achID,
                shouldMarkOff: shouldMarkOff
            };
            const response = await api.post(`/${uid}/${game}`, payload);
            if(response.status === 204) return null;
            return response.data;
        },
        onSuccess: (data, {uid, game}) => {
            if(!data) return;
            const queryKey = [uid, game];
            queryClient.setQueryData(queryKey, data);
        }
    });
}

export function useRemoteFuncSetNumberObj() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({uid, game, achID, objid, n}: MutationArgs) => {
            const payload: StateUpdate = {
                type: STATE_ACTION.OBJ_SET_NUMERICAL,
                achID: achID,
                objID: objid,
                n: n
            };
            const response = await api.post(`/${uid}/${game}`, payload);
            if(response.status === 204) return null;
            return response.data;
        },
        onSuccess: (data, {uid, game}) => {
            if(!data) return;
            const queryKey = [uid, game];
            queryClient.setQueryData(queryKey, data);
        }
    });
}

export function useRemoteFuncMarkListObj() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({uid, game, achID, objid, subobjid, shouldMarkOff}: MutationArgs) => {
            const payload: StateUpdate = {
                type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
                achID: achID,
                objID: objid,
                subobjID: subobjid,
                shouldMarkOff: shouldMarkOff
            };
            const response = await api.post(`/${uid}/${game}`, payload);
            if(response.status === 204) return null;
            return response.data;
        },
        onSuccess: (data, {uid, game}) => {
            if(!data) return;
            const queryKey = [uid, game];
            queryClient.setQueryData(queryKey, data);
        }
    });
}

export function useRemoteStateAchievementCompleted(uuid: string, game: string, achID: string) {
    return useSuspenseQuery({
        ...DEFAULT_QUERY_OPTS(uuid, game),
        select: (savedata: AchievementStateList) => savedata[achID].completed
    });
}

export function useRemoteStateAchievementObjective(uuid: string, game: string, achID: string, objID: string) {
    return useSuspenseQuery({
        ...DEFAULT_QUERY_OPTS(uuid, game),
        select: (savedata: AchievementStateList) => savedata[achID].objectives[objID]
    });
}
