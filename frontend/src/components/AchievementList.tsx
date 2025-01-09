import { ComponentType, useState } from 'react';
import styles from "./AchievementList.module.css";
import ListObjective from './objectives/ListObjective';
import CounterObjective from './objectives/CounterObjective';
import SequentialObjective from './objectives/SequentialObjective';
import { AchievementInfo, CounterObjectiveInfo, ListObjectiveInfo, PartialObjectiveInfo, SequentialObjectiveInfo } from 'trucksim-completionist-common';
import { IconProps, LocalIcon } from './AchievementIcon';
import { AchievementCheckboxProps, LocalCompleteCheckbox } from './AchievementCompleteCheckbox';
import { ShowInformationButton } from './util/StylizedCheckbox';
import PartialObjective from './objectives/PartialObjective';

export default function AchievementList({ aList }:{ aList:AchievementInfo[] }) {
    const list = aList.map((achievement) => <Achievement {...achievement} key={achievement.id} Icon={LocalIcon} CompleteCheckbox={LocalCompleteCheckbox} />);
    return (
        <main className={styles.achievementList}>
            {list}
        </main>
    );
}

function Achievement(props: AchievementProps) {
    const [showInfo, toggleInfoView] = useState(false);
    const showInfoID = `${props.id}.showInfo`;

    const objs = props.objectives.map((obj) => {
        switch(obj.type) {
            case 'list':
                return <ListObjective {...obj as ListObjectiveInfo} achID={props.id} key={obj.objid} />;
            case 'counter':
                return <CounterObjective {...obj as CounterObjectiveInfo} achID={props.id} key={obj.objid}/>;
            case 'sequential':
                return <SequentialObjective {...obj as SequentialObjectiveInfo} achID={props.id} key={obj.objid} />;
            case 'partial':
                return <PartialObjective {...obj as PartialObjectiveInfo} achID={props.id} key={obj.objid} />;
        }
    });

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
                <div className={styles.showInformation}>
                    <ShowInformationButton htmlID={showInfoID} checked={showInfo} onClick={() => toggleInfoView(!showInfo)}/>
                </div>
                <div className={styles.achievementCompleted}>
                    <props.CompleteCheckbox achID={props.id} />
                </div>
            </div>
            {showInfo && (
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