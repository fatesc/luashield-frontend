import { Card, Row, Col, Typography, Select, Button, Tooltip, theme } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, Dispatch, SetStateAction } from "react";
import { Project, Script } from "../types/types";

const { Title, Text } = Typography;
const { Option } = Select

const ProjectCard =  ({ project, onManage }: { project: Project, onManage: () => any }) => {
    const { token } = theme.useToken();
    const [status, setStatus] = useState(project.Online);

    const router = useRouter();
    console.log(project);

    return <Card style={{ minWidth: 300 }}>
        <Row align="middle">
            <Col style={{ marginRight: 10 }}><Title level={4}>{project.Name}</Title></Col>
            <Col span={2} offset={-3}>
                <Tooltip title={"Status: " + (status ? "Online" : "Offline")}>
                    <Select showSearch={false} showArrow={false} bordered={false} listItemHeight={10} dropdownMatchSelectWidth={200}
                        style={{ height: 10, width: 10, backgroundColor: status ? token.colorSuccess : token.colorError, borderRadius: 20, overflow: "hidden" }}
                        onChange={(val) => setStatus(val == "online")}
                    >
                        <Option value="online">
                            <Row align="middle">
                                <Col span={3}>
                                    <div style={{ height: 10, width: 10, borderRadius: 20, backgroundColor: token.colorSuccess, float: "left", marginRight: 10 }} />
                                </Col>
                                <Col>
                                    <Text>Online</Text>
                                </Col>
                            </Row>
                        </Option>
                        <Option value="offline">
                            <Row align="middle">
                                <Col span={3}>
                                    <div style={{ height: 10, width: 10, borderRadius: 20, backgroundColor: token.colorError, float: "left", marginRight: 10 }} />
                                </Col>
                                <Col>
                                    <Text>Offline</Text>
                                </Col>
                            </Row>
                        </Option>
                    </Select>
                </Tooltip>
            </Col>
        </Row>
        <Row gutter={5}>
            <Col>
                <Button><Link href={"/projects/" + project.id}>View Project</Link></Button>
            </Col>
        </Row>
    </Card>
}

export default ProjectCard;