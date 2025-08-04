import React from "react";
import {
  LoginPageProps,
  LoginFormTypes,
  useLink,
  useLogin,
  useTranslate,
  useNotification
} from "@refinedev/core";
import {
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  CardProps,
  LayoutProps,
  FormProps,
  theme,
  Flex,
} from "antd";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { AuthPageTitle } from "../authPageTitle";
import { AuthCard } from "../authCard";
import { AuthLayout } from "../authLayout";
import { ProviderButtons } from "../providerButtons";

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
type LoginFormExtended = LoginFormTypes & {
  recaptchaToken?: string;
  confirmPassword?: string;
  credential?: string;
};
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { open: openNotification } = useNotification();

  const { token } = theme.useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();
  const Link = useLink();

  const { mutate: login, isPending } = useLogin<LoginFormExtended>();

  const onFinish = React.useCallback(async (values: LoginFormExtended) => {
    if (!executeRecaptcha) {
      openNotification?.({
        type: "error",
        message: translate("pages.login.errors.recaptchaNotReady", "CAPTCHA not yet ready. Please try again."),
      });
      return;
    }

    try {
      const captchaToken = await executeRecaptcha("login");
      login({ ...values, recaptchaToken: captchaToken });
    } catch (error) {
      openNotification?.({
        type: "error",
        message: translate("pages.login.errors.recaptchaFailed", "CAPTCHA failed. Please refresh and try again."),
      });

    }
  }, [executeRecaptcha]);

  const PageTitle = (<AuthPageTitle title={title} />)

  const CardContent = (
    <AuthCard
      title={translate("pages.login.title", "Sign in to your account")}
      contentProps={contentProps}
      token={token}
    >
      <ProviderButtons
        providers={providers}
        login={login}
        hideForm={hideForm}
        dividerText={translate("pages.login.divider", "or")}
        token={token}
      />
      {
        !hideForm && (
          <Form<LoginFormTypes>
            layout="vertical"
            form={form}
            // onFinish={(values) => login(values)}
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{
              remember: false,
            }}
            {...formProps}
          >
            <Form.Item
              name="email"
              label={translate("pages.login.fields.email", "Email")}
              rules={[
                { required: true },
                {
                  type: "email",
                  message: translate(
                    "pages.login.errors.validEmail",
                    "Invalid email address"
                  ),
                },
              ]}
            >
              <Input
                size="large"
                placeholder={translate("pages.login.fields.email", "Email")}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={translate("pages.login.fields.password", "Password")}
              rules={[{ required: true }]}
            >
              <Input.Password
                autoComplete="current-password"
                size="large"
              />
            </Form.Item>
            <Flex
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              {rememberMe ?? (
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    {translate("pages.login.buttons.rememberMe", "Remember me")}
                  </Checkbox>
                </Form.Item>
              )}
              {forgotPasswordLink ?? (
                <Link
                  go={{
                    to: {
                      resource: "forgot-password",
                      action: "list",
                    },
                  }}
                  style={{
                    color: token.colorPrimaryTextHover,
                    fontSize: "12px",
                    marginLeft: "auto",
                  }}
                >
                  {translate(
                    "pages.login.buttons.forgotPassword",
                    "Forgot password?"
                  )}
                </Link>
              )}
            </Flex>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isPending}
                block
              >
                {translate("pages.login.signin", "Sign in")}
              </Button>
            </Form.Item>
          </Form>
        )
      }

      {
        registerLink ?? (
          <Flex
            style={{
              marginTop: hideForm ? 16 : 8,
            }}
          >
            <Typography.Text style={{ fontSize: 12 }}>
              {translate(
                "pages.login.buttons.noAccount",
                "Don’t have an account?"
              )}{" "}
              <Link
                // to="register"
                go={{
                  to: {
                    resource: "register",
                    action: "list",
                  },
                }}
                style={{
                  fontWeight: "bold",
                  color: token.colorPrimaryTextHover,
                }}
              >
                {translate("pages.login.signup", "Sign up")}
              </Link>
            </Typography.Text>
          </Flex>
        )
      }
    </AuthCard >
  );

  return (
    <AuthLayout wrapperProps={wrapperProps}>
      {renderContent ? (
        renderContent(CardContent, PageTitle)
      ) : (
        <>
          {PageTitle}
          {CardContent}
        </>
      )}
    </AuthLayout>
  );
};
