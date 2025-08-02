import React from "react";
import {
  LoginPageProps,
  LoginFormTypes,
  useLink,
  useRouterType,
  useActiveAuthProvider,
  useLogin,
  useTranslate,
  useRouterContext,
  useNotification
} from "@refinedev/core";
import { ThemedTitleV2 } from "@refinedev/antd";
import {
  bodyStyles,
  containerStyles,
  headStyles,
  layoutStyles,
  titleStyles,
} from "./styles";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  CardProps,
  LayoutProps,
  Divider,
  FormProps,
  theme,
} from "antd";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { GoogleLogin } from '@react-oauth/google';

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
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isPending } = useLogin<LoginFormExtended>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

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

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title ?? <ThemedTitleV2 collapsed={false} />}
      </div>
    );

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {translate("pages.login.title", "Sign in to your account")}
    </Typography.Title>
  );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            if (provider.name === 'google') {
              return (
                <GoogleLogin
                  key={provider.name}
                  onSuccess={credentialResponse => {
                    login({
                      providerName: provider.name,
                      credential: credentialResponse.credential
                    })
                  }}
                  useOneTap={true}
                  auto_select={true}
                />);
            }
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "8px",
                }}
                onClick={() =>
                  login({
                    providerName: provider.name,
                  })
                }
              >
                {provider.label}
              </Button>
            );
          })}
          {!hideForm && (
            <Divider>
              <Typography.Text
                style={{
                  color: token.colorTextLabel,
                }}
              >
                {translate("pages.login.divider", "or")}
              </Typography.Text>
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card
      title={CardTitle}
      // headStyle={headStyles}
      // bodyStyle={bodyStyles}
      styles={{
        body: bodyStyles,
        header: headStyles
      }}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
      {...(contentProps ?? {})}
    >
      {renderProviders()}
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
            <div
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
                <ActiveLink
                  style={{
                    color: token.colorPrimaryTextHover,
                    fontSize: "12px",
                    marginLeft: "auto",
                  }}
                  to="/forgot-password"
                >
                  {translate(
                    "pages.login.buttons.forgotPassword",
                    "Forgot password?"
                  )}
                </ActiveLink>
              )}
            </div>
            {!hideForm && (
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
            )}
          </Form>
        )
      }

      {
        registerLink ?? (
          <div
            style={{
              marginTop: hideForm ? 16 : 8,
            }}
          >
            <Typography.Text style={{ fontSize: 12 }}>
              {translate(
                "pages.login.buttons.noAccount",
                "Don’t have an account?"
              )}{" "}
              <ActiveLink
                to="/register"
                style={{
                  fontWeight: "bold",
                  color: token.colorPrimaryTextHover,
                }}
              >
                {translate("pages.login.signup", "Sign up")}
              </ActiveLink>
            </Typography.Text>
          </div>
        )
      }
    </Card >
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align={hideForm ? "top" : "middle"}
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: hideForm ? "15dvh" : "16px",
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContent, PageTitle)
          ) : (
            <>
              {PageTitle}
              {CardContent}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};
