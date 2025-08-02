import { CSSProperties } from "react";
import { createStyles } from "antd-style";

export const layoutStyles: CSSProperties = {};

export const containerStyles: CSSProperties = {
  maxWidth: "400px",
  margin: "auto",
  padding: "32px",
  boxShadow:
    "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px rgba(0, 0, 0, 0.03)",
};

export const headStyles: CSSProperties = {
  borderBottom: 0,
  padding: 0,
};

export const bodyStyles: CSSProperties = { padding: 0, marginTop: "16px" };

export const titleStyles: CSSProperties = {
  textAlign: "center",
  marginBottom: 0,
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: 600,
  overflowWrap: "break-word",
  hyphens: "manual",
  textOverflow: "unset",
  whiteSpace: "pre-wrap",
};

export const useProgressStyle = createStyles(({ css }) => {
  return {
    stepProgress: css`
      margin-top: 4px;
      width: 100%;

      > div {
        display: flex;
        align-items: center;      

        > div {
          flex: 1;  
          border-radius: 6px;
          height: 4px !important;        
        }

        > span {
          flex: 1;
          width: auto !important;
          flex-shrink: 0;
          flex-grow: 0;    
          font-size: 12px;
          white-space: nowrap;
        }
      }
    `,
  };
});