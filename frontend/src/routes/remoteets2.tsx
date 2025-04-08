import AchievementList from "@/components/AchievementList";
import { makeRemoteAchListComponents } from "@/components/util/AchievementListComponents";
import LoadingSpinner from "@/components/util/LoadingSpinner";
import useGameAchInfo from "@/hooks/AchInfoProvider";
import { RemotePageProvider } from "@/hooks/RemotePage";
import { Suspense } from "react";
import { useParams } from "react-router-dom";

export default function ETS2RemotePage() {
    const { uid } = useParams();
    const { data: achList = [], error, isLoading } = useGameAchInfo('ets2');

    const remoteComponents = makeRemoteAchListComponents();
    
    if(!uid) {
        return (<p>No user ID provided</p>);
    }

    if(error) {
        return (<p>{error.message ?? 'Error loading Euro Truck Simulator 2 achievements'}</p>);
    }

    if(isLoading || achList.length === 0) {
        return (<LoadingSpinner />);
    }

    return (
        <RemotePageProvider game={'ets2'} uid={uid}>
            <Suspense fallback={<LoadingSpinner />}>
                <AchievementList achList={achList} {...remoteComponents} />
            </Suspense>
        </RemotePageProvider>
    );
}