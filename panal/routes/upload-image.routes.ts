import { Router } from 'express'
const router = Router();
const multer = require("multer");

const bodyParser = require('body-parser');
router.use(bodyParser.json());
let distination = ''

let dir = '../etmana-sa-store/src/assets/images/banners'

router.use('/destination', (req, res, next) => {
  let dist = req.body.distination
  distination = dist == 1 ? 'etmana-sa-store' : 'etmana-eg-store'
  // console.log('detinations', distination, 'dist body :' + dist);

  next();
});

const bannerSourcePath = (): string => `../${distination}/src/assets/images/banners`;

const storage = multer.diskStorage({
  // destination: dir,
  destination: (req: any, file: any, cb: any) => {
    console.log('detinations', bannerSourcePath());
    cb(null, distination ? bannerSourcePath() : './upload'); // Corrected destination path
  },
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
// const upload = multer({ dest: './uploads/' })
router.post("/upload", upload.single('file'), (req: any, res) => {
  console.log('done');

  res.status(200).json({
    success: 1,
    message: `Image ${req.file.originalname} Uploaded successfully`
  })
  console.log('done2');

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
