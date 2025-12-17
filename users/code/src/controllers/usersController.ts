import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { User } from '../../prisma/types.ts';
const prisma: PrismaClient = new PrismaClient();

/**
 * Interface for the response object
 */
interface ClientResponse {
  meta: {
    count: number
    title: string
    url: string
  },
  data: User[]
}

/**
 * Function to get all people
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getUsers(req: Request, res: Response): Promise<void> {
  const users: User[] = await prisma.user.findMany();
  const clientReponse: ClientResponse = {
    meta: {
      count: users.length,
      title: 'All users',
      url: req.url
    },
    data: users
  };
  res.status(200).send(clientReponse);
}

/**
 * Function to get a person by id
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: number = parseInt(req.params.id);

  try {
    const user: User = await prisma.user.findUnique({
      where: {
        id: id
      }
    });
    console.log('event:', user);
    if (!user) {
      throw new Error('Event not found', { cause: 404 });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err); // forwards to the error handler
  }
}

/**
 * Function to login a user
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<Response>}
 */
export async function loginUser(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  if (!email || !password) {
    console.log('Missing credentials');
    return res.status(400).json({ message: 'Missing credentials' });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  });

  console.log('User fetched from DB:', user);

  if (!user) {
    console.log('User not found in DB');
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  console.log('Password valid:', valid);

  if (!valid) {
    console.log('Password mismatch');
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  console.log('JWT token generated for userId:', user.id);

  return res.json({
    token,
    user: {
      id: user.id,
      userName: user.userName,
      email: user.email,
      points: user.points
    }
  });
}

async function hashExistingPasswords() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    if (!user.password.startsWith('$2b$')) {
      const hashed = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed }
      });
      console.log(`Hashed password for ${user.email}`);
    }
  }
}

hashExistingPasswords().then(() => {
  console.log('All passwords hashed');
  prisma.$disconnect();
});
