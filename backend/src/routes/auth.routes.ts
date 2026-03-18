import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// ─── Validation Schemas ───────────────────────────────────
const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── Helper: Generate Tokens ──────────────────────────────
const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};

// ─── POST /api/auth/register ──────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        passwordHash,
        phone: body.phone,
      },
      select: { id: true, email: true, fullName: true, role: true },
    });

    const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email, role: user.role });
    
    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: { user, accessToken, refreshToken },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, email: true, fullName: true, role: true, passwordHash: true, isActive: true },
    });

    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
    }

    const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email, role: user.role });
    
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      message: 'Login successful!',
      data: { user: safeUser, accessToken, refreshToken },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/auth/refresh ───────────────────────────────
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: decoded.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────
router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// ─── GET /api/auth/me ─────────────────────────────────────
router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, fullName: true, phone: true, role: true, profilePhoto: true },
    });
    return res.json({ success: true, data: user });
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

export { router as authRouter };
