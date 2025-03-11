import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { isNonorderedArrayEqual } from "trucksim-completionist-common";
import { useStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

export function useFuncMarkAchievementComplete() {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.markComplete);
}

export function useFuncSetNumberObj() {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.setCounter);
}

export function useFuncMarkListObj() {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.markListObj);
}

export function useStateAchievementCompleted(achID: string): boolean {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.saveData[achID].completed);
}

export function useStateAchievementNumberObj(achID: string, objID: string): number {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.saveData[achID].objectives[objID] as number);
}

export function useStateAchievementListObj(achID: string, objID: string): string[] {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStoreWithEqualityFn(store,
        (s) => s.saveData[achID].objectives[objID] as string[],
        (a, b) => isNonorderedArrayEqual(a, b)
    );
}

