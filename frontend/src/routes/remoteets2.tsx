import AchievementList from "@/components/achievements/AchievementList";
import { makeRemoteAchListComponents } from "@/components/util/AchievementListComponents";
import LoadingAchievementList from "@/components/achievements/LoadingAchievement";
import useGameAchInfo from "@/hooks/AchInfoProvider";
import { RemotePageProvider } from "@/hooks/RemotePage";
import { Suspense } from "react";
import { useParams } from "react-router";
import { Box } from "@mantine/core";

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
        return (<LoadingAchievementList />);
    }

    return (
        <RemotePageProvider game={'ets2'} uid={uid}>
            <Box ml='2.5vw' mr='2.5vw'>
                <Suspense fallback={<LoadingAchievementList />}>
                    <AchievementList achList={achList} {...remoteComponents}  />
                </Suspense>
            </Box>
        </RemotePageProvider>
    );
}