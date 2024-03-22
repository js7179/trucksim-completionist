import AchievementList from "@/components/AchievementList";
import { AchievementStateContext, createAchievementStore } from "@/store/AchievementStore";
import { useRef } from "react";
import { generateDefaultState } from "trucksim-tracker-common";
import ets2List from "trucksim-tracker-common/data/ets2_achievements.json";

export default function ETS2LocalPage() {
    const store = useRef(createAchievementStore(generateDefaultState(ets2List), "ets2")).current
    return (
        <AchievementStateContext.Provider value={store}>
            <AchievementList aList={ets2List} />
        </AchievementStateContext.Provider>
    );
}