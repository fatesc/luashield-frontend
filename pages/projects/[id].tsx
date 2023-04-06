import { useRouter } from "next/router";
import { UploadProps, Typography, Skeleton, Form, Row, Col, Button, Card, Input, Switch, Select, Tooltip, FormItemProps, Checkbox, Popconfirm, List, Space, Divider, Modal, Upload, message } from "antd";
import { FundProjectionScreenOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Project, Script } from "../../types/types";
import { useSession } from "next-auth/react";
import { deepEqual } from "assert";
import Userbase from "../../components/userbase";
import VirtualList from "rc-virtual-list";

const { Text, Title } = Typography
const { Option } = Select

const Project = () => {
    const { data: session, status } = useSession();
    const user = session?.user

    const router = useRouter();
    const { id } = router.query
    const [form] = Form.useForm();
    const [confirmForm] = Form.useForm();
    const [scriptForm] = Form.useForm();

    const [project, setProject] = useState<Project>();
    const [formEnabled, setFormEnabled] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmingName, setConfirmingName] = useState<string>();
    const [previousValues, setPreviousValues] = useState();
    const [scripts, setScripts] = useState<Script[]>([]);
    const [scriptModalOpen, setScriptModal] = useState(false);
    const [scriptConfirmModalOpen, setScriptConfirmModal] = useState(false);
    const [scriptManaging, setScriptManaging] = useState<boolean | Script>(false);
    const [validScriptFile, setValidScriptFile] = useState(false);
    const [fileContents, setFileContents] = useState<string>();
    const [previousScriptValues, setPreviousScriptValues] = useState();

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

    const deleteProject = async () => {
        message.loading("Deleting project...");
        await fetch("https://api.luashield.com/projects/" + project?.id, {
            method: "DELETE",
            headers: {
                "LuaShield-API-Key": user?.APIKey as string
            }
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    message.success("Project Deleted! redirecting...");
                    router.push("/dashboard/panel");
                }
            });
    }

    const updateProject = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    deepEqual(values, previousValues);
                    return message.info("No project changes made.");
                } catch { }

                message.loading("Updating project...");

                const newProject = { ...project };
                newProject.ScriptWare = false
                newProject.SynapseV3 = false
                newProject.SynapseX = false

                for (const exploit of values.Exploit) {
                    newProject[exploit.replace(/\s+/, "")] = true
                }

                for (const [i, v] of Object.entries(values)) {
                    if (i != "Exploit") {
                        newProject[i] = v
                    }
                }

                await fetch("https://api.luashield.com/projects/" + project?.id, {
                    method: "PATCH",
                    headers: {
                        "LuaShield-API-Key": user?.APIKey as string,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: newProject.Name,
                        success_webhook: newProject.SuccessWebhook,
                        blacklist_webhook: newProject.BlacklistWebhook,
                        unauthorized_webhook: newProject.UnauthorizedWebhook,
                        online: newProject.Online,
                        allowed_exploits: {
                            synapse_x: newProject.SynapseX,
                            synapse_v3: newProject.SynapseV3,
                            script_ware: newProject.ScriptWare
                        }
                    })
                })
                    .then(res => res.json())
                    .then(updatedProject => {
                        setPreviousValues(values);
                        setProject(updatedProject);
                        message.success("Updated Project!");
                    });
            });
    }

    const projectFormValues = (project: Project) => {
        form.setFieldValue("Name", project.Name);
        form.setFieldValue("SuccessWebhook", project.SuccessWebhook);
        form.setFieldValue("UnauthorizedWebhook", project.UnauthorizedWebhook);
        form.setFieldValue("BlacklistWebhook", project.BlacklistWebhook);
        form.setFieldValue("Exploit", [
            project.ScriptWare && "ScriptWare",
            project.SynapseV3 && "Synapse V3",
            project.SynapseX && "Synapse X",
        ].filter(Boolean));
        form.setFieldValue("Online", project.Online);
        form.validateFields()
            .then(values => {
                setPreviousValues(values);
            });
    }

    const dummyScript: Script = {
        id: "1",
        Name: "yoo",
        ProjectID: "1",
        Version: "1",
        Versions: ["1", "2"]
    }

    const [scriptInfo, setScriptInfo] = useState(dummyScript);

    const checkModal = async () => {
        scriptForm.validateFields()
            .then((values) => {
                if (validScriptFile || scriptManaging) {
                    setScriptModal(false);
                    setScriptConfirmModal(true);

                } else {
                    message.error("Please upload a file");
                }
            })
            .catch((errorInfo) => {

            });
    }

    const manageScript = (script: Script) => {
        setScriptManaging(script);
        scriptForm.setFieldValue("Name", script.Name);

        scriptForm.validateFields()
            .then(values => {
                setPreviousScriptValues(values);
            })
        setScriptModal(true);
        console.log(true);
    }

    const updateScript = (script) => {
        scriptForm.validateFields()
            .then(values => {
                try {
                    deepEqual(values, previousScriptValues);
                    return message.info("No project changes made.");
                } catch { }

                message.info("Updating script...");


            });
    }

    const deleteScript = (script) => {
        message.loading("Deleting script...");

        message.success("Deleted script");
    }

    const createScript = () => {
        
    }

    const submitScript = () => {
        console.log(scriptInfo);
    }

    const validFiles = ["txt", "lua", "luau"];
    const uploadProps: UploadProps = {
        name: "file",
        maxCount: 1,
        beforeUpload: async (file) => {
            const fileName = file.name
            const validFile = validFiles.includes(fileName.split(".").pop()?.toLocaleLowerCase() ?? "");
            if (!validFile) {
                message.error(`\`${fileName}\` is not a valid file, make sure to upload a file with either one of these extentions: ${validFiles.join(", ")}`)
            } else {
                setValidScriptFile(true);
                const buffer = await file.arrayBuffer();
                setFileContents(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
            }
            return validFile || Upload.LIST_IGNORE;
        }
    }

    useEffect(() => {
        if (!user || !router.query || project) {
            return
        }

        console.log(user, id);
        fetch("https://api.luashield.com/projects/" + id, {
            method: "GET",
            headers: {
                "LuaShield-API-Key": user?.APIKey as string
            }
        })
            .then(res => res.json())
            .then((project: Project) => {
                setProject(project);
                projectFormValues(project);
                setScripts(project.Scripts);
            })


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
                    <Text copyable>{project?.id}</Text>
                </Col>
            </Row>
            <Row style={{ marginTop: 15 }} gutter={20}>
                <Col>
                    <Card style={{ minWidth: "100%" }}>
                        <Space direction="vertical" size="small" style={{ display: "flex" }} split={<Divider />}>
                            <Form form={form} style={{ minWidth: "100%" }} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout="horizontal" labelAlign="left" autoComplete="off" colon={false} disabled={!formEnabled}>
                                <Form.Item label="Project Name" name="Name" rules={[{ required: true, message: "Input a Project Name" }, { min: 5, message: "Project Name must exceed 5 characters" }]} hasFeedback>
                                    <Input placeholder="name" name="Name" />
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

                                <Form.Item label="Project Online" name="Online" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                                <Form.Item label="Fields">
                                    <Space>
                                        <Button type="primary" onClick={() => projectFormValues(project)}>Reset Fields</Button>
                                        <Popconfirm placement="bottom" title="Clear Fields" description="Are you sure you want to Clear the fields?" onConfirm={() => { form.resetFields(); form.validateFields(); }}>
                                            <Button type="primary">Clear Fields</Button>
                                        </Popconfirm>
                                    </Space>
                                </Form.Item>
                            </Form>
                            <div>
                                <Row>
                                    <Col>
                                        <Checkbox checked={formEnabled} onChange={(e) => setFormEnabled(e.target.checked)}>Edit Project</Checkbox>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 5 }}>
                                    <Col>
                                        <Space>
                                            <Button onClick={updateProject}>Confirm Changes</Button>
                                            <Popconfirm placement="right" title="Delete Project" description="Are you sure you want to delete this project?" onConfirm={() => setConfirmModalOpen(true)}>
                                                <Button danger>Delete Project</Button>
                                            </Popconfirm>
                                        </Space>
                                    </Col>
                                </Row>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col style={{ flex: 1 }}>
                    <Card style={{ width: "100%" }} >
                        <List header={<div style={{ display: "flex", justifyContent: "space-between" }}><Title level={5}>Scripts ({scripts?.length})</Title><Button style={{ float: "right" }} onClick={() => { scriptForm.resetFields(); scriptForm.validateFields(); setScriptModal(true); }}>Create Script</Button></div>} style={{ marginTop: -15 }}>
                            <VirtualList itemKey="script" data={scripts} height={475}>
                                {(script, i) => <List.Item key={i}>
                                    <List.Item.Meta
                                        title={script.Name}
                                        description={script.Version}
                                    />
                                    <div><Button type="primary" onClick={() => manageScript(script)}>Manage Script</Button></div>
                                </List.Item>}
                            </VirtualList>
                        </List>
                    </Card>
                </Col>
                <Col>
                    {project ? <Userbase project={project} /> : <Skeleton active />}
                </Col>
            </Row>

            <Modal title="Confirm Delete" open={confirmModalOpen} onCancel={() => setConfirmModalOpen(false)} footer={[
                <Button style={{ width: "100%" }} onClick={() => deleteProject()} disabled={confirmingName != project?.Name} danger>Delete this project</Button>
            ]}>
                <Form layout="vertical" style={{ marginBottom: -30 }} form={confirmForm}>
                    <Form.Item label={<Text><b className="unselectable">{`To confirm, type "${project?.Name}" in the box below`}</b></Text>} name="ConfirmationName">
                        <Input placeholder="project name" onChange={(e) => setConfirmingName(e.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title={!!scriptManaging ? "Manage Script" : "Create Script"} open={scriptModalOpen} onCancel={() => { setScriptModal(false); setScriptManaging(false); }} footer={[
                <Button type="primary" onClick={() => { setScriptModal(false); setScriptManaging(false); }}>Cancel</Button>,
                !!scriptManaging ?? <Button onClick={() => updateScript(scriptManaging)}>Update Script</Button>,
                !!scriptManaging ? <Popconfirm title="Delete Script?" description="Are you sure you want to delete this script?" onConfirm={() => deleteScript(scriptManaging)}>
                    <Button danger>Delete Script</Button>
                </Popconfirm> : <Button type="primary" onClick={() => createScript()}>Create Script</Button>
            ].filter(Boolean)}>
                <Form form={scriptForm} style={{ minWidth: "100%" }} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout="horizontal" labelAlign="left" autoComplete="off" colon={false}>
                    <Form.Item label="Script Name" name="Name" rules={[{ required: true, message: "Input a script name" }, { min: 5, message: "Script name must exceed 5 characters " }]} hasFeedback>
                        <Input placeholder="name" name="Name" />
                    </Form.Item>
                    <Form.Item label="Script Contents" name="Contents" rules={[{ required: false, message: "You must input a script" }]} valuePropName="fileList">
                        <Upload {...uploadProps}>
                            <Button>Upload Script</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Project;