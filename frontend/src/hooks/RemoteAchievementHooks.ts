import { api } from "@/api/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AchievementStateList } from "trucksim-completionist-common";

const DEFAULT_QUERY_OPTS = (uuid: string, game: string) => ({
    queryKey: [uuid, game],
    queryFn: () => api.get(`/${uuid}/${game}`).then(res => res.data)
});

export function useFuncMarkAchievementComplete() {
    
}

export function useFuncSetNumberObj() {

}

export function useFuncMarkListObj() {

}

export function useStateAchievementCompleted(uuid: string, game: string, achID: string) {
    return useSuspenseQuery({
        ...DEFAULT_QUERY_OPTS(uuid, game),
        select: (savedata: AchievementStateList) => savedata[achID].completed
    });
}

export function useStateAchievementObjective(uuid: string, game: string, achID: string, objID: string) {
    return useSuspenseQuery({
        ...DEFAULT_QUERY_OPTS(uuid, game),
        select: (savedata: AchievementStateList) => savedata[achID].objectives[objID]
    });
}
