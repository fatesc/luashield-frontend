import { useRouter } from "next/router";
import { Typography, Skeleton, Form, Row, Col, Button, Card, Input, Switch, Select, Tooltip, FormItemProps } from "antd";
import { FundProjectionScreenOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Project } from "../../types/types";
import { useSession } from "next-auth/react";

const { Text, Title } = Typography
const { Option } = Select

const Project = () => {
    const { data: session, status } = useSession();
    const user = session?.user

    const router = useRouter();
    const { id } = router.query
    const [form] = Form.useForm();

    const projectID = router.query.id
    const [project, setProject] = useState<Project>();

    const webhookInputs = [
        {
            label: "Success Webhook",
            name: "SuccessWebhook"
        },
        {
            label: "Unauthorized Webhook",
            name: "UnauthorizedWebhook"
        },
        {
            label: "Blacklist Webhook",
            name: "BlacklistWebhook"
        }
    ];
    const webhookRules: FormItemProps = {
        rules: [
            { required: true, message: "Input a discord webhook" },
            { type: "url", message: "enter a valid url" },
            { pattern: /https:\/\/discord.com\/api\/webhooks\/(\d+)\/.+/, message: "enter a valid discord webhook" }
        ],
        hasFeedback: true
    };

    const [currentExploits, setCurrentExploits] = useState<string[]>([]);

    useEffect(() => {
        if (!user || !router.query || project) {
            return
        }

        console.log(user, id);
        fetch("https://luashield.com/api/projects/" + id, {
            method: "GET",
            headers: {
                "LuaShield-API-Key": user?.APIKey as string
            }
        })
            .then(res => res.json())
            .then((project: Project) => {
                setProject(project);
                form.setFieldValue("Name", project.Name);
                form.setFieldValue("SuccessWebhook", project.SuccessWebhook);
                form.setFieldValue("UnauthorizedWebhook", project.UnauthorizedWebhook);
                form.setFieldValue("BlacklistWebhook", project.BlacklistWebhook);
                

            });

    }, [user, router.query]);

    if (status == "loading") {
        return <Skeleton active />
    }

    return (
        <div>
            <Title>Project {project?.Name}</Title>
            <Row style={{ marginTop: 15 }}>
                <Col>
                    <Title level={3}>Manage Project</Title>
                </Col>
            </Row>
            <Row style={{ marginTop: 15 }}>
                <Col>
                    <Card style={{ minWidth: "100%" }}>
                        <Form form={form} style={{ minWidth: "100%" }} labelCol={{ span: 9 }} autoComplete="off" colon={false} labelAlign="left">
                            <Form.Item label="Project Name" name="Name" rules={[{ required: true, message: "Input a Project Name" }, { min: 5, message: "Project Name must exceed 5 characters" }]} hasFeedback>
                                <Input placeholder="name" name="Name"/>
                            </Form.Item>
                            {webhookInputs.map((v, i) => <Form.Item key={i} label={v.label} name={v.name} {...webhookRules}>
                                <Input placeholder="webhook" name={v.name} suffix={<Tooltip title="Discord Webhook"><InfoCircleOutlined /></Tooltip>} />
                            </Form.Item>)}
                            <Form.Item label="Exploit" name="Exploit" rules={[{ required: true, message: "Choose an exploit/s to allow" }]}>
                                <Select placeholder="choose an exploit/s for the project to support" mode="multiple" allowClear>
                                    <Option value="SynapseX">Synapse X</Option>
                                    <Option value="SynapseV3">Synapse X V3</Option>
                                    <Option value="ScriptWare">ScriptWare</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Project Online">
                                <Switch checked={project?.Online} onChange={(checked) => { project.Online = checked }} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
                                <Button type="primary" onClick={() => form.resetFields()}>Reset</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Project;