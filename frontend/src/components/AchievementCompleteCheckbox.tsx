import { AchievementStateContext } from '@/store/AchievementStore';
import { useContext } from 'react';
import { useStore } from 'zustand';
import { STATE_ACTION } from 'trucksim-tracker-common';
import StylizedCheckbox from './util/StylizedCheckbox';

const CHECKBOX_COMMON_STYLE: React.CSSProperties = {
    filter: 'var(--primary-color-filter)',
    width: '48px',
    height: '48px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%'
};

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
        <StylizedCheckbox 
            htmlID={htmlID} 
            checked={completed} 
            onClick={() => toggleAchievement()} 
            buttonCheckedStyle={{
                backgroundImage: `url("/vector/checked.svg")`,
                ...CHECKBOX_COMMON_STYLE
            }}
            buttonUncheckedStyle={{
                backgroundImage: `url("/vector/unchecked.svg")`,
                ...CHECKBOX_COMMON_STYLE
            }} />
    );
}

export interface AchievementCheckboxProps {
    achID: string;
}