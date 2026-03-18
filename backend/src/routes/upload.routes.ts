import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// ─── POST /api/upload/image ───────────────────────────────
// Note: Install cloudinary package and configure below when ready
router.post('/image', authMiddleware, async (_req: Request, res: Response) => {
  // TODO: Setup Cloudinary credentials in .env, then uncomment:
  // const cloudinary = require('cloudinary').v2;
  // cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
  // });
  // const result = await cloudinary.uploader.upload(req.body.image, { folder: 'orderpk' });
  // return res.json({ success: true, url: result.secure_url });
  
  return res.json({
    success: true,
    message: 'Upload endpoint ready — configure Cloudinary credentials in .env to enable',
    url: 'https://via.placeholder.com/400x300',
  });
});

export { router as uploadRouter };
