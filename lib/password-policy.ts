// Shared admin-account password rule — used both server-side (create/edit
// user API routes, the real source of truth) and client-side (UserManagement
// form, for instant feedback before hitting the server). No imports, so it's
// safe to use from both server routes and "use client" components.

export const PASSWORD_MIN_LENGTH = 9;
export const PASSWORD_HINT = `At least ${PASSWORD_MIN_LENGTH} characters, with at least one number and one special character.`;

const HAS_NUMBER = /[0-9]/;
const HAS_SPECIAL_CHAR = /[^A-Za-z0-9]/;

// Returns an error message string if the password is invalid, or null if
// it passes every rule.
export function getPasswordError(password: string | null | undefined): string | null {
  const value = String(password || "");
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!HAS_NUMBER.test(value)) {
    return "Password must include at least one number.";
  }
  if (!HAS_SPECIAL_CHAR.test(value)) {
    return "Password must include at least one special character.";
  }
  return null;
}
