import { Button, Typography } from "antd";
import { useSession, signIn, signOut, SignInResponse } from "next-auth/react";


const { Text } = Typography;

const HomePage = () => {
    const handleLogin = async () => {
        const result = await signIn("email-password", {
            email: "admin@example.com",
            password: "123",
            redirect: false
        }) as SignInResponse;

        if (result.ok) {
            console.log("logged in");
        } else {
            console.error(result.error);
        }

    }

    const { data: session } = useSession();
    const user = session?.user

    return (
        <div>
            
        </div>
    )
}

export default HomePage;