import React, { useRef } from "react";
import {
  UpdatePasswordPageProps,
  UpdatePasswordFormTypes,
  useActiveAuthProvider,
  useTranslate,
  useUpdatePassword,
} from "@refinedev/core";
import {
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
import { useLocation } from "react-router";
import { AuthCard } from "../authCard";
import { AuthLayout } from "../authLayout";
import { AuthPageTitle } from "../authPageTitle";
import { getPasswordStrength, passwordPattern, passwordFormatError, usePasswordStrengStyle } from "../passwordStrengthMeter";

type UpdatePasswordProps = UpdatePasswordPageProps<LayoutProps, CardProps, FormProps>;
type UpdatePasswordFormExtended = UpdatePasswordFormTypes & {
  token?: string;
};

/**
 * **refine** has update password page form which is served on `/update-password` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#update-password} for more details.
 */
export const UpdatePasswordPage: React.FC<UpdatePasswordProps> = ({
  wrapperProps,
  contentProps,
  renderContent,
  formProps,
  title,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const resetPasswordToken = params.get("token") ?? '';

  const { token } = theme.useToken();
  const [form] = Form.useForm<UpdatePasswordFormExtended>();
  const translate = useTranslate();
  const authProvider = useActiveAuthProvider();
  const { mutate: updatePassword, isPending } =
    useUpdatePassword<UpdatePasswordFormExtended>({
      v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });

  const { styles: progressStyle } = usePasswordStrengStyle();
  const { score, label, color } = getPasswordStrength(Form.useWatch('password', form) ?? '');
  const passwordInputRef = useRef<HTMLDivElement>(null);

  const PageTitle = (<AuthPageTitle title={title} />)

  const CardContent = (
    <AuthCard
      title={translate("pages.updatePassword.title", "Set new password")}
      contentProps={contentProps}
      token={token}
    >
      <Form<UpdatePasswordFormTypes>
        layout="vertical"
        form={form}
        onFinish={(values) => updatePassword({ ...values, token: resetPasswordToken })}
        requiredMark={false}
        {...formProps}
      >
        <Form.Item
          name="password"
          label={translate(
            "pages.updatePassword.fields.password",
            "New Password"
          )}
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
          style={{ marginBottom: "12px" }}
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
          label={translate(
            "pages.updatePassword.fields.confirmPassword",
            "Confirm New Password"
          )}
          hasFeedback
          dependencies={["password"]}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    translate(
                      "pages.updatePassword.errors.confirmPasswordNotMatch",
                      "Passwords do not match"
                    )
                  )
                );
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
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
            {translate("pages.updatePassword.buttons.submit", "Update")}
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
