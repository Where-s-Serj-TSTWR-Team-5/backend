// start.js setup from learnnode.com by Wes Bos
import Express, { Application, Request, Response, NextFunction } from 'express';
import * as Dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// loads: backend/apigateway/.env  (adjust if your structure differs)
Dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

console.log('GATEWAY JWT_SECRET loaded:', Boolean(process.env.JWT_SECRET));
import IndexRouter from './routes/index.ts';
import { errorHandler } from './middleware/errors/errorHandler.ts';

const app: Application = Express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3011;

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use('/', IndexRouter);

// 404 catch-all handler (middleware)
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('Resource not found', { cause: 404 });
  } catch (err) {
    next(err);
  }
});

// Error handler (last) - implemented a custom error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`💻 Apigateway running → PORT ${port}`);
});
