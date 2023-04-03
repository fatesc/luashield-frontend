import { useSession, signIn, signOut, SignInResponse } from "next-auth/react";

const HomePage = () => {
    const handleLogin = async () => {
        const result = await signIn("email-password", {
            email: "test@example.com",
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

    return (
        <div>
            {session ? 
            <>
                <p>logged in</p>
                <button onClick={() => signOut()}>log out</button>
            </> : 
            <>
                <p>not logged in</p>
                <button onClick={() => handleLogin()}>log in</button>
            </>}
        </div>
    )
}

export default HomePage;