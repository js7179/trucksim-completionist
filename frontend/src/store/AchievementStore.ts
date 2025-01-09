import { createContext } from "react";
import { copyChanges, AchievementStateList, AchievementInfo } from "trucksim-completionist-common";
import { performStateUpdate, STATE_ACTION } from "trucksim-completionist-common/src/state";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

export interface AchievementStateStore {
    saveData: AchievementStateList;
    achList: AchievementInfo[];
    markComplete: (achID: string, shouldMarkOff: boolean) => void;
    setCounter: (achID: string, objID: string, n: number) => void;
    markListObj: (achID: string, objID: string, subobjid: string, shouldMarkOff: boolean) => void;
}

export type AchievementStore = ReturnType<typeof createAchievementStore>;

export const createAchievementStore = (defaultAchievementState: AchievementStateList, achList: AchievementInfo[], gameName: string) => {
    return createStore<AchievementStateStore>()(
        persist(
            (set, get) => ({
                saveData: structuredClone(defaultAchievementState),
                achList: achList,
                markComplete: (achID, shouldMarkOff) => {
                    const oldState = get();
                    const { newState, rowsChanged } = performStateUpdate(oldState.saveData, oldState.achList, {
                        type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
                        achID: achID,
                        shouldMarkOff: shouldMarkOff
                    });
                    if(rowsChanged.length !== 0) {
                        set({ saveData: newState });
                    }
                },
                setCounter: (achID, objID, n) => {
                    const oldState = get();
                    const { newState, rowsChanged } = performStateUpdate(oldState.saveData, oldState.achList, {
                        type: STATE_ACTION.OBJ_SET_NUMERICAL,
                        achID: achID,
                        objID: objID,
                        n: n
                    });
                    if(rowsChanged.length !== 0) {
                        set({ saveData: newState });
                    }
                },
                markListObj: (achID, objID, subobjid, shouldMarkOff) => {
                    const oldState = get();
                    const { newState, rowsChanged } = performStateUpdate(oldState.saveData, oldState.achList, {
                        type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
                        achID: achID,
                        objID: objID,
                        subobjID: subobjid,
                        shouldMarkOff: shouldMarkOff
                    });
                    if(rowsChanged.length !== 0) {
                        set({ saveData: newState });
                    }
                },
            }),
            {
                name: gameName,
                version: 0,
                partialize: (state) => ({ saveData: state.saveData }),
                migrate: (persistedState) => copyChanges(defaultAchievementState, persistedState)
            }
        )
    );
};
    
export const AchievementStateContext = createContext<AchievementStore | null>(null);