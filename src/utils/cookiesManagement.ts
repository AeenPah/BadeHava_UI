const COOKIE_PREFIX = "BadeHavaApp_";

export function getCookie(key: string): string | null {
  const name = COOKIE_PREFIX + key + "=";
  const cookies = document.cookie.split("; ");
  for (const c of cookies) {
    if (c.startsWith(name)) {
      return decodeURIComponent(c.substring(name.length));
    }
  }
  return null;
}

export function setCookie(key: string, value: string, days = 5) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_PREFIX}${key}=${encodeURIComponent(
    value
  )}; expires=${date.toUTCString()}; path=/`;
}
