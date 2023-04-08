import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Typography, Row, Col, Card, Button, Checkbox, Form, Input, message } from "antd";
import { getProviders, signIn, SignInResponse } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const { Title, Text } = Typography

interface loginValues {
    username: string;
    password: string;
    rememberme: boolean;
}

export default function Login() {
    const router = useRouter();
    const [form] = Form.useForm();

    const logIn = async () => {
        form.validateFields(["username", "password"])
            .then(async (values: loginValues) => {
                const result = await signIn("username-password", {
                    username: values.username,
                    password: values.password,
                    redirect: false
                }) as SignInResponse;
                if (result.ok) {
                    message.loading("Logged in! Redirecting...");
                    router.push((router.query.callbackUrl as string | undefined) ?? "/account/profile");
                } else {
                    message.error(result.error);
                }
            })
            .catch((errorInfo) => {

            });
    }

    return <>
        <Row justify="center">
            <Col span={8}>
                <Card>
                    <Title level={3}>Login!</Title>
                    <Form form={form} name="loginForm" onFinish={logIn} initialValues={{ remember: true }}>
                        <Form.Item rules={[{ required: true, message: "a username is required" }]} name="username">
                            <Input placeholder="username" prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: "input your password" }]}>
                            <Input.Password placeholder="password" prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item noStyle name="remember" valuePropName="checked">
                                <Checkbox>Remember me?</Checkbox>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item>
                            <Button style={{ width: "100%" }} type="primary" htmlType="submit">Log in</Button>
                            <Text>Or <Link href="/auth/signup">Sign up</Link>.</Text>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    </>
}