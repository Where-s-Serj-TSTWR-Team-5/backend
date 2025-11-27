import Express, { NextFunction, Request, Response, Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import type { Filter, Options, RequestHandler } from 'http-proxy-middleware';
// import { authenticateToken } from '../middleware/authentication/authenticate.ts';
const router: Router = Express.Router();


// create a proxy for each microservice
// add the on: { proxyReq: fixRequestBody } to fix the body issue with POST/PUT requests
// see https://www.npmjs.com/package/http-proxy-middleware#intercept-and-manipulate-requests

// Plants microservice proxy
const plantsProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://plants:3020/plants',
  on: {
    proxyReq: fixRequestBody,
  },
  changeOrigin: true
});

// Events microservice proxy
const eventsProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://events:3021/events',
  on: {
    proxyReq: fixRequestBody,
  },
  changeOrigin: true
});

// Rewards microservice proxy
const rewardsProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://rewards:3022/rewards',
  on: {
    proxyReq: fixRequestBody,
  },
  changeOrigin: true
});

// test route
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'gateway alive' });
  next();
});


// router.use('/appointments', appointmentProxy);
// If you want to add authentication to the microservice routes, add the authenticateToken middleware
// router.use('/appointments', authenticateToken, appointmentProxyMiddleware);
router.use('/plants', plantsProxyMiddleware);
router.use('/events', eventsProxyMiddleware);
router.use('/rewards', rewardsProxyMiddleware);

export default router;
