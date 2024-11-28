import { STATE_ACTION } from 'trucksim-completionist-common';
import { CheckboxButton } from './util/StylizedCheckbox';
import { useAchievementCompleted, useAchievementDispatch } from '@/hooks/AchievementHooks';

export function LocalCompleteCheckbox({achID}: AchievementCheckboxProps) {
    const completed = useAchievementCompleted(achID);
    const dispatch = useAchievementDispatch();

    const toggleAchievement = () => {
        dispatch({
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: achID,
            shouldMarkOff: !completed
        });
    };

    const htmlID = `${achID}.completed`;

    return (
        <CheckboxButton htmlID={htmlID} checked={completed} onClick={toggleAchievement} size="48px" colorFilter="var(--primary-color-filter)"/>
    );
}

export interface AchievementCheckboxProps {
    achID: string;
}