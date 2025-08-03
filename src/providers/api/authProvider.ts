import type { AuthProvider, AuthActionResponse, CheckResponse, OnErrorResponse } from "@refinedev/core";
import Parse from "parse";

// -----------------------------
// Helpers
// -----------------------------
const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1]; // payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const loginWithGoogle = async (id_token: string): Promise<void> => {
  const {
    sub,
    email,
    family_name,
    given_name,
    email_verified,
    name,
    picture,
  } = parseJwt(id_token);

  await Parse.User.logInWith("google", {
    authData: {
      id: sub,
      id_token,
      email,
      family_name,
      given_name,
      email_verified,
      name,
      picture,
    },
  });
}

const registerWithGoogle = async (id_token: string): Promise<void> => {
  await loginWithGoogle(id_token);
}

const parseError = (
  error: any,
  fallback: { name?: string; message?: string } = {}
): AuthActionResponse => {
  const isParseError = !!error?.code;

  return {
    success: false,
    error: {
      statusCode: error?.code,
      name: isParseError
        ? error?.message
        : error?.name || fallback.name || "Error",
      message: isParseError
        ? error?.name
        : error?.message || fallback.message || "Something went wrong.",
    },
  };
};

// -----------------------------
// AuthProvider Methods
// -----------------------------
const register = async ({
  email,
  password,
  recaptchaToken,
  providerName,
  credential,
}: {
  email: string;
  password: string;
  recaptchaToken?: string;
  providerName?: string;
  credential?: string;
}): Promise<AuthActionResponse> => {
  try {
    if (providerName === "google") {
      if (!credential) {
        return {
          success: false,
          error: {
            message: "Register failed",
            name: "Missing Google credential",
          },
        };
      }
      await registerWithGoogle(credential);
    } else {
      const user = new Parse.User();
      user.set("username", email);
      user.set("email", email);
      user.set("password", password);

      await user.signUp(null, {
        context: {
          recaptchaToken,
        },
      });
    }

    return {
      success: true,
      redirectTo: "/",
    };
  } catch (error: any) {
    return parseError(error, { name: "Sign Up Error", message: "An error occurred during registration. Please try again." });
  }
};

const login = async ({
  email,
  password,
  remember, // rememberMe
  providerName,
  credential,
  recaptchaToken,
}: {
  email: string;
  password: string;
  remember?: boolean;
  providerName?: string;
  credential?: string;
  recaptchaToken?: string;
}): Promise<AuthActionResponse> => {
  try {
    if (providerName === "google") {
      if (!credential) {
        return {
          success: false,
          error: {
            message: "Login failed",
            name: "Missing Google credential.",
          },
        };
      }
      await loginWithGoogle(credential);
    } else {
      const user = new Parse.User();
      user.set("username", email);
      user.set("password", password);

      await user.logIn({ context: { recaptchaToken, }, });
      // Set rememberMe flag (used for session cleanup if the tab is closed and rememberMe is false)
      Parse.CoreManager.getStorageController()?.setItem?.(Parse.Storage.generatePath('rememberMe'), remember ? '1' : '0');
    }
    return { success: true, redirectTo: "/" };
  } catch (error: any) {
    return parseError(error, { name: "Login Error", message: "Invalid email or password." });
  }
};

const updatePassword = async ({
  token,
  password, // newPassword
}: {
  token: string;
  password: string;
}): Promise<AuthActionResponse> => {
  try {
    if (!token) throw new Parse.Error(Parse.Error.INVALID_VALUE, "No reset token provided.");

    const urlencoded = new URLSearchParams();
    urlencoded.append("new_password", password);
    urlencoded.append("token", token);

    await (Parse.CoreManager.getRESTController()
      .ajax("POST", `${Parse.serverURL}/apps/${Parse.applicationId}/request_password_reset`,
        urlencoded,
        {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest"
        })).catch(Parse.CoreManager.getRESTController().handleError);

    return {
      success: true,
      redirectTo: "/login",
      successNotification: {
        message: "Password Updated",
        description: "Your password was updated successfully.",
      }
    };
  } catch (error: any) {
    return parseError(error, { message: "Update Password Failed", name: "An error occurred while updating your password. Please try again." });
  }
};

const forgotPassword = async ({
  email
}: {
  email: string;
}): Promise<AuthActionResponse> => {
  try {
    await Parse.User.logOut();
    // On the server, requestPasswordReset is rate-limited to protect against brute-force attacks.
    await Parse.User.requestPasswordReset(email);

    return {
      success: true,
      successNotification: {
        description: "Reset Link Sent",
        message: "Reset link sent! Please check your inbox.",
      },

    };

  } catch (error: any) {
    return parseError(error);
  }
};

const logout = async (): Promise<AuthActionResponse> => {
  try {
    await Parse.User.logOut();
    return { success: true, redirectTo: "/login" };
  } catch (error: any) {
    return parseError(error, { name: "Logout Error", message: "An error occurred during logout. Please try again." });
  }
};

const check = async (): Promise<CheckResponse> => {
  const user = await Parse.User.currentAsync();
  if (user) {
    return { authenticated: true };
  }
  return {
    authenticated: false,
    logout: true,
    redirectTo: "/login",
    error: {
      name: "SessionError",
      message: "No active user session found",
    },
  };
};

const onError = async (error: any): Promise<OnErrorResponse> => {
  if (error?.response?.status === 401) {
    return { logout: true };
  }
  return { error };
};

// -----------------------------
// see https://refine.dev/docs/authentication/auth-provider/
// -----------------------------
export const authProvider: AuthProvider = {
  login,
  register,
  logout,
  check,
  updatePassword,
  forgotPassword,
  onError,
  // Optional:
  // getIdentity: async () => {
  //   const user = await Parse.User.currentAsync();
  //   return user
  //     ? { id: user.id, name: user.get("username"), email: user.get("email") }
  //     : null;
  // },
  // getPermissions: async () => {
  //   const user = await Parse.User.currentAsync();
  //   return user?.get("role") || null;
  // },
};
