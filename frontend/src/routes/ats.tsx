import AchievementList from "@/components/AchievementList";
import { AchievementStateContext, createAchievementStore } from "@/store/AchievementStore";
import { useRef } from "react";
import { generateStateTemplate } from "trucksim-tracker-common";
import atsList from "trucksim-tracker-common/data/ats_achievements.json";

export default function ATSLocalPage() {
    const store = useRef(createAchievementStore(generateStateTemplate(atsList, true), generateStateTemplate(atsList, false), "ats")).current
    return (
        <AchievementStateContext.Provider value={store}>
            <AchievementList aList={atsList} />
        </AchievementStateContext.Provider>
    );
}