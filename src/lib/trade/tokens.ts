import { SignJWT, jwtVerify } from "jose";

/** "magic" = the emailed sign-in link. "session" = the cookie set after sign-in. */
export type TokenUse = "magic" | "session";

export type TokenClaims = {
  email: string;
  /** Expiry as a unix timestamp in seconds. */
  exp: number;
  jti?: string;
};

const key = (secret: string) => new TextEncoder().encode(secret);

export async function signToken(args: {
  use: TokenUse;
  email: string;
  /** jose time string, e.g. "15m" or "2592000s". */
  expiresIn: string;
  secret: string;
  jti?: string;
}): Promise<string> {
  const jwt = new SignJWT({ use: args.use })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(args.email)
    .setIssuedAt()
    .setExpirationTime(args.expiresIn);
  if (args.jti) jwt.setJti(args.jti);
  return jwt.sign(key(args.secret));
}

/** Returns null for anything that is not a valid, unexpired token of the expected use. */
export async function verifyToken(
  token: string,
  use: TokenUse,
  secret: string
): Promise<TokenClaims | null> {
  try {
    const { payload } = await jwtVerify(token, key(secret), { algorithms: ["HS256"] });
    if (payload.use !== use) return null;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    return { email: payload.sub, exp: payload.exp, jti: payload.jti };
  } catch {
    return null;
  }
}
