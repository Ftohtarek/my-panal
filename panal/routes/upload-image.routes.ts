import { Router } from 'express'
const router = Router();
const multer = require("multer");
const path = require("path");

// storage engine
// const uploadPath = './src/assets/images/banners'
const uploadPath = '../upload/banners'

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req: any, file: any, cb: any) => {
    return cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000
  }
})

router.post("/upload", upload.single('file'), (req: any, res) => {
  res.status(200).json({
    success: 1,
    message: `Image ${req.file.originalname} Uploaded successfully`
  })
});

function errHandler(err: any, req: any, res: any, next: any) {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      success: 0,
      message: err.message
    })
  }
}

router.use(errHandler);

export default router
