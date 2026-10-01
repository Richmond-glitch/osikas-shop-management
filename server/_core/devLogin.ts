import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export function registerDevLoginRoutes(app: Express) {
  if (process.env.NODE_ENV !== "development") return;

  app.post("/api/dev-login", async (req: Request, res: Response) => {
    const role = req.body?.role === "admin" ? "admin" : "user";
    const openId = `dev-${role}`;
    const name = role === "admin" ? "Dev Admin" : "Dev Client";

    await db.upsertUser({
      openId,
      name,
      email: `${openId}@local`,
      loginMethod: "dev",
      role,
      lastSignedIn: new Date(),
    });

    const sessionToken = await sdk.createSessionToken(openId, {
      name,
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS,
    });

    res.json({ success: true });
  });
}
