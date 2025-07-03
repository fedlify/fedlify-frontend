import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => {
  return {
    hero: css`
        position: relative;
        height: 100vh;
        overflow: hidden;
  `,
  };
});
