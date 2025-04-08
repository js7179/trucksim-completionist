import styles from './StylizedCheckboxes.module.css';

const CHECKBOX_IMG = {
    checked: {
        svg: "/vector/checked.svg",
        fallback: "/assets/checked.png"
    },
    unchecked: {
        svg: "/vector/unchecked.svg",
        fallback: "/assets/unchecked.png"
    }
};

/** This component renders a checkbox that can be toggled. For use in marking achievement completion,
 * or objective item completion. The checkbox can optionally have an label for the item associated
 * with it. 
 * 
 * @param {string} htmlID           The ID associated with this HTML control
 * @param {boolean} checked         Is the checkbox currently checked?
 * @param {VoidFunction} onClick    What to trigger to change state when clicked
 * @param {string} size             CSS value of the size of the checkbox
 * @param {string} colorFilter      What filter to apply to the image to achieve a certain look
 * @param {string?} label           If the checkbox has any associated text
 * @returns {JSX.Element}              Checkbox component (with label if provided)
 */
export function CheckboxButton({htmlID, checked, onClick, size, colorFilter, label}: CheckboxButtonProps) {
    const img = CHECKBOX_IMG[checked ? 'checked' : 'unchecked'];
    const hasLabel = label && label !== '';
    
    return (
        <>
            <input 
                type="checkbox" 
                className={styles.checkboxButtonInput}
                id={htmlID}
                value={checked ? 1 : 0}
                onClick={() => onClick()}
                onChange={() => {}}
                checked={checked} /> 
            <label htmlFor={htmlID} className={styles.checkboxButtonImgLabel} style={{height: size}}>
                <img className={styles.checkboxButtonImg}
                    src={img.fallback}
                    srcSet={img.svg}
                    style={{filter: colorFilter, width: size, height: size}} />
            </label>
            {
                hasLabel && <label className={styles.checkboxButtonTextLabel} htmlFor={htmlID}>{label}</label>
            }
        </>
    );
}

/** This component renders a toggle for showing additional information about an achievement 
 * (e.g. information on like trailer type, company names, etc. and objectives associated 
 * with achievements)
 * 
 * @param {string} htmlID           The ID associated with this HTML control
 * @param {boolean} checked         Is the checkbox currently checked?
 * @param {VoidFunction} onClick    What to trigger to change state when clicked
 * @returns {JSX.Element}              Show Information checkbox
 */
export function ShowInformationButton({htmlID, checked, onClick}: ShowInformationButtonProps) {
    const transformValue = checked ? 'rotate(180deg)' : 'rotate(0deg)';

    return (
        <>
            <input
                type="checkbox"
                className={styles.showInfoBtnInput}
                id={htmlID}
                value={checked ? 1 : 0}
                onClick={() => onClick()}
                onChange={() => {}}
                checked={checked} />
            <label htmlFor={htmlID}>
                <img 
                    className={styles.showInfoButtonImg} 
                    src="/assets/caret.png" 
                    srcSet="/vector/caret.svg"
                    style={{transform: transformValue}} />
            </label>
        </>
    );
}

interface CheckboxButtonProps {
    htmlID: string;
    checked: boolean;
    onClick: VoidFunction;

    size: string;
    colorFilter: string;

    label?: string;
}

interface ShowInformationButtonProps {
    htmlID: string;
    checked: boolean;
    onClick: VoidFunction;
}