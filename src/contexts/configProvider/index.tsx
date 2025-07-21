import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ConfigProvider as AntdConfigProvider,
  theme,
  type ThemeConfig,
} from "antd";
import { ThemeProvider } from "antd-style";
// import { RefineThemes } from "@refinedev/antd";
import "./config.css";

type Mode = "light" | "dark";

type ConfigProviderContext = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const getThemeModeConfig = (mode: Mode): ThemeConfig => {
  const modeDependentMenuTokens = {
    light: {
      itemSelectedBg: "#E3E3EB",
      itemSelectedColor: "#1F2124",
      itemColor: "rgb(110, 110, 128)",
      itemHoverColor: "rgb(66,   66,   75)",
      itemActiveBg: "rgb(236, 236, 239)",
    },
    dark: {
      itemSelectedBg: "#46464D",
      itemSelectedColor: "#ffffff",
      itemColor: "#ACACBD",
      itemHoverColor: "rgb(247, 247, 248)",
      itemActiveBg: "rgb(49,  49,   53)",
    },
  };

  const modeDependentLayoutTokens = {
    light: {},
    dark: {
      bodyBg: '#2D2E36',
      footerBg: '#2D2E36',
    },
  };

  const modeDependentCardTokens = {
    light: {},
    dark: {
      colorBgContainer: '#2D2E36',
      colorBorderSecondary: '#46464D'
    },
  };

  const modeDependentButtonTokens = {
    light: {},
    dark: {
      // defaultActiveColor: '#2D2E36',
      defaultBg: '#202123',
    },
  };

  // for more info, see here: https://ant.design/theme-editor
  const components = {
    Layout: {
      headerHeight: 54,
      ...modeDependentLayoutTokens[mode]
    },
    Menu: {
      itemHeight: 32,
      itemBorderRadius: 6,
      collapsedWidth: 60,
      iconSize: 16,
      collapsedIconSize: 16,
      ...modeDependentMenuTokens[mode]
    },
    Tooltip: {
      controlHeight: 20,
      lineHeight: 1.15,
    },
    Typography: {
      // colorLink: "rgb(82,196,26)",
      // fontSize: 18,
      // colorText: '#555572',
      // fontWeightStrong: 700,
      lineHeight: 1.65,
    },
    Card: {
      ...modeDependentCardTokens[mode]
    },
    Button: {
      ...modeDependentButtonTokens[mode]
    },
  }

  return {
    token: {
      colorPrimary: "#634168ff",
      fontFamily: "Noto Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: 18,
    },
    algorithm: mode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
    // algorithm: theme.darkAlgorithm,
    components,
  };
};

export const ConfigProviderContext = createContext<
  ConfigProviderContext | undefined
>(undefined);

const defaultMode: Mode = (localStorage.getItem("theme") as Mode) || "light";
// const defaultMode: Mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

type ConfigProviderProps = {
  theme?: ThemeConfig;
};

export const ConfigProvider = ({
  theme: themeFromProps,
  children,
}: PropsWithChildren<ConfigProviderProps>) => {
  const [mode, setMode] = useState<Mode>(defaultMode);

  const handleSetMode = (mode: Mode) => {
    localStorage.setItem("theme", mode);
    const html = document.querySelector("html");
    html?.setAttribute("data-theme", mode);
    setMode(mode);
  };

  // add data-theme to html tag
  useEffect(() => {
    const html = document.querySelector("html");
    html?.setAttribute("data-theme", mode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newMode: Mode = e.matches ? "dark" : "light";
      handleSetMode(newMode);
    };

    // Listen for changes
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Optional: set initial mode if no user preference
    if (!localStorage.getItem("theme")) {
      handleSetMode(mediaQuery.matches ? "dark" : "light");
    }

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // TODO:Content Security Policy
  return (
    <ConfigProviderContext.Provider value={{ mode, setMode: handleSetMode }}>
      <AntdConfigProvider componentSize="middle"
        theme={{
          ...getThemeModeConfig(mode),
          ...themeFromProps,
        }}
      >
        <ThemeProvider appearance={mode}>{children}</ThemeProvider>
      </AntdConfigProvider>
    </ConfigProviderContext.Provider>
  );
};

export const useConfigProvider = () => {
  const context = useContext(ConfigProviderContext);

  if (context === undefined) {
    throw new Error("useConfigProvider must be used within a ConfigProvider");
  }

  return context;
};
