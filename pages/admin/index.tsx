import { useSession } from "next-auth/react";
import { Result, Button, Skeleton } from "antd";

const AdminPage = () => {
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated: () => {
            
        }
    });
    
    const user = session?.user

    if (status == "loading") {
        return <Skeleton active />
    }

    if (!user.Admin) {
        return <Result status="error" title="Protected Page" subTitle="This page is for admins only"/>
    }

    return (
        <div><Button>Test</Button></div>
    )
}

AdminPage.auth = {
    role: "admin",
    unauthorized: "/"
}


export default AdminPage;