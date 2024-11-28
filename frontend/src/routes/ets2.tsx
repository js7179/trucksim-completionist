import AchievementList from "@/components/AchievementList";
import { AchievementStateContext, createAchievementStore } from "@/store/AchievementStore";
import { useRef } from "react";
import { generateStateTemplate } from "trucksim-completionist-common";
import ets2List from "trucksim-completionist-common/data/ets2_achievements.json";

export default function ETS2LocalPage() {
    const store = useRef(createAchievementStore(generateStateTemplate(ets2List, true), generateStateTemplate(ets2List, false), "ets2")).current
    return (
        <AchievementStateContext.Provider value={store}>
            <AchievementList aList={ets2List} />
        </AchievementStateContext.Provider>
    );
}