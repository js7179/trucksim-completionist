import { useRemoteFuncMarkAchievementComplete, useRemoteStateAchievementCompleted } from '@/hooks/RemoteAchievementHooks';
import { CheckboxButton } from './util/StylizedCheckbox';
import { useLocalStateAchievementCompleted, useLocalFuncMarkAchievementComplete } from '@/hooks/LocalAchievementHooks';
import { useRemotePage } from '@/hooks/RemotePage';

export function LocalCompleteCheckbox({achID}: AchievementCheckboxProps) {
    const completed = useLocalStateAchievementCompleted(achID);
    const dispatch = useLocalFuncMarkAchievementComplete();

    const toggleAchievement = () => {
        dispatch(achID, !completed);
    };

    const htmlID = `${achID}.completed`;

    return (
        <CheckboxButton htmlID={htmlID} checked={completed} onClick={toggleAchievement} size="48px" colorFilter="var(--primary-color-filter)"/>
    );
}

export function RemoteCompleteCheckbox({achID}: AchievementCheckboxProps) {
    const { uid, game } = useRemotePage();
    const { data: completed } = useRemoteStateAchievementCompleted(uid, game, achID);
    const dispatch = useRemoteFuncMarkAchievementComplete();

    const toggleAchievement = () => {
        dispatch.mutate({ uid, game, achID, shouldMarkOff: !completed });
    };

    const htmlID = `${achID}.completed`;
    return (
        <CheckboxButton htmlID={htmlID} checked={completed} onClick={toggleAchievement} size="48px" colorFilter="var(--primary-color-filter)"/>
    );
}

export interface AchievementCheckboxProps {
    achID: string;
}