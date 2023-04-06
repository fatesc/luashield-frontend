import { Result, Button } from "antd";
import { useRouter } from "next/router";

const _404 = () => {
    const router = useRouter();
    const goHome = () => router.push("/");

    return <Result
        status="error"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={goHome}>Back Home</Button>}
    />
}

export default _404;