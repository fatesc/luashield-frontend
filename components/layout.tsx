import { OriginProps } from "next/document"
import Dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useState, cloneElement } from "react";
import { Button, MenuProps, Space, ConfigProvider, Menu, Divider, Select, FloatButton, Typography, Dropdown, Avatar, theme, Layout as PageLayout } from "antd";
import { LayoutOutlined, HomeOutlined, QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";

import { useTheme } from "../hooks/usetheme";
import LightTheme from "../themes/light";
import DarkTheme from "../themes/dark";
import Moon from "./icons/Moon.svg";
import Sun from "./icons/Sun.svg";


import type { ItemType } from "antd/es/menu/hooks/useItems";
import { Buyer } from "../types/types";
import Link from "next/link";
const { Header, Content, Sider } = PageLayout;
const { Title, Text } = Typography;

const mainItems: ItemType[] = [
    {
        key: "",
        label: "Home",
        icon: <HomeOutlined />
    }
];

const items: ItemType[] = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutOutlined />,
        children: [
            {
                key: "panel",
                label: "Panel"
            }
        ]
    },
    {
        key: "account",
        label: "Account",
        icon: <UserOutlined />,
        children: [
            {
                key: "profile",
                label: "Profile"
            },
            {
                key: "api",
                label: "API"
            }
        ]
    }
];

function Layout({ children }: OriginProps) {
    const router = useRouter();
    const [ lightMode, useLightMode ] = useTheme();
    const theme: any = lightMode ? LightTheme : DarkTheme
    const { token } = theme

    const { data: session, status } = useSession();

    const user = session?.user

    const toggleLightMode = () => useLightMode(!lightMode);

    const menuClick: MenuProps['onClick'] = e => {
        const keyPath = e.keyPath
        router.push("/" + keyPath.reverse().join("/"));
    }

    const [popOpen, setPopOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const login = () => router.push("/auth/login");
    const logOut = async () => {
        setLoggingOut(true);
        await signOut({ callbackUrl: "/" });
        setLoggingOut(false);
    };
    const handlePopCancel = () => {
        setPopOpen(false);
    }

    const selectedKeys = router.route.split("/");
    selectedKeys.shift();

    const profileItems: ItemType[] = [
        {
            key: "name",
            label: <Link href="/account/profile">Signed in as <b>{user?.Username}</b></Link>
        },
        {
            key: "projects",
            label: <Link href="/dashboard/panel">Your Projects</Link>
        },
        {
            key: "sign",
            label: <Text onClick={logOut}>Sign out</Text>
        }
    ];

    const contentStyle = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    return <>
        <Head>
            <title>Luashield - #1 whitelisting service</title>
            <link rel="icon" href="/cover.png" />
        </Head>

        <PageLayout style={{ minHeight: "100vh" }}>
            <ConfigProvider theme={theme}>
                <Header className="header" style={{ background: theme.token.colorBgContainer }}>
                    <Space align="center" className="leftHeader">
                        {/* <Image src="/cover.png" alt="logo" height={30} width={30} /> */}
                        <Title level={3}>LuaShield Beta</Title>
                    </Space>
                    <Space align="center" className="rightHeader">
                        {user ? <Dropdown placement="bottomLeft" arrow={{ pointAtCenter: true }} menu={{ items: profileItems }} >
                            <Avatar className="avatar" icon={<UserOutlined />} />
                        </Dropdown>
                        : <Button type="primary" onClick={login}>Log in</Button>}
                    </Space>
                </Header>
                <PageLayout hasSider>
                    <Sider width={200} breakpoint="md">
                        <Menu mode="inline" style={{ height: "100%", borderRight: 0 }} selectedKeys={selectedKeys} items={user ? [...mainItems, ...items] : mainItems} onClick={menuClick} />
                    </Sider>
                    <PageLayout style={{ padding: "0 24px 24px" }}>
                        <Content style={{ padding: 24, margin: 0 }}>
                            <main>{children}</main>
                        </Content>
                        <FloatButton onClick={toggleLightMode} icon={lightMode ? <Sun /> : <Moon />} />
                    </PageLayout>
                </PageLayout>
            </ConfigProvider>
        </PageLayout>
    </>
}

export default Dynamic(() => Promise.resolve(Layout), { ssr: false });