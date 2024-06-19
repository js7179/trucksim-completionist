import { ComponentType, useState } from 'react';
import styles from "./AchievementList.module.css";
import ListObjective from './objectives/ListObjective';
import CounterObjective from './objectives/CounterObjective';
import SequentialObjective from './objectives/SequentialObjective';
import { AchievementInfo, CounterObjectiveInfo, ListObjectiveInfo, SequentialObjectiveInfo } from 'trucksim-tracker-common';
import { IconProps, LocalIcon } from './AchievementIcon';
import { AchievementCheckboxProps, LocalCompleteCheckbox } from './AchievementCompleteCheckbox';
import StylizedCheckbox from './util/StylizedCheckbox';

const OBJECTIVE_TOGGLE_COMMON_STYLES: React.CSSProperties = {
    backgroundImage: 'url("/vector/caret.svg")',
    filter: 'invert(33%) sepia(61%) saturate(4001%) hue-rotate(29deg) brightness(99%) contrast(101%)',
    width: '48px',
    height: '48px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    transition: '0.125s ease'
};

export default function AchievementList({ aList }:{ aList:AchievementInfo[] }) {
    const list = aList.map((achievement) => <Achievement {...achievement} key={achievement.id} Icon={LocalIcon} CompleteCheckbox={LocalCompleteCheckbox} />);
    return (
        <main className={styles.achievementList}>
            {list}
        </main>
    );
}

function Achievement(props: AchievementProps) {
    const [showObjectives, toggleObjectiveView] = useState(false);
    const showObjID = `${props.id}.showObj`;

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
                {props.objectives.length != 0 && (
                    <div className={styles.showObjectives}>
                        <StylizedCheckbox 
                            htmlID={showObjID} 
                            checked={showObjectives}
                            onClick={() => toggleObjectiveView(!showObjectives)}
                            buttonCheckedStyle={{
                                transform: `rotate(180deg)`,
                                ...OBJECTIVE_TOGGLE_COMMON_STYLES
                            }}
                            buttonUncheckedStyle={{
                                transform: `rotate(0deg)`,
                                ...OBJECTIVE_TOGGLE_COMMON_STYLES
                            }} />
                    </div>
                )}
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