import express from 'express';
import { createBook, getAllBooks } from '../controllers/bookController.js';
import handleFileUpload from '../../middleware/uploadMiddleware.js';
import { VerifyToken } from '../../middleware/authentication.js';
import { upload } from '../../middleware/multer.js';


const router = express.Router();

const multerData = upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'file', maxCount: 1 }]);

router.post('/get', VerifyToken, multerData,  createBook);


router.get('/getBook',  getAllBooks);






export default router;