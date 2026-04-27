import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadCourses, searchCourses, getCourseById } from '../controllers/courseController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.csv') {
      return cb(new Error('Only CSV files are allowed') as any, false);
    }
    cb(null, true);
  }
});

router.post('/upload', upload.single('file'), uploadCourses);
router.get('/search', searchCourses);
router.get('/:id', getCourseById);

export default router;
