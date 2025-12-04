import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import path from "path";
import { error } from "console";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "public");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const name = req.query.name;

    if (!name) {
      return cb(new Error("name is required"));
    }

    const extension = path.extname(file.originalname);

    const fileName = `${name.toLocaleLowerCase()}${extension}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimeType);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

//get route
app.get("/api/getImage", (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  let imageFound = false;
  let imagePath = "";

  for (const ext of extensions) {
    const testPath = path.join(
      __dirname,
      "public",
      `${name.toLocaleLowerCase()}${ext}`
    );
    if (fs.existsSync(testPath)) {
      imagePath = `${name.toLowerCase()}${ext}`;
      imageFound = true;
      break;
    }
  }

  if (imageFound) {
    res.json({
      success: true,
      imagePath: imagePath,
      message: `image found for ${name}`,
    });
  } else {
    res.status(404).json({
      success: false,
      message: `no image found for ${name}`,
    });
  }
});

//post route
app.post("/api/upload", upload.single("image"), (rew, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "file not uploaded",
      });
    }

    const name = req.query.name;

    if (!name) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    res.json({
      success: true,
      message: `image for ${name} uploaded successfully`,
      fileName: req.file.fileName,
      path: req.file.path,
    });
  } catch (e) {
    console.error("error: ", e);
    res.status(500).json({
      success: false,
      message: "error file uploading",
      error: error.message,
    });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "file too large, max size: 5mb",
      });
    }
  }

  res.status(500).json({
    success: false,
    message: error.messgae,
  });
});

app.listen(3000, () => {
  console.log(`path: ${path.join(__dirname, "public")}`);
});
