import { Form, Row, Col, Typography, Card, Input, Checkbox, Button } from "antd";
import { useState } from "react";
import Link from "next/link";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/router";

const { Title, Text } = Typography;

export default function Signup() {
    const [form] = Form.useForm();
    const router = useRouter();

    const createUser = async (values: any) => {
        const { email, password, username, sub_id } = values as { email: string, password: string, username: string, sub_id: string };
        fetch("https://api.luashield.com/signup", {
            method: "POST",
            body: JSON.stringify({ email, password, username, subscription_id: sub_id }),
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(async json => {
                const result = await signIn("email-password", {
                    email, password,
                    redirect: false
                }) as SignInResponse;

                if (result.ok) {
                    router.push((router.query.callbackUrl as string | undefined) ?? "/account/profile");
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
                    <Form form={form} name="loginForm" onFinish={createUser}  layout="horizontal" labelAlign="left" autoComplete="off" colon={false} >
                        <Form.Item rules={[{ required: true, message: "a username is required" }]} name="username" label="Username">
                            <Input placeholder="username" />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: "an email is required" }, { type: "email", message: "invalid email" }]} name="email" label="Email Address">
                            <Input placeholder="email@example.com" type="email" />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: "input your password" }]} name="password" label="Password" hasFeedback>
                            <Input.Password />
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
                            <Input.Password />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: "a subscription id is required" }]} label="Subscription ID" name="sub_id">
                            <Input placeholder="subscription id"/>
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
