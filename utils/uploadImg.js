const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (req.baseUrl === "/blog") {
      cb(null, "public/images/posts");
    } else {
      cb(null, "public/images/profiles");
    }
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.png`);
  },
});

const upload = multer({ storage });

module.exports = upload;
