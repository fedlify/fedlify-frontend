import React, { useMemo, CSSProperties } from "react";
import { Card, Typography } from "antd";
import type { CardProps, GlobalToken } from "antd";

export const AuthCard: React.FC<{
  title: string;
  children: React.ReactNode;
  contentProps?: CardProps;
  token?: GlobalToken;
}> = ({ title, children, contentProps, token }) => {

  const styles = useMemo(() => {
    const container: CSSProperties = {
      backgroundColor: token?.colorBgElevated,
      maxWidth: "400px",
      margin: "auto",
      padding: "32px",
      boxShadow:
        "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px rgba(0, 0, 0, 0.03)",
    };
    const header: CSSProperties = {
      borderBottom: 0,
      padding: 0,
    }
    const body: CSSProperties = {
      padding: 0,
      marginTop: "16px",
    };
    const title: CSSProperties = {
      textAlign: "center",
      marginBottom: 0,
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: 600,
      overflowWrap: "break-word",
      hyphens: "manual",
      textOverflow: "unset",
      whiteSpace: "pre-wrap",
      color: token?.colorPrimaryTextHover,
    };
    return ({ container, header, body, title, });
  }, [token]);

  return (
    <Card
      title={
        <Typography.Title level={3} style={styles.title}>
          {title}
        </Typography.Title>
      }
      styles={{
        header: styles.header,
        body: styles.body,
      }}
      style={styles.container}
      {...(contentProps ?? {})}
    >
      {children}
    </Card>
  );
};
