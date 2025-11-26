import Express, { Application, Request, Response } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });

const app: Application = Express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3020;

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// 🔹 TEMP: super simple /plants route, no Prisma, no controller
app.get('/plants', (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Tomato' },
    { id: 2, name: 'Strawberry' },
  ]);
});

app.listen(port, () => {
  console.log(`🍿 Plants service running → PORT ${port}`);
});
