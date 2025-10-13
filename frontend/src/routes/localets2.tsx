import AchievementList from "@/components/achievements/AchievementList";
import { makeLocalAchListComponents } from "@/components/util/AchievementListComponents";
import LoadingAchievementList from "@/components/achievements/LoadingAchievement";
import useGameAchInfo from "@/hooks/AchInfoProvider";
import { AchievementStateContext, createAchievementStore } from "@/store/AchievementStore";
import { Suspense, useMemo } from "react";
import { Box, Stack } from "@mantine/core";
import LocalProgressAlert from "@/components/achievements/LocalProgressAlert";

export default function ETS2LocalPage() {
    const { data: achList = [], error } = useGameAchInfo('ets2');
    const store = useMemo(() => {
        if(achList.length === 0) {
            return null;
        }
        return createAchievementStore(achList, 'ets2');
    }, [achList]);

    const localComponents = makeLocalAchListComponents();

    if(error) {
        return (<p>{error.message ?? 'Error loading Euro Truck Simulator 2 achievements'}</p>);
    }

    return (
        <Stack align='center'>
            <LocalProgressAlert gameName={"Euro Truck Simulator 2"} />
            <AchievementStateContext.Provider value={store}>
                <Box ml='2.5vw' mr='2.5vw'>
                    <Suspense fallback={<LoadingAchievementList />}>
                        <AchievementList achList={achList} {...localComponents}  />
                    </Suspense>
                </Box>
            </AchievementStateContext.Provider>
        </Stack>
    );  

}