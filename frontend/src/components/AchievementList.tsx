import { useState } from 'react';
import "./AchievementList.css";

export default function AchievementList({ aList }:{ aList:AchievementInfo[] }) {
    const list = aList.map((achievement) => <Achievement {...achievement} key={achievement.id} />);
    return (
        <main className="achievementList">
            {list}
        </main>
    );
}

function Achievement(props: AchievementInfo) {
    const [completed, setCompleted] = useState(false);

    const checkboxComplete = () => {
        setCompleted(!completed);
    };

    const checkboxID = props.id + "Checkbox";

    return (
        <section className="achievement">
            <div className="info">
                <div className="icons">
                    <img src={ completed ? props.icons.completed : props.icons.incomplete } alt=''/>
                </div>
                <div className="desc">
                    <h2 className="achievementName">{props.name}</h2>
                    <p>{props.desc}</p>
                </div>
                <div className="achievementCompleted">
                    <input type="checkbox" id={checkboxID} value={completed ? 1 : 0} className="achComplChkbox" onClick={checkboxComplete} />
                    <label htmlFor={checkboxID} className="achComplLabel"></label>
                </div>
            </div>
        </section>
    );
}

interface IconType {
    completed: string;
    incomplete: string;
};

export interface AchievementInfo {
    desc: string;
    icons: IconType;
    id: string;
    name: string;
};