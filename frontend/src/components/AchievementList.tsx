import {  useState } from 'react';
import styles from "./AchievementList.module.css";
import { AchievementInfo, CounterObjectiveInfo, ListObjectiveInfo, PartialObjectiveInfo, SequentialObjectiveInfo } from 'trucksim-completionist-common';
import ShowInformationButton from './util/ShowInformationButton';
import { IconProps } from './AchievementIcon';
import { AchievementCheckboxProps } from './AchievementCompleteCheckbox';
import { CounterObjectiveProps } from './objectives/CounterObjective';
import { ListObjectiveProps } from './objectives/ListObjective';
import { PartialObjectivesProp } from './objectives/PartialObjective';
import { SequentialObjectiveProps } from './objectives/SequentialObjective';

export default function AchievementList(props: AchievementListProps) {
    const {achList, ...rest} = props;
    const list = achList.map((achievement) => <Achievement {...achievement} key={achievement.id} {...rest} />);
    return (
        <main className={styles.achievementList}>
            {list}
        </main>
    );
}

function Achievement(props: AchievementProps) {
    const [showInfo, toggleInfoView] = useState(false);

    const objs = props.objectives.map((obj) => {
        switch(obj.type) {
            case 'list':
                return <props.achObjList {...obj as ListObjectiveInfo} achID={props.id} key={obj.objid} />;
            case 'counter':
                return <props.achObjCounter {...obj as CounterObjectiveInfo} achID={props.id} key={obj.objid}/>;
            case 'sequential':
                return <props.achObjSeq {...obj as SequentialObjectiveInfo} achID={props.id} key={obj.objid} />;
            case 'partial':
                return <props.achObjPartial {...obj as PartialObjectiveInfo} achID={props.id} key={obj.objid} />;
        }
    });

    return (
        <section className={styles.achievement} aria-labelledby={props.id + '.name'} data-ach-id={props.id}>
            <div className={styles.info}>
                <div className={styles.icons}>
                    <props.achIcon achID={props.id} {...props.icons} />
                </div>
                <div className={styles.desc}>
                    <h2 className={styles.achievementName} id={props.id + '.name'}>{props.name}</h2>
                    <p>{props.desc}</p>
                </div>
                <div className={styles.showInformation} data-achexpandinfo={props.id}>
                    <ShowInformationButton id={props.id} name={props.name} isToggled={showInfo} onClick={() => toggleInfoView(!showInfo)} />
                </div>
                <div className={styles.achievementCompleted} data-ach-checkbox={props.id}>
                    <props.achCompleteCheckbox achID={props.id} />
                </div>
            </div>
            {showInfo && (
                <div className={styles.objectiveContainer} data-obj-container={props.id}>
                    {...objs}
                </div>
            )}
        </section>
    );
}

export type AchListComponentProps = {
    achIcon: (props: IconProps) => JSX.Element;
    achCompleteCheckbox: (props: AchievementCheckboxProps) => JSX.Element;
    achObjList: (props: ListObjectiveProps) => JSX.Element;
    achObjCounter: (props: CounterObjectiveProps) => JSX.Element;
    achObjSeq: (props: SequentialObjectiveProps) => JSX.Element;
    achObjPartial: (props: PartialObjectivesProp) => JSX.Element;
};
type AchievementListProps = AchListComponentProps & { achList: AchievementInfo[]; };
type AchievementProps = AchievementInfo & AchListComponentProps;