import { Route, Outlet } from "react-router";
import { ResourceProps } from "@refinedev/core";
import { Authenticated } from "@refinedev/core";
import { ThemedLayoutV2 as AppThemedLayoutV2 } from "../../components";
import { CatchAllNavigate } from "@refinedev/react-router";
import { Card as AntdCard } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { CategoryList } from "./categories";

// see https://refine.dev/docs/routing/integrations/react-router/
export const getRoute = (): React.ReactElement => {
    return (
        <Route
            element={
                <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/auth/login" />}
                >
                    <AppThemedLayoutV2
                        // Title={Title}
                        initialSiderCollapsed={true}
                        // onSiderCollapsed={() => { }}
                    >
                        <AntdCard
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                overflow: "auto",
                            }}
                        >
                            <Outlet />
                        </AntdCard>
                    </AppThemedLayoutV2>
                </Authenticated>
            }
        >
            <Route path="/dashboard">
                <Route path="categories" element={<CategoryList />} />
            </Route>
        </Route>
    );
}

// see https://refine.dev/docs/routing/integrations/react-router/
export const getResources = (): ResourceProps[] => {
    return [
        {
            name: "dashboard",
            list: "/dashboard",
            meta: {
                label: "dashboard",
                // icon: <DashboardOutlined />,
            },
        },
        {
            name: "categories",
            list: "/dashboard/categories",
            meta: {
                icon: <ShoppingOutlined />,
                // parent: "dashboard",
            },
        }
    ];
}