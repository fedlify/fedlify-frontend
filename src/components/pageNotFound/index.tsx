import React from "react";
import {
  useGo,
  useTranslate,
} from "@refinedev/core";
import { Button, Result, Typography } from "antd";
import { useLocation } from "react-router";

/**
 * When the app is navigated to a non-existent route, refine shows a default error page.
 * A custom error component can be used for this error page.
 *
 * @see {@link https://refine.dev/docs/packages/documentation/routers/} for more details.
 */
export const PageNotFound: React.FC = () => {
  const translate = useTranslate();
  const go = useGo();
  const location = useLocation();

  // Check if URL is clearly invalid (e.g. slug doesn't match known routes)
  const isInvalidSlug = location.pathname.includes("invalid-link");

  const fallbackMessage = translate(
    "pages.error.404",
    "Sorry, the page you visited does not exist."
  );

  const invalidSlugMessage = translate(
    "pages.error.invalidSlug",
    "The link you followed appears to be invalid or has expired."
  );

  return (
    <Result
      status="404"
      title="404"
      subTitle={
        <Typography.Text>
          {isInvalidSlug ? invalidSlugMessage : fallbackMessage}
        </Typography.Text>
      }
      extra={[
        <Button
          type="primary"
          onClick={() => {
            go({
              to: {
                resource: "home",
                action: "list",
              },
            });
          }}
        >
          {translate("pages.error.backHome", "Back Home")}
        </Button>,
        <Button
          onClick={() => {
            go({
              to: {
                resource: "login",
                action: "list",
              },
            });
          }}
        >
          {translate("pages.error.backDashboard", "Back Dashboard")}
        </Button>
      ]
      }
    />
  );
};
