import { Divider, Skeleton } from "@mantine/core";
import styles from "./AchievementList.module.css";
import React from 'react';

export function LoadingAchievement() {
    return (
        <section className={`${styles.achievement} ${styles.skeletonSection}`}>
            <div className={styles.info}>
                <div className={styles.icons}>
                    <Skeleton width='4rem' height='4rem' />
                </div>
                <div className={`${styles.desc} ${styles.skeletonInfo}`}>
                    <Skeleton height='1.125rem' className={styles.skeletonTitle}  />
                    <Skeleton height='1rem' className={styles.skeletonDesc} />
                </div>
                <div className={styles.achievementCompleted}>
                    <Skeleton width='3rem' height='3rem' />
                </div>
            </div>
        </section>
    );
}

export default function LoadingAchievementList() {
    const skeletonList = Array(12).fill(<LoadingAchievement />).map((ele, index, arr) => (
        <React.Fragment key={index}>
            {ele}
            {index != (arr.length - 1) && (<Divider size='md' ml='md' mr='md' />) }
        </React.Fragment>
    ));

    return (
        <main className={styles.achievementList}>
            {...skeletonList}
        </main>
    );
}