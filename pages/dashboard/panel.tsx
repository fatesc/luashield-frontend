import { Typography, Row, Col, Statistic, Select, Button, Modal, Switch, Form, Skeleton, Input, Tooltip, Upload, Card, Progress, Tag, message, theme } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { FormItemProps } from "antd";
import type { UploadProps } from "antd";

import dynamic from "next/dynamic";
import ProjectCard from "../../components/projectcard";
import { Project } from "../../types/types";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { useToken } = theme;


const Panel = () => {
    const { data: session, status } = useSession();
    const user = session?.user

    const textResponsive = {
        xs: 8,
        sm: 5,
        md: 5,
        lg: 4,
        xl: 4
    };

    const webhookDummy = "https://discord.com/api/webhooks/1069201590512254997/JLGDxwFsgGoTXZAB7G3izf8l-xLH6qJfpXeoly9F-kb_ASLZqVvJfhQUXfIuptIGXORp"
    const dummyProject: Project = {
        id: "1",
        Name: "fates admin",
        SuccessWebhook: webhookDummy,
        BlacklistWebhook: webhookDummy,
        UnauthorizedWebhook: webhookDummy,
        Owner: "fate",

        Online: true,

        Executions: 0,
        CrackAttempts: 0,
        Users: 0,
        SynapseX: false,
        ScriptWare: false,
        SynapseV3: false
    }


    const { token } = useToken();

    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [validFile, setValidFile] = useState(false);
    const [fileContents, setFileContents] = useState("");
    const [managing, setManaging] = useState(false);

    const [projectInfo, setProjectInfo] = useState(dummyProject);

    const checkModal = async () => {
        form.validateFields(["Name", "SuccessWebhook", "BlacklistWebhook", "UnauthorizedWebhook", "Exploit"])
            .then((values) => {
                setModalOpen(false);
                setConfirmModalOpen(true);
                if (!managing) {
                    const newProject = { ...dummyProject };
                    newProject.Owner = user.Username

                    for (const exploit of values.Exploit) {
                        newProject[exploit] = true
                    }
                    for (const [i, v] of Object.entries(values)) {
                        if (i != "Exploit") {
                            newProject[i] = v
                        }
                    }

                    setProjectInfo(newProject);

                }
            })
            .catch((errorInfo) => {

            });
    }

    const formValues: FormItemProps = {
        rules: [
            { required: true, message: "Input a discord webhook" },
            { type: "url", message: "enter a valid url" },
            { pattern: /https:\/\/discord.com\/api\/webhooks\/(\d+)\/.+/, message: "enter a valid discord webhook" }
        ],
        hasFeedback: true
    }


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
    ]

    const setFields = () => {
        for (const formInput of webhookInputs) {
            const { name } = formInput
            form.setFieldValue(name, projectInfo[name]);
        }
        form.setFieldValue("Name", projectInfo.Name);
    }

    const validFiles = ["lua", "luau", "txt"]

    const uploadProps: UploadProps = {
        name: "file",
        maxCount: 1,
        beforeUpload: async (file) => {
            const fileName = file.name
            const validFile = validFiles.includes(fileName.split(".").pop()?.toLocaleLowerCase() ?? "");
            if (!validFile) {
                message.error(`\`${fileName}\` is not a valid file, make sure to upload a file with either one of these extentions: ${validFiles.join(", ")}`)
            } else {
                setValidFile(true);
                const buffer = await file.arrayBuffer();
                setFileContents(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
            }
            return validFile || Upload.LIST_IGNORE;
        }
    }

    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(false);

    const submitProject = () => {
        message.loading("Creating Project...");
        fetch("https://api.luashield.com/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LuaShield-API-Key": user?.APIKey as string
            },
            body: JSON.stringify({
                name: projectInfo.Name,
                success_webhook: projectInfo.SuccessWebhook,
                blacklist_webhook: projectInfo.BlacklistWebhook,
                unauthorized_webhook: projectInfo.UnauthorizedWebhook,
                allowed_exploits: {
                    synapse_x: projectInfo.SynapseX,
                    synapse_v3: projectInfo.SynapseV3,
                    script_ware: projectInfo.ScriptWare
                }
            })
        })
            .then(res => res.json())
            .then(project => {
                message.success("Project Created!");
                projects.push(project);
                setConfirmModalOpen(false);
            });
    }

    useEffect(() => {
        if (!user) {
            return;
        }
        setProjectsLoading(true);
        fetch("https://api.luashield.com/projects", {
            headers: {
                "LuaShield-API-Key": user?.APIKey as string
            }
        }).then(res => res.json())
            .then(projects => {
                setProjectsLoading(false);
                setProjects(projects);
            })
            .catch(() => setProjectsLoading(false));
    }, [status]);

    if (status == "loading") {
        return <Skeleton active />
    }

    return <>
        <Title>Welcome, <div style={{ color: token.colorPrimary }}>{user?.Username}</div></Title>
        <Row gutter={1}>
            <Col {...textResponsive}>
                <Statistic title="Active Users" value={1} />
            </Col>
            <Col {...textResponsive}>
                <Statistic title="Users" value={projectInfo?.Users} />
            </Col>
            <Col {...textResponsive}>
                <Statistic title="Crack Attempts" value={projectInfo?.CrackAttempts} />
            </Col>
        </Row>
        <Row>
            <Col {...textResponsive}>
                <Statistic title="Execution Count" value={projectInfo?.Executions} />
            </Col>
        </Row>
        <Row style={{ marginTop: 15 }}>
            <Col>
                <Title level={3}>Projects</Title>
                <Col><Button onClick={() => { setModalOpen(true); form.resetFields(); }}>Create Project</Button></Col>
            </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
            <Skeleton active={true} loading={projectsLoading}>
                <Card style={{ minWidth: "100%" }}>
                    <Title level={3}>Projects ({user.Subscription.Projects})</Title>

                    <Row gutter={15}>
                        {projects.map((project, i) => <Col key={i}>
                            <ProjectCard project={project} onManage={() => { setModalOpen(true); setProjectInfo(project); setFields(); setManaging(true); }} />
                        </Col>)}
                    </Row>
                </Card>
            </Skeleton>
        </Row>

        <Modal title={managing ? "Manage Project" : "Create Project"} open={modalOpen} onCancel={() => { setModalOpen(false); setManaging(false); }} onOk={() => checkModal()} centered>
            <Row>
                <Form form={form} style={{ minWidth: "100%" }} labelCol={{ span: 9 }} autoComplete="off" colon={false}>
                    <Form.Item label="Project Name" name="Name" rules={[{ required: true, message: "Input a Project Name" }, { min: 5, message: "Project Name must exceed 5 characters" }]} hasFeedback>
                        <Input placeholder="name" name="Name" />
                    </Form.Item>
                    {webhookInputs.map((v, i) => <Form.Item key={i} label={v.label} name={v.name} {...formValues}>
                        <Input placeholder="webhook" name={v.name} suffix={<Tooltip title="Discord Webhook"><InfoCircleOutlined /></Tooltip>} />
                    </Form.Item>)}
                    <Form.Item label="Exploit" name="Exploit" rules={[{ required: true, message: "Choose an exploit/s to allow" }]}>
                        <Select placeholder="choose an exploit/s for the project to support" mode="multiple" allowClear>
                            <Option value="SynapseX">Synapse X</Option>
                            <Option value="SynapseV3">Synapse X V3</Option>
                            <Option value="ScriptWare">ScriptWare</Option>
                        </Select>
                    </Form.Item>

                    {managing ? <Form.Item label="Project Online">
                        <Switch checked={projectInfo.Online} onChange={(checked) => { projectInfo.Online = checked }} />
                    </Form.Item> : <>
                        {/* <Form.Item label="Script Contents">
                            <Upload {...uploadProps}>
                                <Button>Upload Script</Button>
                            </Upload>
                        </Form.Item> */}
                        <Form.Item label="Fields">
                            <Button type="primary" onClick={() => form.resetFields()}>Clear</Button>
                        </Form.Item>
                    </>}

                </Form>
            </Row>
        </Modal>

        <Modal title={managing ? "Confirm Changes" : "Confirm Values"} open={confirmModalOpen} onCancel={() => { setConfirmModalOpen(false); setModalOpen(true); }} onOk={submitProject} okText="Create Project" centered>
            <Row>
                <Col>
                    <Title level={5}>Project Name: <Text type="secondary">{projectInfo.Name}</Text></Title>
                    <Title level={5}>Success Webhook: <Text type="secondary">{projectInfo.SuccessWebhook}</Text></Title>
                    <Title level={5}>Unauthorized Webhook: <Text type="secondary">{projectInfo.UnauthorizedWebhook}</Text></Title>
                    <Title level={5}>Blacklist Webhook: <Text type="secondary">{projectInfo.BlacklistWebhook}</Text></Title>
                    <Title level={5}>Blacklist Webhook: <Text type="secondary">{projectInfo.BlacklistWebhook}</Text></Title>
                    <Title level={5}>Supported Exploits: <Text type="secondary">{
                        [
                            projectInfo.ScriptWare && "ScriptWare",
                            projectInfo.SynapseV3 && "Synapse V3",
                            projectInfo.SynapseX && "Synapse X",
                        ].filter(Boolean).join(", ")
                    }</Text></Title>
                </Col>
            </Row>
        </Modal>
    </>
}

export default Panel;