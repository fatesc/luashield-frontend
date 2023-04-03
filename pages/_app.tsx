import { SessionProvider } from "next-auth/react";
import Layout from "../components/layout";

import "../styles/globals.css";
import "../styles/layout.css";
import "antd/dist/reset.css";

const App = ({ Component, pageProps: { session, ...pageProps }}) => {
    return (
        <SessionProvider session={session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    )
}

export default App;