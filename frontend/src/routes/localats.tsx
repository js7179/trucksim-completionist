import AchievementList from "@/components/AchievementList";
import { LocalComponentContext } from "@/hooks/ComponentContext";
import { AchievementStateContext, createAchievementStore } from "@/store/AchievementStore";
import { useRef } from "react";
import { generateStateTemplate } from "trucksim-completionist-common";
import atsList from "trucksim-completionist-common/data/ats_achievements.json";

export default function ATSLocalPage() {
    const store = useRef(createAchievementStore(generateStateTemplate(atsList), atsList, "ats")).current
    return (
        <LocalComponentContext>
            <AchievementStateContext.Provider value={store}>
                <AchievementList aList={atsList} />
            </AchievementStateContext.Provider>
        </LocalComponentContext>
    );
}