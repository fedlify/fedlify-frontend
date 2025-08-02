import React, { useRef } from "react";
import {
  RegisterPageProps,
  RegisterFormTypes,
  useRouterType,
  useLink,
  useActiveAuthProvider,
  useTranslate,
  useRouterContext,
  useRegister,
  useNotification
} from "@refinedev/core";
import { ThemedTitleV2 } from "@refinedev/antd";
import {
  layoutStyles,
  containerStyles,
  titleStyles,
  headStyles,
  bodyStyles,
  useProgressStyle
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
  LayoutProps,
  CardProps,
  FormProps,
  Divider,
  theme,
  Progress,
  Flex
} from "antd";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { GoogleLogin } from '@react-oauth/google';
import { getPasswordStrength, passwordPattern, passwordFormatError } from './password';

type RegisterProps = RegisterPageProps<LayoutProps, CardProps, FormProps>;
type RegisterFormExtended = RegisterFormTypes & {
  recaptchaToken?: string;
  confirmPassword?: string;
  credential?: string;
};

/**
 * **refine** has register page form which is served on `/register` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#register} for more details.
 */
export const RegisterPage: React.FC<RegisterProps> = ({
  providers,
  loginLink,
  wrapperProps,
  contentProps,
  renderContent,
  formProps,
  title,
  hideForm,
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { open: openNotification } = useNotification();

  const { token } = theme.useToken();
  const [form] = Form.useForm<RegisterFormExtended>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const authProvider = useActiveAuthProvider();
  const { mutate: register, isPending } = useRegister<RegisterFormExtended>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const onFinish = React.useCallback(async (values: RegisterFormExtended) => {
    if (!executeRecaptcha) {
      openNotification?.({
        type: "error",
        message: translate("pages.register.errors.recaptchaNotReady", "CAPTCHA not yet ready. Please try again."),
      });
      return;
    }

    try {
      const captchaToken = await executeRecaptcha("signup");
      register({ ...values, recaptchaToken: captchaToken });
    } catch (error) {
      openNotification?.({
        type: "error",
        message: translate("pages.register.errors.recaptchaFailed", "CAPTCHA failed. Please refresh and try again."),
      });

    }
  }, [executeRecaptcha]);

  const { styles: progressStyle } = useProgressStyle();

  const { score, label, color } = getPasswordStrength(Form.useWatch('password', form) ?? '');

  const passwordInputRef = useRef<HTMLDivElement>(null);

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
      {translate("pages.register.title", "Sign up for your account")}
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
                    register({
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
                onClick={() => {
                  register({ providerName: provider.name });
                }}
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
      {!hideForm && (
        <Form<RegisterFormExtended>
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark={false}
          {...formProps}
        >
          <Form.Item
            name="email"
            label={translate("pages.register.email", "Email")}
            rules={[
              { required: true },
              {
                type: "email",
                message: translate(
                  "pages.register.errors.validEmail",
                  "Invalid email address"
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={translate("pages.register.fields.email", "Email")}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={translate("pages.register.fields.password", "Password")}
            validateFirst
            rules={[
              { required: true },
              {
                pattern: passwordPattern,
                message: (
                  <div
                    style={{
                      maxWidth: `${passwordInputRef.current?.offsetWidth}px`,
                    }}
                  >
                    {translate(
                      "pages.register.errors.passwordFormat",
                      passwordFormatError
                    )}
                  </div>
                ),
              },
            ]}
          >
            <div ref={passwordInputRef}>
              <Input.Password size="large" />
              <Flex>
                <Progress
                  className={progressStyle.stepProgress}
                  style={{
                    width: passwordInputRef.current?.offsetWidth,
                  }}
                  percent={score}
                  steps={5}
                  strokeColor={color}
                  format={() => label}
                  showInfo={true}
                />
              </Flex>
            </div>
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={translate("pages.register.fields.confirmPassword", "Confirm Password")}
            dependencies={["password"]}
            validateFirst
            rules={[
              {
                required: true,
                message: translate(
                  "pages.register.errors.confirmPasswordRequired",
                  "Please confirm your password"
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return value === getFieldValue("password")
                    ? Promise.resolve()
                    : Promise.reject(
                      translate(
                        "pages.register.errors.passwordsDoNotMatch",
                        "Passwords do not match"
                      )
                    );
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            {loginLink ?? (
              <Typography.Text
                style={{
                  fontSize: 12,
                  marginLeft: "auto",
                }}
              >
                {translate(
                  "pages.login.buttons.haveAccount",
                  "Have an account?"
                )}{" "}
                <ActiveLink
                  style={{
                    fontWeight: "bold",
                    color: token.colorPrimaryTextHover,
                  }}
                  to="/login"
                >
                  {translate("pages.login.signin", "Sign in")}
                </ActiveLink>
              </Typography.Text>
            )}
          </div>
          <Form.Item
            style={{
              marginBottom: 0,
            }}
          >
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isPending}
              block
            >
              {translate("pages.register.buttons.submit", "Sign up")}
            </Button>
          </Form.Item>
        </Form>
      )}
      {hideForm && loginLink !== false && (
        <div
          style={{
            marginTop: hideForm ? 16 : 8,
          }}
        >
          <Typography.Text
            style={{
              fontSize: 12,
            }}
          >
            {translate("pages.login.buttons.haveAccount", "Have an account?")}{" "}
            <ActiveLink
              style={{
                fontWeight: "bold",
                color: token.colorPrimaryTextHover,
              }}
              to="/login"
            >
              {translate("pages.login.signin", "Sign in")}
            </ActiveLink>
          </Typography.Text>
        </div>
      )}
    </Card>
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

