import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { isNonorderedArrayEqual } from "trucksim-tracker-common";
import { useStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";


export function useAchievementDispatch() {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.performAction);
}

export function useAchievementCompleted(achID: string): boolean {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.achList[achID].completed);
}

export function useAchievementObjectiveNumber(achID: string, objID: string): number {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.achList[achID].objectives[objID] as number);
}

export function useAchievementObjectiveList(achID: string, objID: string): string[] {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStoreWithEqualityFn(store,
        (s) => s.achList[achID].objectives[objID] as string[],
        (a, b) => isNonorderedArrayEqual(a, b)
    );
}

