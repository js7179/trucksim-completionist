import { createContext } from "react";
import { copyChanges, StateUpdate, doStateUpdate, AchievementStateList } from "trucksim-completionist-common";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

export interface AchievementStateStore {
    achList: AchievementStateList;
    goal: AchievementStateList;
    performAction: (args: StateUpdate) => void;
}

export type AchievementStore = ReturnType<typeof createAchievementStore>;

export const createAchievementStore = (defaultAchievementState: AchievementStateList, goalAchievement: AchievementStateList, gameName: string) => {
    return createStore<AchievementStateStore>()(
        persist(
            (set, get) => ({
                achList: structuredClone(defaultAchievementState),
                goal: goalAchievement,
                performAction: (args) => {
                    const newAchList = doStateUpdate(get().achList, get().goal, args);
                    set({ achList: newAchList });
                }
            }),
            {
                name: gameName,
                version: 0,
                partialize: (state) => ({ achList: state.achList }),
                migrate: (persistedState) => copyChanges(defaultAchievementState, persistedState)
            }
        )
    );
};
    
export const AchievementStateContext = createContext<AchievementStore | null>(null);