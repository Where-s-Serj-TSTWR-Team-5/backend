import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma, type Role } from '@database/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    userName: string;
    email: string;
    role: Role;
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token) as { userId?: number; iat?: number; exp?: number } | null;

    const user = await prisma.user.findUnique({
      where: { id: decoded?.userId },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    console.log(user);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
