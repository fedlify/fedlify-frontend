import React from "react";
import { AuthPageProps as RefineAuthPageProps, OAuthProvider } from "@refinedev/core";
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  UpdatePasswordPage,
} from "./components";
import { CardProps, FormProps, LayoutProps } from "antd";
import {
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";
import { GoogleOAuthProvider } from '@react-oauth/google';

export type AuthPageProps = RefineAuthPageProps<LayoutProps, CardProps, FormProps> & {
  renderContent?: (
    content: React.ReactNode,
    title: React.ReactNode
  ) => React.ReactNode;
  title?: React.ReactNode;
  reCaptchaKey?: string;
  googleClientId?: string;
  providers?: OAuthProvider[];
};

// Wrapper for Google OAuth if `googleClientId` is provided
const GoogleOAuth: React.FC<{ clientId?: string; children: React.ReactNode }> = ({
  clientId,
  children,
}) => {
  if (!clientId) return <>{children}</>;
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};

/**
 * **refine** has a default auth page form served on the `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/antd-auth-page/} for more details.
 */
export const AuthPage: React.FC<AuthPageProps> = ({ type, reCaptchaKey, googleClientId, ...props }) => {
  // const { type, reCaptchaKey, googleClientId } = props;

  const renderView = () => {
    switch (type) {
      case "register":
        return <GoogleOAuth clientId={googleClientId}><RegisterPage {...props} /></GoogleOAuth>;
      case "forgotPassword":
        return <ForgotPasswordPage {...props} />;
      case "updatePassword":
        return <UpdatePasswordPage {...props} />;
      default:
        return <GoogleOAuth clientId={googleClientId}><LoginPage {...props} /></GoogleOAuth>;
    }
  };

  const view = renderView();

  if (reCaptchaKey) {
    return (
      <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
        {view}
      </GoogleReCaptchaProvider>
    );
  }
  return <>{view}</>;
};
