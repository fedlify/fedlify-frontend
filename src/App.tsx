import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { PageNotFound } from "./components";
import { BrowserRouter, Routes, Route } from "react-router";
import { ConfigProvider } from "./contexts";
import { getRoute as getHomeRoute } from "./pages/home";
import { getRoute as getAuthRoute, getResources as getAuthResources } from "./pages/auth";
import { getRoute as getDashboardRoute, getResources as getDashboardResources } from "./pages/dashboard";
import { useTranslation } from "react-i18next";
import { apiProvider } from "./providers";
import "@refinedev/antd/dist/reset.css";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params?: Record<string, unknown>) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const [authProvider/*, dataProvider*/] = apiProvider(
    {
      appId: "e0727kP32BOSSysO8hK4nPYvSMhDj2GN",
      javascriptKey: "bqlDbSbwej4vZTKQzE1ZOtddtf1CcovV",
      serverURL: "http://localhost:1337/hivebridge"
    }
  );

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
                authProvider={authProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                i18nProvider={i18nProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "PysoNN-hXte4H-8HUuiy",
                }}
                resources={[
                  ...getDashboardResources(),
                  // ...getHomeResources(),
                  ...getAuthResources(),
                ]}
              >
                <Routes>
                  {getDashboardRoute()}
                  {getHomeRoute()}
                  {getAuthRoute()}
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter >
  );
}

export default App;
