import Express, { NextFunction, Request, Response, Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import type { Filter, Options, RequestHandler } from 'http-proxy-middleware';
import { ApiError } from '../middleware/errors/apiError.ts';
// import { authenticateToken } from '../middleware/authentication/authenticate.ts';
const router: Router = Express.Router();

// Helper to send consistent error when a microservice is unavailable
function handleProxyError(serviceName: string, err: Error, req: Request, res: Response) {
  const apiError = new ApiError(
    502,
    `${serviceName.toUpperCase()}_SERVICE_UNAVAILABLE`,
    `${serviceName} service is unavailable`,
    { originalError: err.message }
  );

    // If you want to go through your global errorHandler, you’d call next(apiError),
  // but we don't have `next` here, so we respond directly using the same shape:
  res.status(apiError.status).json({
    success: false,
    status: apiError.status,
    code: apiError.code,
    message: apiError.message,
    details: apiError.details,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
}

// Plants microservice proxy
const plantsProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://plants:3020',
  on: {
    proxyReq: fixRequestBody,
    error: (err, req, res) => {
      handleProxyError('plants', err, req as Request, res as Response);
    },
  },
  changeOrigin: true
});

// Users microservice proxy
const usersProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://users:3023',
  on: {
    proxyReq: fixRequestBody,
    error: (err, req, res) => {
      handleProxyError('users', err, req as Request, res as Response);
    },
  },
  changeOrigin: true
});

// Events microservice proxy
const eventsProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://events:3021',
  on: {
    proxyReq: fixRequestBody,
    error: (err, req, res) => {
      handleProxyError('events', err, req as Request, res as Response);
    },
  },
  changeOrigin: true
});

// Rewards microservice proxy
const rewardsProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://rewards:3022',
  on: {
    proxyReq: fixRequestBody,
    error: (err, req, res) => {
      handleProxyError('rewards', err, req as Request, res as Response);
    },
  },
  changeOrigin: true
});

// test route
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'gateway alive' });
  // next();
});


// router.use('/appointments', appointmentProxy);
// If you want to add authentication to the microservice routes, add the authenticateToken middleware
// router.use('/appointments', authenticateToken, appointmentProxyMiddleware);
router.use('/plants', plantsProxyMiddleware);
router.use('/events', eventsProxyMiddleware);
router.use('/rewards', rewardsProxyMiddleware);
router.use('/users', usersProxyMiddleware);

export default router;
