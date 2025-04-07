import AchievementList from "@/components/AchievementList";
import LoadingSpinner from "@/components/util/LoadingSpinner";
import useGameAchInfo from "@/hooks/AchInfoProvider";
import { RemoteComponentContext } from "@/hooks/ComponentContext";
import { RemotePageProvider } from "@/hooks/RemotePage";
import { Suspense } from "react";
import { useParams } from "react-router-dom";

export default function ATSRemotePage() {
    const { uid } = useParams();
    const { data: achList = [], error, isLoading } = useGameAchInfo('ets2');

    if(!uid) {
        return (<p>No user ID provided</p>);
    }

    if(error) {
        return (<p>{error.message ?? 'Error loading American Truck Simulator achievements'}</p>);
    }

    if(isLoading || achList.length === 0) {
        return (<LoadingSpinner />);
    }

    return (
        <RemotePageProvider game={'ats'} uid={uid}>
            <Suspense fallback={<LoadingSpinner />}>
                <RemoteComponentContext> 
                    <AchievementList achList={achList} />
                </RemoteComponentContext>
            </Suspense>
        </RemotePageProvider>
    );
}