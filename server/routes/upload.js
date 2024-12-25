import express from 'express';
import multer from 'multer';
import { handleFileUpload } from '../controllers/uploadController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('coverImage'), handleFileUpload);

export default router;