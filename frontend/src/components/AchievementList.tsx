import { ComponentType } from 'react';
import styles from "./AchievementList.module.css";
import ListObjective from './objectives/ListObjective';
import CounterObjective from './objectives/CounterObjective';
import SequentialObjective from './objectives/SequentialObjective';
import { AchievementInfo, CounterObjectiveInfo, ListObjectiveInfo, SequentialObjectiveInfo } from 'trucksim-tracker-common';
import { IconProps, LocalIcon } from './AchievementIcon';
import { AchievementCheckboxProps, LocalCompleteCheckbox } from './AchievementCompleteCheckbox';

export default function AchievementList({ aList }:{ aList:AchievementInfo[] }) {
    const list = aList.map((achievement) => <Achievement {...achievement} key={achievement.id} Icon={LocalIcon} CompleteCheckbox={LocalCompleteCheckbox} />);
    return (
        <main className={styles.achievementList}>
            {list}
        </main>
    );
}

function Achievement(props: AchievementProps) {
    const objs = props.objectives.map((obj) => {
        switch(obj.type) {
            case 'list':
                return <ListObjective {...obj as ListObjectiveInfo} achID={props.id} key={obj.objid} />;
            case 'counter':
                return <CounterObjective {...obj as CounterObjectiveInfo} achID={props.id} key={obj.objid}/>;
            case 'sequential':
                return <SequentialObjective {...obj as SequentialObjectiveInfo} achID={props.id} key={obj.objid} />;
        }
    });

    const showObjectives = objs.length != 0;

    return (
        <section className={styles.achievement}>
            <div className={styles.info}>
                <div className={styles.icons}>
                    <props.Icon achID={props.id} {...props.icons} />
                </div>
                <div className={styles.desc}>
                    <h2 className={styles.achievementName}>{props.name}</h2>
                    <p>{props.desc}</p>
                </div>
                <div className={styles.achievementCompleted}>
                    <props.CompleteCheckbox achID={props.id} />
                </div>
            </div>
            {showObjectives && (
                <div className={styles.objectiveContainer}>
                    {...objs}
                </div>
            )}
        </section>
    );
}

interface AchievementProps extends AchievementInfo {
    Icon: ComponentType<IconProps>;
    CompleteCheckbox: ComponentType<AchievementCheckboxProps>;
}