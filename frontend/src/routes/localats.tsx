import AchievementList from "@/components/achievements/AchievementList";
import { makeLocalAchListComponents } from "@/components/util/AchievementListComponents";
import LoadingAchievementList from "@/components/achievements/LoadingAchievement";
import useGameAchInfo from "@/hooks/AchInfoProvider";
import { AchievementStateContext, createAchievementStore } from "@/store/AchievementStore";
import { useMemo } from "react";

export default function ATSLocalPage() {
    const { data: achList = [], error, isLoading } = useGameAchInfo('ats');
    const store = useMemo(() => {
        if(achList.length === 0) {
            return null;
        }
        return createAchievementStore(achList, 'ats');
    }, [achList]);

    const localComponents = makeLocalAchListComponents();

    if(error) {
        return (<p>{error.message ?? 'Error loading American Truck Simulator achievements'}</p>);
    }

    if(isLoading || achList.length === 0) {
        return (<LoadingAchievementList />);
    }

    return (
        <AchievementStateContext.Provider value={store}>
            <AchievementList achList={achList} {...localComponents} />
        </AchievementStateContext.Provider>
    );  
}