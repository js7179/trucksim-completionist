import { createContext } from "react";
import { copyChanges, StateUpdate, doStateUpdate, AchievementStateList } from "trucksim-tracker-common";
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
                    let newState = { ...get() };
                    let newAchList = doStateUpdate(newState.achList, newState.goal, args);
                    newState.achList = newAchList;
                    set(newState);
                }
            }),
            {
                name: gameName,
                version: 0,
                partialize: (state) => ({ achList: state.achList }),
                migrate: (persistedState) => copyChanges(defaultAchievementState, persistedState)
            }
        ));
    };
    
    export const AchievementStateContext = createContext<AchievementStore | null>(null);