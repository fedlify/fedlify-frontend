import React from "react";
import { ThemedTitleV2 } from "@refinedev/antd";
import { Flex } from "antd";

type AuthPageTitleProps = {
    title?: React.ReactNode | false;
};

export const AuthPageTitle: React.FC<AuthPageTitleProps> = ({ title }) => {
    if (title === false) return null;

    return (
        <Flex
            justify="center"
            style={{
                marginBottom: "32px",
                fontSize: "20px",
            }}
        >
            {title ?? <ThemedTitleV2 collapsed={false} />}
        </Flex>
    );
};
