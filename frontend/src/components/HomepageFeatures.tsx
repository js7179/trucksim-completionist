import { Card, SimpleGrid, Flex, Text } from "@mantine/core";
import { IconCheckupList, IconCloud, IconInfoCircle, IconPlugConnectedX } from "./util/Icons";

const FEATURE_CARDS = [
    {
        id: 'steps',
        icon: IconCheckupList,
        text: 'Every achievement is outlined with clear, defined steps to assist you towards achieving them.'
    },
    {
        id: 'remote',
        icon: IconCloud,
        text: 'Keep track of your progress across multiple devices using a registered account, eliminating the need for spreadsheets or documents.'

    },
    {
        id: 'tips',
        icon: IconInfoCircle,
        text: 'Leverage helpful tips to accelerate the completion of achievements and eliminate unnecessary guesswork.'

    },
    {
        id: 'offlinemode',
        icon: IconPlugConnectedX,
        text: 'Prefer to not sign up for an account? No worries, with offline mode, you can still enjoy the assistance this app provides!'
    }
];


export default function HomepageFeatures() {
    const cardsJSX = FEATURE_CARDS.map((card) => {
        return (
            <Card key={card.id}>
                <Flex gap='xl' justify='flex-start' align='center'>
                    <div style={{ width: '64px', height: '64px', flexShrink: 0 }}>
                        <card.icon color='white' width='100%' height='100%' />
                    </div>
                    <Text>{card.text}</Text>
                </Flex>
            </Card>
        );
    });

    return (
        <SimpleGrid cols={2} w='50%'>
            {...cardsJSX}
        </SimpleGrid>
    );
}