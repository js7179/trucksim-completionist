import { produce } from "immer";
import { createContext } from "react";
import { AchievementStateList } from "trucksim-tracker-common/src/types";
import { createStore } from "zustand";

export interface AchievementStateStore {
    achList: AchievementStateList;
    toggleAchComplete: (achID: string) => void;
}

export type AchievementStore = ReturnType<typeof createAchievementStore>;

export const createAchievementStore = (aList: AchievementStateList, gameName: string) => {
    return createStore<AchievementStateStore>()((set) => ({
        achList: structuredClone(aList),
        toggleAchComplete: (achID: string) => set(produce(state => 
            { state.achList[achID].completed = !state.achList[achID].completed }
        )),
    }));
};

export const AchievementStateContext = createContext<AchievementStore | null>(null);