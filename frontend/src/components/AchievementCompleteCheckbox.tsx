import { AchievementStateContext } from '@/store/AchievementStore';
import { useContext } from 'react';
import { useStore } from 'zustand';
import { STATE_ACTION } from 'trucksim-tracker-common';
import { CheckboxButton } from './util/StylizedCheckbox';


export function LocalCompleteCheckbox(props: AchievementCheckboxProps) {
    const store = useContext(AchievementStateContext);
    if(!store) throw new Error("Missing AchievementStateContext.Provider");
    const completed = useStore(store, (s) => s.achList[props.achID].completed);
    const dispatch = useStore(store, (s) => s.performAction);

    const toggleAchievement = () => {
        dispatch({
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: props.achID,
            shouldMarkOff: !completed
        });
    };

    const htmlID = `${props.achID}.completed`;

    return (
        <CheckboxButton htmlID={htmlID} checked={completed} onClick={toggleAchievement} size="48px" colorFilter="var(--primary-color-filter)"/>
    );
}

export interface AchievementCheckboxProps {
    achID: string;
}