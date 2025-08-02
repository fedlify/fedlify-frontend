import { Grid } from "antd";

/**
 * Custom hook to determine if the current screen is considered mobile.
 * Returns true if below the `lg` breakpoint.
 */
export const useIsMobile = (): boolean => {
  const breakpoint = Grid.useBreakpoint();
  return typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;
};
