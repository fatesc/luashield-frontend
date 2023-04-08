import { Form, Row, Col, Typography, Card, Input, Checkbox, Button, message } from "antd";
import { useState } from "react";
import Link from "next/link";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/router";
import { UserOutlined, LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Signup() {
    const [form] = Form.useForm();
    const router = useRouter();

    const createUser = async (values: any) => {
        const { email, password, username, sub_key } = values as { email: string, password: string, username: string, sub_key: string };
        fetch("https://api.luashield.com/signup", {
            method: "POST",
            body: JSON.stringify({ email, password, username, subscription_id: sub_key }),
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(async json => {
                if (json.error) {
                    return message.error(json.error);
                }
                // console.log(json);
                const result = await signIn("username-password", {
                    username, password,
                    redirect: false
                }) as SignInResponse;

                if (result.ok) {
                    message.loading("Signed up! redirecting..")
                    router.push((router.query.callbackUrl as string | undefined) ?? "/account/profile");
                } else {
                    message.error(result.error);
                }
            })
            .catch(err => {
                console.log(err);
            })

    }

    return <>
        <Row justify="center">
            <Col span={8}>
                <Card>
                    <Title level={3}>Sign up!</Title>
                    <Form form={form} name="loginForm" onFinish={createUser} layout="horizontal" labelAlign="left" autoComplete="off" colon={false} labelCol={{ span: 7 }}>
                        <Form.Item rules={[{ required: true, message: "a username is required" },
                        ({ getFieldValue }) => ({
                            validator: (_, value) => {
                                if (value.match(/[^A-z 0-9]/)) {
                                    return Promise.reject(new Error("Your username cannot include special characters"));
                                }
                                return Promise.resolve();
                            }
                        }), { min: 3, message: "username must be longer than 3 characters" }]} name="username" label="Username">
                            <Input placeholder="username" prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: "an email is required" }, { type: "email", message: "invalid email" }]} name="email" label="Email Address">
                            <Input placeholder="email@example.com" type="email" prefix={<MailOutlined />} />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: "input your password" },
                        ({ getFieldValue }) => ({
                            validator: (_, value) => {
                                if (!value.match(/[A-Z]+/)) {
                                    return Promise.reject(new Error("Your password must include at least one uppercase letter"));
                                }
                                return Promise.resolve();
                            }
                        })
                        ]} name="password" label="Password" hasFeedback>
                            <Input.Password placeholder="password" prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: "input your password" },
                        ({ getFieldValue }) => ({
                            validator: (_, value) => {
                                if (!value || getFieldValue("password") == value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("The two passwords do not match"));
                            }
                        })
                        ]} name="confirm" label="Confirm password" hasFeedback>
                            <Input.Password placeholder="confirm password" prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: "a subscription key is required" }]} label="Subscription Key" name="sub_key">
                            <Input placeholder="subscription key" prefix={<KeyOutlined />} />
                        </Form.Item>
                        <Form.Item name="tos" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject("Agree to the LuaShield TOS") }]}>
                            <Checkbox>
                                I have agreed to the <Link href="/tos">Luashield TOS</Link>.
                            </Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button style={{ width: "100%" }} type="primary" htmlType="submit">Sign up</Button>
                            <Text>Already have an account? <Link href="/auth/login">Login</Link>.</Text>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    </>
}
