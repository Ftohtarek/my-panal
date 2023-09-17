import { Router } from 'express'
import { IBannerModel } from 'src/app/private/models/banner';
import copy from '../stream/copy-stream';
import copyDirectory from '../stream/copy-dir';
import { cwd } from 'process';
const router = Router();
const fs = require('fs');
let distination = ''
console.log(cwd());

const sourcePath = () => `../${distination}/src/assets/json/home-banners.json`
// const outPath = "../upload/home-banners.json"
// const bannerOutPath = '../upload/banners/';

const bodyParser = require('body-parser');
router.use(bodyParser.json());


router.post('/destination', (req, res) => {
  let dist = req.body.distination
  distination = dist == 1 ? 'etmana-sa-store' : 'etmana-eg-store'
  res.status(200).json({ message: 'set destination Successfully to :->' + distination })
})


router.get('/home-banners', (req, res) => {
  // updateOutPathDir()
  res.send(getJson())
})

router.post('/home-banners', (req: any, res) => {
  const banners = req.body.banner_data;
  const row = req.body.banner_row;
  updateBanner(banners, row)
  res.status(200).json({ data: getJson(), message: 'Banner row updated successfully' })
})


// function updateOutPathDir() {
//   copy(sourcePath, outPath)
//   copyDirectory(bannerSourcePath, bannerOutPath)
// }

// function moveToWorkDir() {
//   copy(outPath, sourcePath)
//   copyDirectory(bannerOutPath, bannerSourcePath)
// }

function updateBanner(banners: IBannerModel, row: number) {
  const bannerJson: IBannerModel[] = getJson();
  bannerJson[row] = banners
  bannerJson[0]['rondomKey'] = Date.now()
  saveJson(bannerJson)
}

const getJson = () => JSON.parse(fs.readFileSync(sourcePath(), 'utf-8'));
const saveJson = (json: IBannerModel[]) => fs.writeFileSync(sourcePath(), JSON.stringify(json))

export default router;

