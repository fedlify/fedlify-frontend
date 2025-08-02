export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const passwordFormatError = "Password must be at least 8 characters and include uppercase, lowercase, and a number";

type PasswordStrengthLabel = "Weak" | "Medium" | "Strong";

export const getPasswordStrength = (
  password: string,
): { score: number; label: "Weak" | "Medium" | "Strong", color: string; } => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password); // special characters
  const hasLength = password.length >= 8;

  const scoreParts = [hasUpper, hasLower, hasNumber, hasLength];
  const fulfilled = scoreParts.filter(Boolean).length;
  let score = Math.round((fulfilled / (scoreParts.length + 1)) * 100); // +1 to include hasSymbol

  let label: PasswordStrengthLabel = "Weak";

  if (fulfilled == 4) {
    if (hasSymbol) {
      label = "Strong";
      score = 100;
    } else {
      label = "Medium";
    }
  }

  return {
    score,
    label,
    color: strengthColor[label]
  };
};

// Color map (should be outside the function if reused elsewhere)
const strengthColor: Record<PasswordStrengthLabel, string> = {
  Weak: "#f5222d",
  Medium: "#fa8c16",
  Strong: "#7cb305",
};
