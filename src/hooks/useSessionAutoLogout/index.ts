import { useEffect } from "react";
import Parse from "parse";

export function useSessionAutoLogout() {
  useEffect(() => {
    const storage = Parse.CoreManager.getStorageController();
    const rememberPath = Parse.Storage.generatePath("rememberMe");

    const handleBeforeUnload = async () => {
      try {
        const remember = await storage.getItemAsync?.(rememberPath);
        if (remember !== "1") { // see authProvider
          await Parse.User.logOut();
        }
      } catch (error) {
        console.warn("Auto logout failed:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
