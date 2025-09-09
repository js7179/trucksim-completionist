import { useAuth } from '@/hooks/useAuth';
import { Link } from "react-router";
import { Avatar, BackgroundImage, Button, Center, Flex, Group, Menu, Overlay, Space, Stack, Text, Title } from '@mantine/core';
import { IconLogout } from '@/components/util/Icons';
import HomepageFeatures from '@/components/HomepageFeatures';

export default function Home() {
    return (
        <div>
            <BackgroundImage 
                src='/assets/backgrounds/ets_0001.jpg' 
                pos='absolute' top='0' left='0' 
                w='100%' h='100%'>
                    <Overlay zIndex={2} gradient='linear-gradient(180deg,rgba(36, 36, 36, 0.75) 0%, rgba(36, 36, 36, 1) 95%)' />
            </BackgroundImage>
            <Stack pos='absolute' top='0' left='0' w='100%' style={{zIndex: 10}}>
                <Flex justify='flex-end' mb='33vh' mt='sm' mr='xl'>
                    <HomePageUserInfo />
                </Flex>
                <Title order={1} ta='center' size={'3rem'}>
                    Trucksim Completionist
                </Title>
                <Text ta='center'>
                    Your one-stop shop to tracking and completing achievements for <Text span fs='italic' inherit>Euro Truck Simulator 2</Text> and <Text span fs='italic' inherit>American Truck Simulator</Text>
                </Text>
                <Group justify='center'>
                    <HomePageGameButtons />
                </Group>
                <Space h='256' />
                <Center w='100%'>
                    <HomepageFeatures />
                </Center>
            </Stack>
        </div>

    );
}


export function HomePageGameButtons() {
    const { session } = useAuth();
    let ets2_link: string = '/ets2';
    let ats_link: string = '/ats';

    if(session !== null) {
        const uid = session.user.id;
        ets2_link = `/${uid}/ets2`;
        ats_link = `/${uid}/ats`;
    }

    return (
        <>
            <Button component={Link} to={ets2_link}>Track Euro Truck Simulator 2</Button>
            <Button component={Link} to={ats_link}>Track American Truck Simulator</Button>
        </>
    );
}

export function HomePageUserInfo() {
    const { session } = useAuth();

    if(session === null) {
        return (
            <Group align='center' justify='center'>
                <Button component={Link} to={'/login'}>Login</Button>
                <Button component={Link} to={'/signup'}>Sign Up</Button>
            </Group>
        );
    } else {
        return (
            <Group gap='xs' align='center' justify='center'>
                <Menu>
                    <Menu.Target>
                        <Group style={{cursor: 'pointer'}}>
                            <Avatar src={null} radius='xl' />
                            <Text>{session.user.user_metadata.displayName ?? session.user.email}</Text>
                        </Group>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item 
                            leftSection={<IconLogout width='24' height='24' />}
                            component={Link} to='/signout'>
                                Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        );
    }

}