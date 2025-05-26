const cloudinary = require('cloudinary').v2;
const multer = require("multer")
const dotenv = require("dotenv");
dotenv.config();
const storage = multer.memoryStorage();

const upload = multer({ storage: storage })


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return result;
    } catch (error) {
        console.log("🚀 ~ uploadFile ~ error:", error)
        console.log(error.message);
    }
}

module.exports = { upload, uploadFile };
