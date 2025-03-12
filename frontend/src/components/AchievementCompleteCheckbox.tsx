import { CheckboxButton } from './util/StylizedCheckbox';
import { useStateAchievementCompleted, useFuncMarkAchievementComplete } from '@/hooks/LocalAchievementHooks';

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

export function RemoteCompleteCheckbox({achID}: AchievementCheckboxProps) {
    return (
        <p>To be implemented</p>
    );
}

export interface AchievementCheckboxProps {
    achID: string;
}