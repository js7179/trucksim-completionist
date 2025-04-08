import { useQuery } from "@tanstack/react-query"
import { AchievementInfo } from "trucksim-completionist-common";

const ACHDATA_URLIFY = (game: string) => `/assets/achdata/${game}_achievements.json`;

export default function useGameAchInfo(game: string) {
    return useQuery({
        queryKey: ['achInfo', game],
        queryFn: async () => {
            const cachedEtag = localStorage.getItem(`${game}-etag`);

            const headers = new Headers();
            if(cachedEtag) {
                headers.append('If-None-Match', cachedEtag);
            }

            const response = await fetch(ACHDATA_URLIFY(game), { headers, cache: 'no-cache' });
            if(response.status === 304) {
                const cachedDataString = localStorage.getItem(`${game}-achinfo`);
                if(cachedDataString) { 
                    const cachedData = JSON.parse(cachedDataString) as AchievementInfo[];
                    return cachedData;
                } else { // if for some reason achdata is empty or broken
                    const fallbackResponse = await fetch(ACHDATA_URLIFY(game), { cache: 'no-cache'} );
                    if(fallbackResponse.ok) {
                        const newETag = response.headers.get('ETag');
                        if(newETag) {
                            localStorage.setItem(`${game}-etag`, newETag);
                        }
                        const achInfo = await response.json() as AchievementInfo[];
                        localStorage.setItem(`${game}-achinfo`, JSON.stringify(achInfo));
                        return achInfo;        
                    }
                }
            } else if(response.ok) {
                const newETag = response.headers.get('ETag');
                if(newETag) {
                    localStorage.setItem(`${game}-etag`, newETag);
                }
                const achInfo = await response.json() as AchievementInfo[];
                localStorage.setItem(`${game}-achinfo`, JSON.stringify(achInfo));
                return achInfo;
            } else {
                throw new Error(`Could not fetch achievement information for ${game}`);
            }
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        gcTime: Infinity,
        placeholderData: [] as AchievementInfo[]
    });
}