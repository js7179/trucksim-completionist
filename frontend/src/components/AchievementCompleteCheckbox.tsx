import { AchievementStateContext } from '@/store/AchievementStore';
import { useContext } from 'react';
import { useStore } from 'zustand';
import { STATE_ACTION } from 'trucksim-tracker-common';
import Checkbox from './util/Checkbox';

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

    const htmlID = props.achID + '.completed';

    return (
        <Checkbox 
            htmlID={htmlID} 
            checked={completed} 
            onClick={() => toggleAchievement()} 
            filterCSS='invert(33%) sepia(61%) saturate(4001%) hue-rotate(29deg) brightness(99%) contrast(101%)' 
            size='48px'
            />
    );
}

export interface AchievementCheckboxProps {
    achID: string;
}