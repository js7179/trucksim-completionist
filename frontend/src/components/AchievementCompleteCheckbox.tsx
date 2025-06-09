import { useRemoteFuncMarkAchievementComplete, useRemoteStateAchievementCompleted } from '@/hooks/RemoteAchievementHooks';
import { useLocalStateAchievementCompleted, useLocalFuncMarkAchievementComplete } from '@/hooks/LocalAchievementHooks';
import { useRemotePage } from '@/hooks/RemotePageContext';
import { Checkbox, CheckboxProps } from '@mantine/core';

export function LocalCompleteCheckbox({achID}: AchievementCheckboxProps) {
    const completed = useLocalStateAchievementCompleted(achID);
    const dispatch = useLocalFuncMarkAchievementComplete();

    const toggleAchievement = () => {
        dispatch(achID, !completed);
    };

    return (
        <VisualCompleteCheckbox achID={achID} completed={completed} onClick={toggleAchievement} />
    );
}

export function RemoteCompleteCheckbox({achID}: AchievementCheckboxProps) {
    const { uid, game } = useRemotePage();
    const { data: completed } = useRemoteStateAchievementCompleted(uid, game, achID);
    const dispatch = useRemoteFuncMarkAchievementComplete();

    const toggleAchievement = () => {
        dispatch.mutate({ uid, game, achID, shouldMarkOff: !completed });
    };

    return (
        <VisualCompleteCheckbox achID={achID} completed={completed} onClick={toggleAchievement} />
    );
}

function VisualCompleteCheckbox({achID, completed, onClick}: VisualCompleteCheckboxProps) {
    return (
        <Checkbox 
            id={`${achID}.completed`}
            checked={completed} 
            onClick={onClick} 
            size='48px' 
            styles={{
                input: {
                    border: '4px solid var(--mantine-primary-color-8)',
                    backgroundColor: 'var(--mantine-color-dark-7)'
                }
            }} />
    );
}

export interface AchievementCheckboxProps {
    achID: string;
}

interface VisualCompleteCheckboxProps {
    achID: string;
    completed: boolean;
    onClick: CheckboxProps['onClick'];
}