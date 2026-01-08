import Express, { Application, Request, Response, NextFunction } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: './.env' , override: true});
import IndexRouter from './routes/index.ts';
import { errorHandler } from './middleware/errors/errorHandler.ts';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = Express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3010;

// security middleware
app.use(helmet());

// Cors
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// body parsing
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// cookie parsing
app.use(cookieParser());

// All routing handled by IndexRouter
app.use('/', IndexRouter);

// 404
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('Resource not found', { cause: 404 });
  } catch (err) {
    next(err);
  }
});

// error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⭐ Service/Events running → PORT ${port}`);
});
