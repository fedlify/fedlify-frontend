import { createStyles } from "antd-style";

export const useStyles = createStyles(({ /*token,*/isDarkMode, css }) => {
  return {
    hero: css`
        position: relative;
        minHeight: '100vh';
        overflow: hidden;
    `,
    imageBorder: css`
        width: 100%;
        height: auto;
        border-radius: 8px;
    `,
    videoBorder: css`
        width: 100%;
        height: auto;
        border: 1px solid ${isDarkMode ? 'white' : 'lightgrey'};
        border-radius: 8px;
    `,
  };
});