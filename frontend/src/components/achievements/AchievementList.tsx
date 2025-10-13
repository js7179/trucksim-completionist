import styles from "./AchievementList.module.css";
import { AchievementInfo, CounterObjectiveInfo, ListObjectiveInfo, PartialObjectiveInfo, SequentialObjectiveInfo } from 'trucksim-completionist-common';
import ShowInformationButton from '@/components/util/ShowInformationButton';
import { IconProps } from './AchievementIcon';
import { AchievementCheckboxProps } from './AchievementCompleteCheckbox';
import { CounterObjectiveProps } from '@/components/objectives/CounterObjective';
import { ListObjectiveProps } from '@/components/objectives/ListObjective';
import { PartialObjectivesProp } from '@/components/objectives/PartialObjective';
import { SequentialObjectiveProps } from '@/components/objectives/SequentialObjective';
import { Collapse, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';

export default function AchievementList(props: AchievementListProps) {
    const {achList, ...rest} = props;
    const list = achList.map(
        (achievement, index, arr) => 
        <React.Fragment key={achievement.id}>
            <Achievement {...achievement} {...rest} />
            {index != (arr.length - 1) && (<Divider size='md' ml='md' mr='md' />) }
        </React.Fragment>
    );
    return (
        <main className={styles.achievementList}>
            {list}
        </main>
    );
}

function Achievement(props: AchievementProps) {
    const [opened, {toggle}] = useDisclosure(false);

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
        <section className={styles.achievement} aria-labelledby={props.id + '.name'}>
            <div className={styles.info}>
                <div className={styles.icons}>
                    <props.achIcon achID={props.id} {...props.icons} />
                </div>
                <div className={styles.desc}>
                    <h2 className={styles.achievementName} id={props.id + '.name'}>{props.name}</h2>
                    <p>{props.desc}</p>
                </div>
                <div className={styles.showInformation}>
                    <ShowInformationButton id={props.id} name={props.name} isToggled={opened} onClick={toggle} />
                </div>
                <div className={styles.achievementCompleted}>
                    <props.achCompleteCheckbox achID={props.id} achName={props.name} />
                </div>
            </div>
            <Collapse in={opened}>
                <div className={styles.objectiveContainer} data-obj-container={props.id}>
                    {...objs}
                </div>
            </Collapse>
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