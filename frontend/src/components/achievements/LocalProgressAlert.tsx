import { Alert, Flex, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "../util/Icons";
import { Link } from "react-router";

export default function LocalProgressAlert({ gameName }: LocalProgressAlertProps) {
    return (
        <Alert color='yellow' variant='light' mt='lg' mb='xl'>
            <Flex gap='xl' align='center' wrap='nowrap'>
                <IconAlertTriangle height='5rem' />
                <Stack>
                    <Text>You are saving your <Text span fw={700}>{gameName}</Text> achievement progress in a local copy. You may lose your progress at any time for any reason.</Text>
                    <Text>To make sure you do not lose your progress, consider <Link to='/login'>logging in</Link> or <Link to='/signup'>registering for an account</Link>. Otherwise, proceed at your own risk.</Text>
                </Stack>
            </Flex>
        </Alert>
    );
}

type LocalProgressAlertProps = {
    gameName: string;
}