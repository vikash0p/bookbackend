import multer from 'multer';
import { upload } from './multer.js';
import cloudinary from '../utils/cloudinaryOne.js';
import fs from 'fs';

const handleFileUpload = (req, res, next) => {
    upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'file', maxCount: 1 }])(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                throw new Error('File upload error!');
            } else if (err) {
                throw new Error('Internal server error!');
            }

            const coverImage = req.files['coverImage'] ? req.files['coverImage'][0] : null;
            // console.log("🚀 ~ file: uploadMiddleware.js:16 ~ coverImage:", coverImage);
            const file = req.files['file'] ? req.files['file'][0] : null;
            // console.log("🚀 ~ file: uploadMiddleware.js:18 ~ file:", file);

            if (!coverImage && !file) {
                throw new Error('No files uploaded!');
            }

            const uploadPromises = [];

            if (coverImage && (file.mimetype === 'application/webp' || coverImage.mimetype === 'image/jpeg' || coverImage.mimetype === 'image/png')) {
                uploadPromises.push(new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(coverImage.path, { folder: 'booksImage' }, (error, result) => {
                        if (error) {
                            reject('Upload of cover image to Cloudinary failed!');
                        } else {
                            fs.unlinkSync(coverImage.path);
                            resolve(result.secure_url);
                        }
                    });
                }));
            }

            if (file ) {
                uploadPromises.push(new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(file.path, { folder: 'booksPdf' }, (error, result) => {
                        if (error) {
                            reject('Upload of file to Cloudinary failed!');
                        } else {
                            fs.unlinkSync(file.path);
                            resolve(result.secure_url);
                        }
                    });
                }));
            }

            const urls = await Promise.all(uploadPromises);

            req.uploadedUrls = {
                coverImageUrl: urls[0] || null,
                fileUrl: urls[1] || null
            };

            next();
        } catch (error) {
            return res.status(500).json({ message: "failed to create book", success:false, error:error.message });
        }
    });
};

export default handleFileUpload;
