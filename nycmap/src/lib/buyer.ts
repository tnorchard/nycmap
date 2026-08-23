const TOKEN_KEY = "nycmap-buyer";
const GIFT_KEY = "nycmap-gift";

export function getBuyerToken() {
  if (typeof window === "undefined") return "";
  let token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function peekGiftCode() {
  if (typeof window === "undefined") return "";
  return (window.localStorage.getItem(GIFT_KEY) ?? "").trim().toUpperCase();
}

export function saveGiftCode(code: string) {
  if (typeof window === "undefined") return;
  const next = code.trim().toUpperCase();
  if (next) window.localStorage.setItem(GIFT_KEY, next);
  else window.localStorage.removeItem(GIFT_KEY);
}

export function rememberBoughtLots(ids: string[]) {
  if (typeof window === "undefined" || !ids.length) return;
  try {
    const prev = JSON.parse(window.localStorage.getItem("nycmap-my-lots") || "[]") as string[];
    window.localStorage.setItem("nycmap-my-lots", JSON.stringify([...new Set([...prev, ...ids])]));
  } catch {
    window.localStorage.setItem("nycmap-my-lots", JSON.stringify(ids));
  }
}
