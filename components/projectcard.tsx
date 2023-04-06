import { Card, Row, Col, Typography, Select, Button, Tooltip, theme } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, Dispatch, SetStateAction } from "react";
import { Project, Script } from "../types/types";

const { Title, Text } = Typography;
const { Option } = Select

const ProjectCard = ({ project, onManage }: { project: Project, onManage: () => any }) => {
    const { token } = theme.useToken();
    const [status, setStatus] = useState(project.Online);

    const router = useRouter();
    console.log(project);

    return <Card style={{ minWidth: 300, marginTop: 10 }}>
        <Row align="middle">
            <Col style={{ marginRight: 10 }}><Title level={4}>{project.Name}</Title></Col>
            <Tooltip title={"Status: " + (status ? "Online" : "Offline")}>
                <div style={{ height: 10, width: 10, backgroundColor: status ? token.colorSuccess : token.colorError, borderRadius: 20, overflow: "hidden" }} />
            </Tooltip>
        </Row>
        <Row gutter={5}>
            <Col>
                <Button><Link href={"/projects/" + project.id}>View Project</Link></Button>
            </Col>
        </Row>
    </Card>
}

export default ProjectCard;