import type { Request, Response, NextFunction } from "express";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const authUrl = process.env.AUTH_SERVICE_URL;
    if (!authUrl) {
      return res.status(500).json({ message: "AUTH_SERVICE_URL not set" });
    }

    const r = await fetch(`${authUrl}/auth/verify`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });

    if (!r.ok) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  } catch (err) {
    return res.status(503).json({ message: "Auth service unavailable" });
  }
};
