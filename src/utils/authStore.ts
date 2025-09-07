export type StoredUser = { login: string };

const KEY = "user";

export function saveUser(user: StoredUser) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {}
}

export function loadUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
