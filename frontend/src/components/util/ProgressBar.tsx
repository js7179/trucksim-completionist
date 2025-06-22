import { Box, MantineStyleProp, Progress, Text } from "@mantine/core";

export function ProgressBar({current, max, boxStyle}: ProgressBarProps) {
    const progressValue = (current / max) * 100;
    const progressText = `${current} / ${max}`;

    return (
        <Box style={{ position: 'relative', ...boxStyle}}>
            <Progress
                value={progressValue}
                size='1lh'
                transitionDuration={200}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={current}
                aria-valuetext={progressText} />
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