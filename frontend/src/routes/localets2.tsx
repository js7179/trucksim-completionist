import AchievementList from "@/components/AchievementList";
import { LocalComponentContext } from "@/hooks/ComponentContext";
import { AchievementStateContext, createAchievementStore } from "@/store/AchievementStore";
import { useRef } from "react";
import { generateStateTemplate } from "trucksim-completionist-common";
import ets2List from "trucksim-completionist-common/data/ets2_achievements.json";

export default function ETS2LocalPage() {
    const store = useRef(createAchievementStore(generateStateTemplate(ets2List), ets2List, "ets2")).current
    return (
        <LocalComponentContext>
            <AchievementStateContext.Provider value={store}>
                <AchievementList achList={ets2List} />
            </AchievementStateContext.Provider>
        </LocalComponentContext>
    );
}