import AchievementList from "@/components/achievements/AchievementList";
import { makeRemoteAchListComponents } from "@/components/util/AchievementListComponents";
import LoadingAchievementList from "@/components/achievements/LoadingAchievement";
import useGameAchInfo from "@/hooks/AchInfoProvider";
import { RemotePageProvider } from "@/hooks/RemotePage";
import { Suspense } from "react";
import { useParams } from "react-router";

export default function ATSRemotePage() {
    const { uid } = useParams();
    const { data: achList = [], error, isLoading } = useGameAchInfo('ats');

    const remoteComponents = makeRemoteAchListComponents();

    if(!uid) {
        return (<p>No user ID provided</p>);
    }

    if(error) {
        return (<p>{error.message ?? 'Error loading American Truck Simulator achievements'}</p>);
    }

    if(isLoading || achList.length === 0) {
        return (<LoadingAchievementList />);
    }

    return (
        <RemotePageProvider game={'ats'} uid={uid}>
            <Suspense fallback={<LoadingAchievementList />}>
                <AchievementList achList={achList} {...remoteComponents} />
            </Suspense>
        </RemotePageProvider>
    );
}