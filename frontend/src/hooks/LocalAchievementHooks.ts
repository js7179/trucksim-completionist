import { AchievementStateContext } from "@/store/AchievementStore";
import { useContext } from "react";
import { isNonorderedArrayEqual } from "trucksim-completionist-common";
import { useStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

export function useLocalFuncMarkAchievementComplete() {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.markComplete);
}

export function useLocalFuncSetNumberObj() {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.setCounter);
}

export function useLocalFuncMarkListObj() {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.markListObj);
}

export function useLocalStateAchievementCompleted(achID: string): boolean {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.saveData?.[achID]?.completed ?? false);
}

export function useLocalStateAchievementNumberObj(achID: string, objID: string): number {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStore(store, (s) => s.saveData?.[achID]?.objectives?.[objID] as number ?? 0);
}

export function useLocalStateAchievementListObj(achID: string, objID: string): string[] {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    return useStoreWithEqualityFn(store,
        (s) => s.saveData?.[achID]?.objectives?.[objID] as string[] ?? [] as string[],
        (a, b) => isNonorderedArrayEqual(a, b)
    );
}

