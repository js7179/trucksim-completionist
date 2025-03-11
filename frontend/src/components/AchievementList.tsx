import { useState } from 'react';
import styles from "./AchievementList.module.css";
import { AchievementInfo, CounterObjectiveInfo, ListObjectiveInfo, PartialObjectiveInfo, SequentialObjectiveInfo } from 'trucksim-completionist-common';
import { ShowInformationButton } from './util/StylizedCheckbox';
import { useComponentContext } from '@/hooks/ComponentContext';

export default function AchievementList({ aList }:{ aList:AchievementInfo[] }) {
    const list = aList.map((achievement) => <Achievement {...achievement} key={achievement.id} />);
    return (
        <main className={styles.achievementList}>
            {list}
        </main>
    );
}

function Achievement(props: AchievementInfo) {
    const [showInfo, toggleInfoView] = useState(false);
    const components = useComponentContext();
    const showInfoID = `${props.id}.showInfo`;

    const objs = props.objectives.map((obj) => {
        switch(obj.type) {
            case 'list':
                return <components.AchObjList {...obj as ListObjectiveInfo} achID={props.id} key={obj.objid} />;
            case 'counter':
                return <components.AchObjCounter {...obj as CounterObjectiveInfo} achID={props.id} key={obj.objid}/>;
            case 'sequential':
                return <components.AchObjSeq {...obj as SequentialObjectiveInfo} achID={props.id} key={obj.objid} />;
            case 'partial':
                return <components.AchObjPartial {...obj as PartialObjectiveInfo} achID={props.id} key={obj.objid} />;
        }
    });

    return (
        <section className={styles.achievement}>
            <div className={styles.info}>
                <div className={styles.icons}>
                    <components.AchIcon achID={props.id} {...props.icons} />
                </div>
                <div className={styles.desc}>
                    <h2 className={styles.achievementName}>{props.name}</h2>
                    <p>{props.desc}</p>
                </div>
                <div className={styles.showInformation}>
                    <ShowInformationButton htmlID={showInfoID} checked={showInfo} onClick={() => toggleInfoView(!showInfo)}/>
                </div>
                <div className={styles.achievementCompleted}>
                    <components.AchCompleteCheckbox achID={props.id} />
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