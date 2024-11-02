import type { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";

export default function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (username === 'user' && password === 'password') {
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 3600, // 1 час
      }));

      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
