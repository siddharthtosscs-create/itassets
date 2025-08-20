import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export interface DecodedToken {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as string | JwtPayload;
    if (typeof decoded === "string") return null;
    const maybeId = (decoded as any).id;
    const maybeEmail = (decoded as any).email;
    if (typeof maybeId === "string" && typeof maybeEmail === "string") {
      return decoded as DecodedToken;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Helper to get the logged-in user payload from cookie
 */
export async function getUserFromCookie(): Promise<DecodedToken | null> {
  const jar = await (cookies() as any);
  const token = jar?.get("token")?.value as string | undefined;
  if (!token) return null;
  return verifyToken(token);
}
