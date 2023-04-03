import { useSession } from "next-auth/react";

const AdminPage = () => {
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => {
            
        }
    })

    if (status == "loading") {
        return "not authenticated";
    }

    return (
        <div>AdminPage</div>
        // manage buyers
    )
}


export default AdminPage;