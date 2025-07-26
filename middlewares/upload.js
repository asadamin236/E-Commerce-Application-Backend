const multer = require("multer");
const path = require("path");

// Allowed image extensions
const imageTypes = /jpeg|jpg|png|gif|webp|svg|bmp/;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const isValidExt = imageTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = imageTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only valid image files are allowed (jpg, png, webp, etc.)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
