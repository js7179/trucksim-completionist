import { Box, MantineStyleProp, Progress, Text } from "@mantine/core";
import { useCallback } from "react";

export function ProgressBar({current, max, boxStyle}: ProgressBarProps) {
    const progressValue = (current / max) * 100;
    const progressText = `${current} / ${max}`;

    const overrideAriaAttributes = useCallback((node: HTMLDivElement) => {
        if(!node) return;
        const progressBarElement = node.querySelector("[role='progressbar']");
        if(!progressBarElement) return;

        progressBarElement.setAttribute('aria-valuemin', `0`);
        progressBarElement.setAttribute('aria-valuemax', `${max}`);
        progressBarElement.setAttribute('aria-valuenow', `${current}`);
        progressBarElement.setAttribute('aria-valuetext', progressText);
        return;
    }, [current, max, progressText]);

    return (
        <Box style={{ position: 'relative', ...boxStyle}}>
            <Progress
                value={progressValue}
                size='1lh'
                transitionDuration={200}
                aria-valuetext={progressText}
                ref={overrideAriaAttributes} />
            <Text 
                size='md'
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                    zIndex: 1
                }}
                role='presentation'>
                    {progressText}
            </Text>
        </Box>
    );
}

interface ProgressBarProps {
    current: number;
    max: number;
    boxStyle: MantineStyleProp;
}