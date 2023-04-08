import { Card, List as _List, Typography, Space, Input, Button, Modal } from "antd";
import VirtualList from "rc-virtual-list";

const { Title, Text } = Typography;
const { Search } = Input;
const { Item } = _List;

const List = (
    { height, width, key, title, searchBar, data, create, manage, item }
        :
        {
            height: string, width: string, key: string, title: any,
            searchBar?: { placeHolder: string, onChange: () => any },
            data: any[], create: { onClick: () => any, text: string },
            manage: { onClick: (item: any) => any, text: string },
            item: { title: string, description: string }
        }) => {
    return (
        <Card style={{ width, height }}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {searchBar ? <Search placeholder={searchBar.placeHolder} allowClear onChange={searchBar.onChange} style={{ width: "100%" }} ></Search> : <></>}
                <_List header={<div style={{ display: "flex", justifyContent: "space-between" }}><Title level={5}>{title}</Title><Button style={{ float: "right" }} onClick={() => create.onClick()}>{create.text}</Button></div>} style={{ marginTop: -15 }}>
                    <VirtualList itemKey={key} data={data}>
                        {(listItem, i) => <Item key={i}>
                            <Item.Meta
                                title={listItem[item.title]}
                                description={listItem[item.description]}
                            />
                            <div><Button type="primary" onClick={() => manage.onClick(listItem)}>{manage.text}</Button></div>
                        </Item>}
                    </VirtualList>
                </_List>
            </Space>
        </Card>
    )
}

export default List;