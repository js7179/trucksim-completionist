import { AchievementCheckboxProps, LocalCompleteCheckbox, RemoteCompleteCheckbox } from "@/components/AchievementCompleteCheckbox";
import { IconProps, LocalIcon, RemoteIcon } from "@/components/AchievementIcon";
import { LocalCounterObjective, CounterObjectiveProps, RemoteCounterObjective } from "@/components/objectives/CounterObjective";
import { ListObjectiveProps, LocalListObjective, RemoteListObjective } from "@/components/objectives/ListObjective";
import { LocalPartialObjective, PartialObjectivesProp, RemotePartialObjective } from "@/components/objectives/PartialObjective";
import { LocalSequentialObjective, RemoteSequentialObjective, SequentialObjectiveProps } from "@/components/objectives/SequentialObjective";
import { ComponentType, PropsWithChildren, createContext, useContext } from "react";

type ComponentContext = {
    AchIcon: ComponentType<IconProps>;
    AchCompleteCheckbox: ComponentType<AchievementCheckboxProps>;
    AchObjCounter: ComponentType<CounterObjectiveProps>;
    AchObjList: ComponentType<ListObjectiveProps>;
    AchObjSeq: ComponentType<SequentialObjectiveProps>;
    AchObjPartial: ComponentType<PartialObjectivesProp>;
}

export const ComponentContext = createContext<ComponentContext>({} as ComponentContext);

const ComponentContextProvider = (props: PropsWithChildren<ComponentContext>) => {
    const {children, ...nonChildProps} = props;
    return (
        <ComponentContext.Provider value={nonChildProps}>
            {children}
        </ComponentContext.Provider>
    );
}

export const LocalComponentContext = ({children}: PropsWithChildren) => {
    return (
        <ComponentContextProvider 
            AchIcon={LocalIcon} 
            AchCompleteCheckbox={LocalCompleteCheckbox} 
            AchObjCounter={LocalCounterObjective} 
            AchObjList={LocalListObjective} 
            AchObjSeq={LocalSequentialObjective} 
            AchObjPartial={LocalPartialObjective}>
            {children}
        </ComponentContextProvider>
    );
}

export const RemoteComponentContext = ({children}: PropsWithChildren) => {
    return (
        <ComponentContextProvider 
            AchIcon={RemoteIcon} 
            AchCompleteCheckbox={RemoteCompleteCheckbox} 
            AchObjCounter={RemoteCounterObjective} 
            AchObjList={RemoteListObjective} 
            AchObjSeq={RemoteSequentialObjective} 
            AchObjPartial={RemotePartialObjective}>
            {children}
        </ComponentContextProvider>
    );
}

export function useComponentContext() {
    return useContext(ComponentContext);
}