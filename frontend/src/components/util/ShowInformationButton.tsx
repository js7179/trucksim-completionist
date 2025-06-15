import { ActionIcon } from "@mantine/core";
import { IconChevronUp } from "@/components/util/Icons";
import React from "react";

export default function ShowInformationButton({id, name, isToggled, onClick}: ShowInformationButtonProps) {
    const additionalStyles: React.CSSProperties = isToggled ? { transform: `rotate(180deg)` } : { transform: `rotate(0deg)` };
    return (
        <ActionIcon 
            variant='transparent'
            id={`${id}.showMore`}
            size='48' 
            aria-label={`Expand ${name}`} 
            onClick={onClick}
        >
            <IconChevronUp 
                width='48'
                height='48'
                stroke='2' 
                color='var(--mantine-primary-color-8)' 
                style={{ transition: '0.125s ease', ...additionalStyles }}/>
        </ActionIcon>
    );
}

interface ShowInformationButtonProps {
    id: string;
    name: string;
    isToggled: boolean;
    onClick: React.ComponentProps<'button'>['onClick'];
}