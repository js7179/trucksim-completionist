import styles from './ProgressBar.module.css';

export function ProgressBar(props: ProgressBarProps) {
    const pct_progress = props.current / props.max;
    const width_pct = (pct_progress * 100).toFixed(0) + '%';
    
    const use_outer = pct_progress < 0.6;
    const txt = props.current + ' / ' + props.max;
     
    return (
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: width_pct }}>
                {!use_outer && (<p className={styles.innerProgress}>{txt}</p>)}
            </div>
            {use_outer && (<p className={styles.outerProgress}>{txt}</p>)}
        </div>
    );
}

interface ProgressBarProps {
    current: number;
    max: number;
}