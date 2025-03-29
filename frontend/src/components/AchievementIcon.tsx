import styles from "./AchievementIcon.module.css";
import { useLocalStateAchievementCompleted } from "@/hooks/LocalAchievementHooks";
import { useRemoteStateAchievementCompleted } from "@/hooks/RemoteAchievementHooks";
import { useRemotePage } from "@/hooks/RemotePage";

export function LocalIcon({achID, completed, incomplete}: IconProps) {
    const isDone = useLocalStateAchievementCompleted(achID);
    return (
        <VisualIcon completed={completed} incomplete={incomplete} achID={achID} isAchComplete={isDone} />
    )
}

export function RemoteIcon({achID, completed, incomplete}: IconProps) {
    const { uid, game } = useRemotePage();
    const { data } = useRemoteStateAchievementCompleted(uid, game, achID);
    
    const isDone = data as boolean;
    return (
        <VisualIcon completed={completed} incomplete={incomplete} achID={achID} isAchComplete={isDone} />
    )
}

function VisualIcon({completed, incomplete, isAchComplete, achID}: IconProps & VisualIconProps) {
    return (
        <img src={isAchComplete ? completed : incomplete} className={styles.icon} data-achicon={achID} alt='' />
    );
}

export type IconProps = {
    completed: string;
    incomplete: string;
    achID: string;
}

type VisualIconProps = {
    isAchComplete: boolean;
}