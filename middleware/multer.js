import multer from "multer";
import { v4 as uuidv4 } from 'uuid';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // console.log("🚀 ~ file: multer.js:11 ~ file:", file);

        const random=uuidv4()
        cb(null, random + "" + file.originalname)
    }
})

export const upload = multer({ storage: storage , limits: { fileSize: 1024 * 1024 * 8 } })