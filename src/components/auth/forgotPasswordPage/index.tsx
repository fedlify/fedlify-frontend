import React from "react";
import {
  ForgotPasswordPageProps,
  ForgotPasswordFormTypes,
  useLink,
  useTranslate,
  useForgotPassword,
} from "@refinedev/core";
import {
  Flex,
  Typography,
  Form,
  Input,
  Button,
  LayoutProps,
  CardProps,
  FormProps,
  theme,
} from "antd";
import { AuthCard } from "../authCard";
import { AuthLayout } from "../authLayout";
import { AuthPageTitle } from "../authPageTitle";

type ResetPasswordProps = ForgotPasswordPageProps<
  LayoutProps,
  CardProps,
  FormProps
> & {
  successMessage?: string;
};

/**
 * **refine** has forgot password page form which is served on `/forgot-password` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#forgot-password} for more details.
 */
export const ForgotPasswordPage: React.FC<ResetPasswordProps> = ({
  loginLink,
  wrapperProps,
  contentProps,
  renderContent,
  formProps,
  title,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ForgotPasswordFormTypes>();
  const translate = useTranslate();
  const Link = useLink();

  const { mutate: forgotPassword, isPending, isSuccess } =
    useForgotPassword<ForgotPasswordFormTypes>();

  const PageTitle = (<AuthPageTitle title={title} />)

  const CardContent = (
    <AuthCard
      title={translate("pages.forgotPassword.title", "Forgot your password?")}
      contentProps={contentProps}
      token={token}
    >
      <Form<ForgotPasswordFormTypes>
        layout="vertical"
        form={form}
        onFinish={(values) => forgotPassword(values)}
        requiredMark={false}
        {...formProps}
      >
        <Form.Item
          name="email"
          label={translate("pages.forgotPassword.fields.email", "Email")}
          rules={[
            { required: true },
            {
              type: "email",
              message: translate(
                "pages.forgotPassword.errors.validEmail",
                "Invalid email address"
              ),
            },
          ]}
        >
          <Input
            type="email"
            size="large"
            placeholder={translate(
              "pages.forgotPassword.fields.email",
              "Email"
            )}
          />
        </Form.Item>
        {isSuccess &&
          (
            <Typography.Paragraph>
              {translate(
                "pages.forgotPassword.resetLinkSent",
                "If your account was created using an email and password, we've sent a password reset link to your email address. If you signed up with Google, please sign in with your Google account instead."
              )}
            </Typography.Paragraph>
          )
        }
        <Flex
          justify="space-between"
        >
          {loginLink ?? (
            <Typography.Text
              style={{
                fontSize: 12,
                marginLeft: "auto",
              }}
            >
              {translate(
                "pages.register.buttons.haveAccount",
                "Have an account? "
              )}{" "}
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
          )}
        </Flex>
        <Form.Item
          style={{
            marginTop: "24px",
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
            {translate(
              "pages.forgotPassword.buttons.submit",
              "Send reset instructions"
            )}
          </Button>
        </Form.Item>
      </Form>
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
