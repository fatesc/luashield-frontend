import { Typography, Avatar, Space, Card, Row, Col, Tag, Input, Skeleton } from "antd";
import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

const { Title, Text } = Typography;

const Profile = () => {
    const [ disabled, setDisabled ] = useState(false);
    const { data: session, status } = useSession();

    const user = session?.user
    const expired = Date.now() > user?.Subscription.Expire

    return <>
        <Title>Profile Management</Title>
        <Skeleton loading={status=="loading"}>
            <Space size={40}>
                <Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} icon={<UserOutlined />} />
                <div>
                    <Row>
                        <Space size={20}>
                            <Col>
                                <Title level={5}>Email</Title>
                                <Col><Text>{user?.Email}</Text></Col>
                            </Col>
                            <Col>
                                <Title level={5}>Subscription</Title>
                                <Col><Tag color={expired ? "error" : "success"}>{expired ? "Inactive" : "Active"}</Tag></Col>
                            </Col>
                            <Col>
                                <Title level={5}>Expiry Date</Title>
                                <Col><Text>{new Date(user?.Subscription.Expire).toDateString()}</Text></Col>
                            </Col>
                        </Space>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Space size={45}>
                            <Col>
                                <Title level={5}>Username</Title>
                                <Col><Text>{user?.Username}</Text></Col>
                            </Col>
                            <Col>
                                <Title level={5}>Subscription ID</Title>
                                <Col><Text>{user?.SubscriptionID}</Text></Col>
                            </Col>
                            <Col>
                                <Title level={5}>Projects</Title>
                                <Col><Text>{user?.Subscription.Projects}</Text></Col>
                            </Col>
                        </Space>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Space size={45}>
                            <Col>
                                <Title level={5}>API Key</Title>
                                <Col><Text>{user?.APIKey}</Text></Col>
                            </Col>
                        </Space>
                    </Row>
                </div>
            </Space>
        </Skeleton>
    </>
}

export default Profile;