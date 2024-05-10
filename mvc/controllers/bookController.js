import cloudinary from "../../utils/cloudinaryOne.js";
import Book from "../models/bookSchema.js";
import path from "path";
import fs from "fs";
export const createBook = async (req, res) => {
    try {
        const resultImage = await cloudinary.uploader.upload(req.files.coverImage[0].path, { folder: 'booksImage' });
        const resultUrl = await cloudinary.uploader.upload(req.files.file[0].path, { folder: 'bookPdf' });

        const book = await Book.create({
            title: req.body.title,
            author: req.id,
            genre: req.body.genre,
            coverImage: resultImage.secure_url,
            file: resultUrl.secure_url
        });


        await fs.promises.unlink(req.files.coverImage[0].path);
        await fs.promises.unlink(req.files.file[0].path);






        res.status(200).json({ message: "book create successfully !", success: true, book });
    } catch (error) {
        console.error("Error uploading book cover:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getAllBooks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;


    try {
        const book = await Book.find().limit(limit).skip(startIndex).exec();
        if (endIndex < await Book.countDocuments().exec()) {
            Book.next = {
                page: page + 1,
                limit: limit
            };
        }

        res.status(200).json({ message: "get all books successfully", bookLength: book.length, success: true, book });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "failed to get all books", success: false, error: error.message });
    }

}
