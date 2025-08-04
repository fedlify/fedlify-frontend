import { useEffect } from "react";
import Parse from "parse";

export function useSessionAutoLogout() {
  useEffect(() => {
    async function handleSessionLogic() {
      try {
        const session = await Parse.Session.current();
        const createdWith = session.get("createdWith");
        const provider = createdWith?.authProvider || "unknown";

        const rememberMe = Parse.CoreManager
          .getStorageController()
          ?.getItem?.(Parse.Storage.generatePath("rememberMe"));

        if (provider === "password" && rememberMe === "0") {
          const createdAt = new Date(session.createdAt!).getTime();
          const now = Date.now();
          const elapsedMs = now - createdAt;
          const oneDayMs = 24 * 60 * 60 * 1000;

          if (elapsedMs > oneDayMs) {
            await Parse.User.logOut();
          }
        }
      } catch (err) {
        console.warn("Session check failed:", err);
      }
    }

    handleSessionLogic();
  }, []);
}
