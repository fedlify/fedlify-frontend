import React, { useRef } from "react";
import {
  UpdatePasswordPageProps,
  UpdatePasswordFormTypes,
  useActiveAuthProvider,
  useTranslate,
  useUpdatePassword,
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
  theme,
  Progress,
  Flex
} from "antd";
import { useLocation } from "react-router";
import { getPasswordStrength, passwordPattern, passwordFormatError } from './password';

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

  const passwordInputRef = useRef<HTMLDivElement>(null);
  const { styles: progressStyle } = useProgressStyle();
  const { score, label, color } = getPasswordStrength(Form.useWatch('password', form) ?? '');

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
      {translate("pages.updatePassword.title", "Set new password")}
    </Typography.Title>
  );

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
    </Card>
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align="middle"
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
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
