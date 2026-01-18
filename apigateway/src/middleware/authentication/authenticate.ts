import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Accept: "Bearer <token>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : authHeader.trim();

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('API Gateway JWT_SECRET missing');
    res.status(500).json({ message: 'Server misconfigured' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    // Optional: attach decoded payload for later use
    (req as any).user = decoded;

    next();
  } catch (err) {
    console.error('JWT verify failed in API Gateway:', err);
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
};
