import { useSession } from "next-auth/react";

const AdminPage = () => {
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => {

        }
    })

    if (status == "loading") {
        return ""
    }

    return (
        <div>AdminPage</div>
    )
}

export default AdminPage