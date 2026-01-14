import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@shared/middleware';

export function requireRole(...allowedRoles: Array<'USER' | 'GREEN_OFFICE_MEMBER'>) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      return;
    }

    next();
  };
}
