// Shared by the proxy (src/proxy.ts) and the trade modules. No imports on purpose.

export const TRADE_SESSION_COOKIE = "nutrizen_trade_session";
export const TRADE_LOGIN_PATH = "/trade/login";
export const TRADE_VERIFY_PATH = "/trade/verify";

export const MAGIC_LINK_TTL = "15m";
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
