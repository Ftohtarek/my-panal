import { Router } from 'express'
import { IBannerModel } from 'src/app/private/models/banner';
import copy from '../stream/copy-stream';
import copyDirectory from '../stream/copy-dir';
const router = Router();
const fs = require('fs');

const sourcePath = "./src/assets/json/home-banners.json"
const outPath = "../upload/home-banners.json"

const bannerSourcePath = './src/assets/images/banners/';
const bannerOutPath = '../upload/banners/';

const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.get('/home-banners', (req, res) => {
  updateOutPathDir()
  res.send(getJson())
})

router.post('/home-banners', (req: any, res) => {
  const banners = req.body.banner_data;
  const row = req.body.banner_row;
  updateBanner(banners, row)
  res.status(200).json({ data: getOutPathJson(), message: 'Banner row updated successfully' })
})

router.get('/move-to-work-dir', (req: any, res) => {
  moveToWorkDir()
  res.status(200).json({ data: getJson(), message: 'data moved to work dirctory and page will force relod' })
})

function updateOutPathDir() {
  copy(sourcePath, outPath)
  copyDirectory(bannerSourcePath, bannerOutPath)
}

function moveToWorkDir() {
  copy(outPath, sourcePath)
  copyDirectory(bannerOutPath, bannerSourcePath)
}

function updateBanner(banners: IBannerModel, row: number) {
  const bannerJson: IBannerModel[] = getJson();
  bannerJson[row] = banners
  bannerJson[0].rondomKey = Date.now()
  saveJson(bannerJson)
}

const getJson = () => JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
const getOutPathJson = () => JSON.parse(fs.readFileSync(outPath, 'utf-8'));
const saveJson = (json: IBannerModel[]) => fs.writeFileSync(outPath, JSON.stringify(json))
export default router;

