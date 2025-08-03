import React, { useRef } from "react";
import {
  RegisterPageProps,
  RegisterFormTypes,
  useLink,
  useTranslate,
  useRegister,
  useNotification
} from "@refinedev/core";
import {
  Typography,
  Form,
  Input,
  Button,
  LayoutProps,
  CardProps,
  FormProps,
  theme,
  Progress,
  Flex
} from "antd";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { getPasswordStrength, passwordPattern, passwordFormatError, usePasswordStrengStyle } from '../passwordStrengthMeter';
import { AuthPageTitle } from "../authPageTitle";
import { AuthCard } from "../authCard";
import { ProviderButtons } from "../providerButtons";
import { AuthLayout } from "../authLayout";

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
  const Link = useLink();

  const { mutate: register, isPending } = useRegister<RegisterFormExtended>();

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

  const { styles: progressStyle } = usePasswordStrengStyle();
  const { score, label, color } = getPasswordStrength(Form.useWatch('password', form) ?? '');
  const passwordInputRef = useRef<HTMLDivElement>(null);

  const PageTitle = (<AuthPageTitle title={title} />)

  const CardContent = (
    <AuthCard
      title={translate("pages.register.title", "Sign up for your account")}
      contentProps={contentProps}
      token={token}
    >
      <ProviderButtons
        providers={providers}
        login={register}
        hideForm={hideForm}
        dividerText={translate("pages.login.divider", "or")}
        token={token}
      />
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
                  <Flex
                    style={{
                      maxWidth: `${passwordInputRef.current?.offsetWidth}px`,
                    }}
                  >
                    {translate(
                      "pages.register.errors.passwordFormat",
                      passwordFormatError
                    )}
                  </Flex>
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

          <Flex
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
                <Link
                  style={{
                    fontWeight: "bold",
                    color: token.colorPrimaryTextHover,
                  }}
                  go={{
                    to: {
                      resource: "login",
                      action: "list",
                    },
                  }}
                >
                  {translate("pages.login.signin", "Sign in")}
                </Link>
              </Typography.Text>
            )}
          </Flex>
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
        <Flex
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
            <Link
              go={{
                to: {
                  resource: "login",
                  action: "list",
                },
              }}
              style={{
                fontWeight: "bold",
                color: token.colorPrimaryTextHover,
              }}
            >
              {translate("pages.login.signin", "Sign in")}
            </Link>
          </Typography.Text>
        </Flex>
      )}
    </AuthCard>
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

