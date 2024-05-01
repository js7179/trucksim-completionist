import { produce } from "immer";
import { createContext } from "react";
import { clamp, copyChanges } from "trucksim-tracker-common";
import { AchievementStateList } from "trucksim-tracker-common/src/types";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

export interface AchievementStateStore {
    achList: AchievementStateList;
    goal: AchievementStateList;
    toggleAchComplete: (achID: string) => void;
    toggleListSubobj: (achID: string, objID: string, subobjID: string) => void;
    addToCounterObj: (achID: string, objID: string, delta: number, goal: number) => void;
    setSequentialObj: (achID: string, objID: string, index: number) => void;
}

export type AchievementStore = ReturnType<typeof createAchievementStore>;

export const createAchievementStore = (defaultAchievementState: AchievementStateList, goalAchievement: AchievementStateList, gameName: string) => {
    return createStore<AchievementStateStore>()(
        persist(
            (set, get) => ({
                achList: structuredClone(defaultAchievementState),
                goal: goalAchievement,
                toggleAchComplete: (achID: string) => set(produce(state => 
                    { state.achList[achID].completed = !state.achList[achID].completed }
                )),
                toggleListSubobj: (achID, objID, subobjID) => {
                    if((get().achList[achID].objectives[objID] as string[]).includes(subobjID)) {
                        set(produce(state => {
                            state.achList[achID].objectives[objID] = state.achList[achID].objectives[objID].filter((subobjIDUT: string) => subobjIDUT !== subobjID)
                        }))
                    } else {
                        set(produce(state => {
                            state.achList[achID].objectives[objID].push(subobjID);
                        }))
                    }
                },
                addToCounterObj: (achID, objID, delta, goal) => set(produce(state => 
                    { state.achList[achID].objectives[objID] = clamp(0, (state.achList[achID].objectives[objID] as number) + delta, goal) })
                ),
                setSequentialObj: (achID, objID, index) => set(produce(state => {
                    { state.achList[achID].objectives[objID] = index }
                }))
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