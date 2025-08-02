import React from "react";
import { ThemedLayoutContextProvider } from "@refinedev/antd";
import { ThemedHeaderV2 as DefaultHeader } from "./header";
import { ThemedSiderV2 as DefaultSider } from "./sider";
import { Layout as AntdLayout, Flex } from "antd";
import type { RefineThemedLayoutV2Props } from "@refinedev/antd";
import { useSessionAutoLogout } from '../../hooks';

export const ThemedLayoutV2: React.FC<RefineThemedLayoutV2Props> = ({
  children,
  Header,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
  initialSiderCollapsed,
  // onSiderCollapsed,
}) => {
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;
  const hasSider = !!SiderToRender({ Title });
  useSessionAutoLogout();

  return (
    <ThemedLayoutContextProvider
      initialSiderCollapsed={initialSiderCollapsed}
      // onSiderCollapsed={onSiderCollapsed}
    >
      <AntdLayout style={{ height: "100vh" }} hasSider={hasSider}>
        <SiderToRender Title={Title} />
        <AntdLayout>
          <HeaderToRender />
          <AntdLayout.Content style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Flex
              vertical
              style={{
                flex: 1,
                overflow: "hidden", // Prevent scroll bleed to body
                paddingRight: 8,
                paddingBottom: 8,
              }}
            >
              {children}
            </Flex>
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
          {Footer && <Footer />}
        </AntdLayout>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};
