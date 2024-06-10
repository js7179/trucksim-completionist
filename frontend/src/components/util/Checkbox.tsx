import styles from './Checkbox.module.css';

/** This component renders a square checkbox that can be interactive (responds to clicks).
 * 
 * @param {string} htmlID       The ID to use in the HTML for the checkbox
 * @param {boolean} checked     Whether the checkbox is checked off or not
 * @param {function} onClick    What happens when the checkbox is clicked
 * @param {string} filterCSS    What the `filter` CSS property should be, to get the checkbox to a specific color
 * @param {string} size         The size of the checkbox, given in CSS value+units
 * @param {string?} labelText    The text associated with this checkbox. Optional prop. Can exclude it if not needed.
 * @returns 
 */
export default function Checkbox(props: CheckboxProps) {
    const hasText = props.labelText !== undefined && props.labelText !== '';

    return (
        <>
            <input type="checkbox" id={props.htmlID}
                value={props.checked ? 1 : 0}
                className={styles.checkbox}
                onClick={() => props.onClick()}
                checked={props.checked}
                onChange={() => {}}
                />
            <label 
                htmlFor={props.htmlID} 
                className={styles.checkboxSVG}
                style={{
                    filter: props.filterCSS,
                    width: props.size,
                    height: props.size,
                    backgroundSize: 'auto ' + props.size
                }} />
            {hasText && 
                <label htmlFor={props.htmlID} className={styles.checkboxText}>{props.labelText}</label>
            }
    </>
    )
}

interface CheckboxProps {
    htmlID: string,
    checked: boolean,
    onClick: VoidFunction;

    // appearance
    filterCSS: string;
    size: string;

    labelText?: string;
}