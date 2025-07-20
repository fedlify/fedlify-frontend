import { createStyles } from "antd-style";

export const useStyles = createStyles(({ /*token,*/ css }) => {
  return {
    hero: css`
        position: relative;
        minHeight: '100vh';
        overflow: hidden;
    `,
    animatedFooter: css`
      background: linear-gradient(-45deg, #806484, #9492abff, #9f9fb6);
      background-size: 400% 400%;
      animation: gradientShift 10s ease infinite;
      color: white;
      text-align: center;
      padding: 2rem 1rem;
      margin-top: -0.5rem;

      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `,
  };

});
