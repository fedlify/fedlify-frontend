import { Button, Divider, Typography, type GlobalToken } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import type { OAuthProvider } from "@refinedev/core";

export const ProviderButtons: React.FC<{
    providers?: OAuthProvider[];
    login: (params: any) => void; // AuthProvider login/register function
    hideForm?: Boolean;
    dividerText: String;
    token?: GlobalToken;
}> = ({ providers, login, hideForm, dividerText, token }) => {
    if (!providers?.length) return null;

    return (
        <>
            {providers.map((provider: OAuthProvider) =>
                provider.name === "google" ? (
                    <GoogleLogin
                        key={provider.name}
                        onSuccess={(res) => login?.({ providerName: provider.name, credential: res.credential })}
                    // useOneTap
                    // auto_select
                    />
                ) : (
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
                        onClick={() => login({ providerName: provider.name })}
                    >
                        {provider.label}
                    </Button>
                )
            )}
            {!hideForm && (
                <Divider>
                    <Typography.Text style={{ color: token?.colorTextLabel }}>
                        {dividerText}
                    </Typography.Text>
                </Divider>
            )}
        </>
    );
};
