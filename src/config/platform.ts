function configuredAppUrl(): string {
  const value = import.meta.env.VITE_PLATFORM_APP_URL?.trim();
  return (value || "https://app.fedlify.com").replace(/\/$/, "");
}

export const platformAppUrl = configuredAppUrl();
