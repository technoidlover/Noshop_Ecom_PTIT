import { Router, Request, Response } from 'express';
import { upload } from '../middlewares/upload';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/', protect, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'Không có file nào được tải lên.' });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Tải ảnh lên thành công!',
    url: fileUrl
  });
});

export default router;
