import { queryClient } from "@/api/query";
import AchievementList from "@/components/AchievementList";
import { RemotePageProvider } from "@/hooks/RemotePage";
import { QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ets2List from "trucksim-completionist-common/data/ets2_achievements.json";

export default function ETS2RemotePage() {
    const { uid, game } = useParams();
    if(!uid || !game) {
        return (
            <p>Error loading this page...</p>
        )
    }
    return (
        <QueryClientProvider client={queryClient}>
            <RemotePageProvider game={game} uid={uid}>
                <AchievementList aList={ets2List} />
            </RemotePageProvider>
        </QueryClientProvider>
    );
}