import AchievementList from "@/components/AchievementList";
import { makeLocalAchListComponents } from "@/components/util/AchievementListComponents";
import LoadingSpinner from "@/components/util/LoadingSpinner";
import useGameAchInfo from "@/hooks/AchInfoProvider";
import { AchievementStateContext, createAchievementStore } from "@/store/AchievementStore";
import { useMemo } from "react";

export default function ETS2LocalPage() {
    const { data: achList = [], error, isLoading } = useGameAchInfo('ets2');
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

    if(isLoading || achList.length === 0) {
        return (<LoadingSpinner />);
    }

    return (
        <AchievementStateContext.Provider value={store}>
            <AchievementList achList={achList} {...localComponents}  />
        </AchievementStateContext.Provider>
    );  

}