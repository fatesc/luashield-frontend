import { useSession } from "next-auth/react";
import { Result, Button, Skeleton, Row, Col, Card, Form, Popconfirm, Modal, Typography, Input, Space, message } from "antd";
import { useEffect, useState } from "react";
import { Buyer, Subscription } from "../../types/types";
import List from "../../components/list";
import NumericInput from "../../components/numericinput";

const { Title, Text } = Typography;
const { Search } = Input;

const AdminPage = () => {
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated: () => {

        }
    });

    const user = session?.user
    const [subscriptions, setSubscriptions] = useState<Subscription[]>();
    const [filteredSubscriptions, setFilteredSubScriptions] = useState<Subscription[]>();
    const [subManaging, setSubManaging] = useState<Subscription | boolean>(false);
    const [subModalOpen, setSubModalOpen] = useState(false);
    const [months, setMonths] = useState("");
    const [createdModal, setCreatedModal] = useState(false);
    const [newSubscriptionID, setNewSubscriptionId] = useState('');

    const [subForm] = Form.useForm();

    useEffect(() => {
        if (user?.Admin && !subscriptions) {
            fetch("https://api.luashield.com/admin/subscriptions", {
                method: "GET",
                headers: {
                    "LuaShield-API-Key": user?.APIKey as string
                }
            })
                .then(res => res.json())
                .then(subs => {
                    console.log(subs);
                    setSubscriptions(subs);
                    setFilteredSubScriptions(subs);
                });
        }
    }, [user, status]);

    if (status == "loading") {
        return <Skeleton active />
    }

    if (!user.Admin) {
        return <Result status="error" title="Protected Page" subTitle="This page is for admins only" />
    }

    if (!subscriptions) {
        return <Skeleton active />
    }

    const createSub = async (sub: Subscription) => {
        if (months == "") {
            return message.error("Input an amount of months");
        }
        await fetch("https://api.luashield.com/admin/subscriptions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "LuaShield-API-Key": user?.APIKey as string
            },
            body: JSON.stringify({ months: parseInt(months) })
        }).then(res => res.json())
        .then((user: Buyer) => {
            message.success("Created new subscription!");
            setSubModalOpen(false);
            setSubManaging(false);
            setNewSubscriptionId(user.SubscriptionID);
            setCreatedModal(true);
        });
    }
    const updateSub = (sub: Subscription) => {

    }
    const deleteSub = (sub: Subscription) => {

    }

    const onSearch: any = (e) => {
        setFilteredSubScriptions(subscriptions.filter(subscription => subscription.Email.startsWith(e.target.value)));
    }

    return (
        <div>
            <Row>
                <Col style={{ flex: 1 }}>
                    <List 
                        data={filteredSubscriptions}
                        width="50%"
                        height="100%"
                        title={`Subscriptions (${filteredSubscriptions.length})`}
                        create={{
                            text: "Create Subscription",
                            onClick: () => { setSubManaging(false); setSubModalOpen(true); }
                        }}
                        searchBar={{ placeHolder: "Search Subscriptions", onChange: onSearch }}
                        key="subs"
                        manage={{
                            text: "Manage Subscription",
                            onClick: () => { },
                        }}
                        item={{
                            title: "Email",
                            description: "SubscriptionID"
                        }}
                    />
                </Col>
            </Row>

            <Modal title={!!subManaging ? "Manage Subscription" : "Create Subscription"} open={subModalOpen} onCancel={() => { setSubModalOpen(false); setSubManaging(false); }} footer={[
                <Button type="primary" onClick={() => { setSubModalOpen(false); setSubManaging(false); }}>Cancel</Button>,
                !!subManaging ?? <Button onClick={() => updateSub(subManaging as Subscription)}>Update Subscription</Button>,
                !!subManaging ? <Popconfirm title="Delete Script?" description="Are you sure you want to delete this script?" onConfirm={() => deleteSub(subManaging as Subscription)}>
                    <Button danger>Delete Subscription</Button>
                </Popconfirm> : <Button type="primary" onClick={() => createSub(subManaging as Subscription)}>Create Subscription</Button>
            ].filter(Boolean)}>
                <Form form={subForm} style={{ minWidth: "100%" }} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout="horizontal" labelAlign="left" autoComplete="off" colon={false}>
                    <Form.Item rules={[{ required: true, message: "you must input the months"}]} label="Months">
                        <NumericInput value={months} onChange={setMonths} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Subscription Created" open={createdModal} onCancel={() => { setCreatedModal(false); }} onOk={() => { setCreatedModal(false); }} centered>
                <Row>
                    <Col>
                        <Title level={5}>Subscription ID: <Text type="secondary">{newSubscriptionID}</Text></Title>
                    </Col>
                </Row>
            </Modal>
        </div>
    )
}

AdminPage.auth = {
    role: "admin",
    unauthorized: "/"
}


export default AdminPage;