import { useRemoteFuncMarkAchievementComplete, useRemoteStateAchievementCompleted } from '@/hooks/RemoteAchievementHooks';
import { useLocalStateAchievementCompleted, useLocalFuncMarkAchievementComplete } from '@/hooks/LocalAchievementHooks';
import { useRemotePage } from '@/hooks/RemotePageContext';
import { Checkbox } from '@mantine/core';
import { useCallback } from 'react';

export function LocalCompleteCheckbox({achID, achName}: AchievementCheckboxProps) {
    const completed = useLocalStateAchievementCompleted(achID);
    const dispatch = useLocalFuncMarkAchievementComplete();

    const toggleAchievement = useCallback((newState: boolean) => {
        dispatch(achID, newState);
    }, [dispatch, achID]);

    return (
        <VisualCompleteCheckbox achID={achID} achName={achName} completed={completed} callbackToggle={toggleAchievement} />
    );
}

export function RemoteCompleteCheckbox({achID, achName}: AchievementCheckboxProps) {
    const { uid, game } = useRemotePage();
    const { data: completed } = useRemoteStateAchievementCompleted(uid, game, achID);
    const dispatch = useRemoteFuncMarkAchievementComplete();

    const toggleAchievement = useCallback((newState: boolean) => {
        dispatch.mutate({ uid, game, achID, shouldMarkOff: newState });
    }, [dispatch, uid, game, achID]);

    return (
        <VisualCompleteCheckbox achID={achID} achName={achName} completed={completed} callbackToggle={toggleAchievement} />
    );
}

function VisualCompleteCheckbox({achID, achName, completed, callbackToggle}: VisualCompleteCheckboxProps) {
    return (
        <Checkbox 
            id={`${achID}.completed`}
            checked={completed} 
            onChange={(event) => callbackToggle(event.currentTarget.checked)} 
            size='48px' 
            styles={{
                input: {
                    border: '4px solid var(--mantine-primary-color-8)',
                    backgroundColor: 'var(--mantine-color-dark-7)'
                }
            }}
            aria-label={`${achName} achievement`} />
    );
}

export interface AchievementCheckboxProps {
    achID: string;
    achName: string;
}

interface VisualCompleteCheckboxProps {
    achID: string;
    achName: string;
    completed: boolean;
    callbackToggle: (newState: boolean) => void;
}