import { CheckboxButton } from './util/StylizedCheckbox';
import { useStateAchievementCompleted, useFuncMarkAchievementComplete } from '@/hooks/AchievementHooks';

export function LocalCompleteCheckbox({achID}: AchievementCheckboxProps) {
    const completed = useStateAchievementCompleted(achID);
    const dispatch = useFuncMarkAchievementComplete();

    const toggleAchievement = () => {
        dispatch(achID, !completed);
    };

    const htmlID = `${achID}.completed`;

    return (
        <CheckboxButton htmlID={htmlID} checked={completed} onClick={toggleAchievement} size="48px" colorFilter="var(--primary-color-filter)"/>
    );
}

export interface AchievementCheckboxProps {
    achID: string;
}