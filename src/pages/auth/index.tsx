import { Route, Outlet, Navigate } from "react-router";
import { ResourceProps, Authenticated } from "@refinedev/core";
import { Flex, Button } from "antd";
import { NavigateToResource } from "@refinedev/react-router";
import { FedlifyLogo, SkyScene, AuthPage as AntdAuthPage, type AuthPageProps } from "../../components";
// import { createStyles } from "antd-style";

const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

// const useAuthStyle = createStyles(({ css, token, isDarkMode }) => ({
//   button: css`
//     width: 150px;
//     color: ${isDarkMode ? 'black' : token.colorWhite};
//   `,
// }));

const AuthPage: React.FC<AuthPageProps> = ({ type, formProps, reCaptchaKey, googleClientId, providers }) => {
  const renderAuthContent = (content: React.ReactNode) => {

    return (
      <Flex
        vertical
        align="center"
        gap={16}
      >
        <Button
          color="default"
          variant="filled"
          style={{
            width: 150,
            color: 'black'
          }}
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
      </Flex>
    );
  };

  return (
    <AntdAuthPage
      type={type}
      renderContent={renderAuthContent}
      formProps={formProps}
      reCaptchaKey={reCaptchaKey}
      googleClientId={googleClientId}
      providers={providers}
      background={<SkyScene />}
    />
  );
};

// see https://refine.dev/docs/routing/integrations/react-router/
export const getRoute = (): React.ReactElement => {
  // The /forgot-password endpoint is rate-limited, so we can skip reCAPTCHA.
  // The /update-password flow requires a valid server-issued token (sent via email),
  // so we can safely bypass reCAPTCHA here as well.
  return (
    <Route
      path="/auth"
      element={
        <Authenticated key="auth-pages" fallback={<Outlet />}>
          <NavigateToResource resource="dashboard" />
        </Authenticated>
      }
    >
      {/* Redirect from /auth to /auth/login */}
      <Route index element={<Navigate to="login" replace />} />

      <Route
        path="login"
        element={
          <AuthPage
            type="login"
            reCaptchaKey={RECAPTCHA_KEY}
            googleClientId={GOOGLE_CLIENT_ID}
            providers={[{ name: "google" }]}
          />
        }
      />
      <Route
        path="register"
        element={
          <AuthPage
            type="register"
            reCaptchaKey={RECAPTCHA_KEY}
            googleClientId={GOOGLE_CLIENT_ID}
            providers={[{ name: "google" }]}
          />
        }
      />
      <Route
        path="forgot-password"
        element={<AuthPage type="forgotPassword" />}
      />
      <Route
        path="update-password"
        element={<AuthPage type="updatePassword" />}
      />

    </Route>

  );
}

// see https://refine.dev/docs/routing/integrations/react-router/
export const getResources = (): ResourceProps[] => {
  return [
    {
      name: "register",
      list: "auth/register",
      meta: {
        hide: true,
      }
    },
    {
      name: "login",
      list: "auth/login",
      meta: {
        hide: true,
      }
    },
    {
      name: "forgot-password",
      list: "auth/forgot-password",
      meta: {
        hide: true,
      }
    },
    {
      name: "update-password",
      list: "auth/update-password",
      meta: {
        hide: true,
      }
    },
  ];
}