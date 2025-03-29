import { queryClient } from "@/api/query";
import AchievementList from "@/components/AchievementList";
import LoadingSpinner from "@/components/util/LoadingSpinner";
import { RemotePageProvider } from "@/hooks/RemotePage";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import atsList from "trucksim-completionist-common/data/ats_achievements.json";

export default function ATSRemotePage() {
    const { uid } = useParams();
    if(!uid) {
        return (
            <p>Invalid parameters to this page</p>
        )
    }
    return (
        <QueryClientProvider client={queryClient}>
            <RemotePageProvider game={'ats'} uid={uid}>
                <Suspense fallback={<LoadingSpinner />}>
                    <AchievementList achList={atsList} />
                </Suspense>
            </RemotePageProvider>
        </QueryClientProvider>
    );
}