import Express, { Application } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });

import IndexRouter from './routes/index.js';
import { errorHandler } from './middleware/errors/errorHandler.js';

const app: Application = Express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3020;

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// All routing handled by IndexRouter
// In frontedd, access via /api/plants
app.use('/api', IndexRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`🌱 Plants service running → PORT ${port}`);
});
