import { Typography, Button, Row, Col, Statistic, Card, Empty, Input, Table, Skeleton, Tag, Spin, Tooltip } from "antd"
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import Dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { useTheme } from "../hooks/usetheme";
import { Project, Script, User } from "../types/types";

const ReactJSON = Dynamic(() => import("react-json-view"), {
    loading: () => <Spin />,
    ssr: false
});

const { Title, Text } = Typography;

const Userbase = ({ project }: { project: Project }) => {
    const { data: session, status } = useSession();
    const user = session?.user

    const [userInfoCopy, setUserInfoCopy] = useState<User>();
    const [userInfo, setUserInfo] = useState<User>();

    const displayUser = (user: User) => {
        setUserInfo(user);
        setUserInfoCopy(user);
    }

    const columns: ColumnsType<User> = [
        {
            title: "Identifier",
            dataIndex: "Identifier",
            defaultSortOrder: "descend",
            key: "user",
            width: 100
        },
        {
            title: "User ID",
            dataIndex: "id",
            key: "userID",
            width: 100,
            ellipsis: {
                showTitle: false
            },
            render: (uid) => <Tooltip placement="bottomLeft" title={uid}>{uid}</Tooltip>
        },
        {
            title: "Exploit",
            dataIndex: "Exploit",
            key: "exploit"
        },
        {
            title: "HWID",
            dataIndex: "HWID",
            key: "hwid",
            ellipsis: {
                showTitle: false
            },
            render: (hwid) => <Tooltip placement="bottomLeft" title={hwid}>{hwid}</Tooltip>
        },
        {
            title: "Status",
            dataIndex: "Whitelisted",
            key: "status",
            render: (_: any, user) => (
                <Tag color={user.Whitelisted ? "success" : "error"}>{user.Whitelisted ? "Whitelisted" : "Blacklisted"}</Tag>
            )
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, user: any) => (
                <Button type="primary" onClick={() => displayUser(user)}>View User</Button>
            )
        }
    ]

    const textResponsive = {
        xs: 8,
        sm: 5,
        md: 5,
        lg: 4,
        xl: 4
    };
    const dataResponsive = {
        span: 12
    };
    const [lightMode] = useTheme();

    const [scriptInfo, setScriptInfo] = useState<Script>();
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setUsersLoading(true);
        fetch(`https://luashield.com/api/projects/${project.id}/users`, {
            headers: {
                "LuaShield-API-Key": user?.APIKey as string
            }
        }).then(res => res.json())
        .then((users: User[]) => {
            setUsersLoading(false);
            users.forEach((user, index) => {
                user.key = index
            })
            setUsers(users);
        })
        .catch(() => {
            setUsersLoading(false);
        });

    }, []);

    return <>
        <Row style={{ marginTop: 25 }}>
            <Col span={24}>
                <Card>
                    <Skeleton loading={usersLoading} active>
                        <Row>
                            <Col span={3}>
                                <Input.Search placeholder="search" />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }} gutter={5}>
                            <Col {...dataResponsive}>
                                <Table size="middle" pagination={{ position: ["bottomCenter"], showQuickJumper: true, defaultPageSize: 5, pageSizeOptions: ["5", "7", "10", "15"] }} columns={columns} dataSource={users} expandable={{ expandedRowRender: (user) => (<Text code>{JSON.stringify(user)}</Text>) }} />
                            </Col>
                            <Col {...dataResponsive}>
                                {userInfo ? <Card style={{ height: "100%" }}>
                                    <Row>
                                        <Col span={6}>
                                            <Title level={4}>User</Title>
                                            <Col><Text copyable>{userInfo.HWID}</Text></Col>
                                        </Col>
                                        {/* <Col span={6}>
                                        <Title level={4}>User ID</Title>
                                        <Col><Text copyable>{userInfo["User ID"]}</Text></Col>
                                    </Col> */}
                                        {/* <Col span={6}>
                                        <Title level={4}>Status</Title> 
                                        <Col><Tag color={userInfo.Whitelisted ? "success" : "error"}>{userInfo.Whitelisted ? "Whitelisted" : "Blacklisted"}</Tag></Col>
                                    </Col> */}
                                        <Col span={6}>
                                            <Title level={4}>Executions</Title>
                                            <Col><Text>{userInfo.Executions}</Text></Col>
                                        </Col>
                                        <Col span={6}>
                                            <Title level={4}>Exploit</Title>
                                            <Col><Text>{userInfo.Exploit ?? "?"}</Text></Col>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 15 }}>
                                        <Col>
                                            <Col>
                                                <Title level={4}>Crack Attempts</Title>
                                                <Col><Text type="danger">{userInfo["Crack Attempts"]}</Text></Col>
                                            </Col>
                                            <Col>
                                                <Title level={4}>HWID</Title>
                                                <Col>
                                                    <Text>{userInfo.HWID}</Text>
                                                </Col>
                                            </Col>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 25 }}>
                                        <Col>
                                            <Title level={4}>Database Info</Title>
                                            <Col>
                                                <ReactJSON src={userInfoCopy as User} name={false} displayDataTypes={false} collapseStringsAfterLength={60} theme={lightMode ? "apathy:inverted" : "twilight"} style={{ padding: "10px", borderRadius: "4px" }} />
                                            </Col>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: 25 }} gutter={10}>
                                        <Col>
                                            <Button danger>Blacklist</Button>
                                        </Col>
                                        <Col>
                                            <Button danger>Reset HWID</Button>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }} gutter={10}>
                                        <Col>
                                            <Button>Generate Key</Button>
                                        </Col>
                                    </Row>
                                </Card> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                            </Col>
                        </Row>
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    </>
}

export default Userbase;