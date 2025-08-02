import { CSSProperties } from "react"
import { Route, Outlet } from "react-router";
import { ResourceProps, Authenticated } from "@refinedev/core";
import { Flex, Button } from "antd";
import { NavigateToResource } from "@refinedev/react-router";
import { FedlifyLogo, SkyScene, AuthPage as AntdAuthPage, type AuthPageProps } from "../../components";
import { useConfigProvider } from "../../contexts";

const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const renderAuthContent = (content: React.ReactNode) => {
  const theme = useConfigProvider();
  const style: CSSProperties = {
    width: '150px',
  };

  if (theme.mode === 'dark') {
    style.color = 'black';
  }

  return (
    <Flex
      vertical
      align="center"
      gap={16}
    >
      <Button
        color="default"
        variant="filled"
        style={style}
      >
        <FedlifyLogo
          style={{
            width: 48,
            height: 48,
          }}
          animated={false}
        />
        Fedlify
      </Button>
      {content}
      {/* <Link to="/">
        <Flex
          align="center"
          justify="center"
          gap={12}
          style={{
            marginTop: 16,
            paddingTop: 16,
            paddingBottom: 8,
            background: "white",
            borderRadius: 100
          }}
        >
          <FedlifyLogo
            style={{
              width: 48,
              height: 48,
            }}
            animated={false}
          />
          <FedlifyLogoName
            style={{
              width: "100px",
              height: "auto",
            }}
            animated={false}
          />
        </Flex>
      </Link> */}
    </Flex>
  );
};

const AuthPage: React.FC<AuthPageProps> = ({ type, formProps, reCaptchaKey, googleClientId, providers }) => {
  return (
    <AntdAuthPage
      type={type}
      renderContent={renderAuthContent}
      formProps={formProps}
      reCaptchaKey={reCaptchaKey}
      googleClientId={googleClientId}
      providers={providers}
    />
  );
};

const SectionWithBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Background 3D Scene */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <SkyScene />
      </div>
      {children}
    </div>
  );
}

export const getRoute = (): React.ReactElement => {
  // The /forgot-password endpoint is rate-limited, so we can skip reCAPTCHA.
  // The /update-password flow requires a valid server-issued token (sent via email),
  // so we can safely bypass reCAPTCHA here as well.
  return (
    <Route
      element={
        <Authenticated key="auth-pages" fallback={<Outlet />}>
          <NavigateToResource resource="dashboard" />
        </Authenticated>
      }
    >
      <Route
        path="/login"
        element={
          <SectionWithBackground>
            <AuthPage
              type="login"
              reCaptchaKey={RECAPTCHA_KEY}
              googleClientId={GOOGLE_CLIENT_ID}
              providers={[{ name: "google" }]}
            />
          </SectionWithBackground>
        }
      />
      <Route
        path="/register"
        element={
          <SectionWithBackground>
            <AuthPage
              type="register"
              reCaptchaKey={RECAPTCHA_KEY}
              googleClientId={GOOGLE_CLIENT_ID}
              providers={[{ name: "google" }]}
            />
          </SectionWithBackground>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <SectionWithBackground>
            <AuthPage type="forgotPassword" />
          </SectionWithBackground>
        }
      />
      <Route
        path="/update-password"
        element={
          <SectionWithBackground>
            <AuthPage type="updatePassword" />
          </SectionWithBackground>
        }
      />

    </Route>

  );
}

export const getResources = (): ResourceProps[] => {
  return [];
}