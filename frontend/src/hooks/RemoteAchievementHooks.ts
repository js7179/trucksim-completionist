import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

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
    return useQuery({
        ...DEFAULT_QUERY_OPTS(uuid, game),
        select: (savedata) => savedata[achID].completed
    });
}

export function useStateAchievementObjective(uuid: string, game: string, achID: string, objID: string) {
    return useQuery({
        ...DEFAULT_QUERY_OPTS(uuid, game),
        select: (savedata) => savedata[achID].objectives[objID]
    });
}

