/** This component renders a checkbox that can be stylized
 */
export default function StylizedCheckbox(props: StylizedCheckboxProps) {
    const hasText = props.labelText && props.labelText !== '';

    const buttonStyle: React.CSSProperties = { display: 'inline-block', cursor: 'pointer' };
    Object.assign(buttonStyle, props.checked ? props.buttonCheckedStyle : props.buttonUncheckedStyle);

    const labelStyle: React.CSSProperties = { cursor: 'pointer' };
    Object.assign(labelStyle, props.checked ? props.labelCheckedStyle : props.labelUncheckedStyle);

    return (
        <>
            <input type="checkbox" id={props.htmlID}
                value={props.checked ? 1 : 0}
                onClick={() => props.onClick()}
                checked={props.checked}
                onChange={() => {}}
                style={{ display: 'none' }}
                />
            <label 
                htmlFor={props.htmlID}
                style={buttonStyle} />
            {hasText && 
                <label htmlFor={props.htmlID} style={labelStyle}>{props.labelText}</label>
            }
    </>
    );
}

interface StylizedCheckboxProps {
    htmlID: string,
    checked: boolean,
    onClick: VoidFunction;

    buttonCheckedStyle: React.CSSProperties;
    buttonUncheckedStyle: React.CSSProperties;

    labelText?: string;
    labelCheckedStyle?: React.CSSProperties;
    labelUncheckedStyle?: React.CSSProperties;
}