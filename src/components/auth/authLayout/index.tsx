import { Layout, Row, Col } from "antd";
// import { CSSProperties } from "react";

// const layoutStyles: CSSProperties = {};

export const AuthLayout: React.FC<{
    children: React.ReactNode;
    hideForm?: boolean;
    wrapperProps?: React.ComponentProps<typeof Layout>;
}> = ({ children, hideForm, wrapperProps }) => (
    <Layout
        // style={layoutStyles}
        {...(wrapperProps ?? {})}
    >
        <Row
            justify="center"
            align={hideForm ? "top" : "middle"}
            style={{
                padding: "16px 0",
                minHeight: "100dvh",
                paddingTop: hideForm ? "15dvh" : "16px",
            }}
        >
            <Col xs={22}>{children}</Col>
        </Row>
    </Layout>
);
